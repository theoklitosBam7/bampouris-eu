export interface GitHubUser {
  avatar_url: string;
  bio: null | string;
  followers: number;
  following: number;
  html_url: string;
  location: null | string;
  login: string;
  name: null | string;
  public_repos: number;
}

export interface GitHubRepo {
  created_at: string;
  description: null | string;
  fork: boolean;
  forks_count: number;
  html_url: string;
  language: null | string;
  name: string;
  stargazers_count: number;
  updated_at: string;
}

const GITHUB_USERNAME = "theoklitosBam7";
const API_BASE = "https://api.github.com";

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes (more aggressive for static builds)
const STALE_WHILE_ERROR_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: any;
  timestamp: number;
  etag?: string;
}

class GitHubCache {
  private cache = new Map<string, CacheEntry>();
  private readonly persistentCacheFile = ".github-cache.json";
  private initialized = false;

  async init() {
    if (!this.initialized) {
      await this.loadPersistentCache();
      this.initialized = true;
    }
  }

  private async loadPersistentCache() {
    try {
      // Only load in Node.js environment (during build)
      if (typeof process !== "undefined" && process.versions?.node) {
        const fs = await import("fs");
        const path = await import("path");

        const cacheFilePath = path.join(
          process.cwd(),
          this.persistentCacheFile,
        );
        if (fs.existsSync(cacheFilePath)) {
          const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
          this.cache = new Map(Object.entries(cacheData));
        }
      }
    } catch (error) {
      console.warn("Failed to load persistent cache:", error);
    }
  }

  private async savePersistentCache() {
    try {
      if (typeof process !== "undefined" && process.versions?.node) {
        const fs = await import("fs");
        const path = await import("path");

        const cacheFilePath = path.join(
          process.cwd(),
          this.persistentCacheFile,
        );
        const cacheData = Object.fromEntries(this.cache);
        fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
      }
    } catch (error) {
      console.warn("Failed to save persistent cache:", error);
    }
  }

  get(url: string): CacheEntry | undefined {
    return this.cache.get(url);
  }

  set(url: string, entry: CacheEntry) {
    this.cache.set(url, entry);
    this.savePersistentCache();
  }

  isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }

  isStaleButUsable(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < STALE_WHILE_ERROR_DURATION;
  }
}

const gitHubCache = new GitHubCache();

async function makeRequest(
  url: string,
  cached?: CacheEntry,
): Promise<{ data: any; etag?: string }> {
  const headers: Record<string, string> = {
    "User-Agent": "bampouris-eu-website/1.0",
  };

  // Add ETag for conditional requests if available
  if (cached?.etag) {
    headers["If-None-Match"] = cached.etag;
  }

  const response = await fetch(url, { headers });

  // If 304 Not Modified, return cached data
  if (response.status === 304 && cached) {
    return { data: cached.data };
  }

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const etag = response.headers.get("ETag");

  return { data, ...(etag && { etag }) };
}

async function fetchWithCache(url: string) {
  await gitHubCache.init();
  const cached = gitHubCache.get(url);

  // Return fresh cache if available
  if (cached && gitHubCache.isValid(cached)) {
    return cached.data;
  }

  // Single attempt with fallback to stale cache
  try {
    const result = await makeRequest(url, cached);

    // Update cache with fresh data
    const cacheEntry: CacheEntry = {
      data: result.data,
      timestamp: Date.now(),
      ...(result.etag && { etag: result.etag }),
    };

    gitHubCache.set(url, cacheEntry);
    return result.data;
  } catch (error) {
    console.warn("GitHub API request failed:", error);

    // Use stale cache if available
    if (cached && gitHubCache.isStaleButUsable(cached)) {
      console.warn("Using stale cache due to API failure");
      return cached.data;
    }

    throw error;
  }
}

export async function fetchGitHubUser(): Promise<GitHubUser> {
  try {
    return await fetchWithCache(`${API_BASE}/users/${GITHUB_USERNAME}`);
  } catch (error) {
    console.error("Failed to fetch GitHub user:", error);
    throw error;
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    return await fetchWithCache(
      `${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    );
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    throw error;
  }
}

export async function fetchGitHubStats() {
  try {
    const user = await fetchGitHubUser();
    const repos = await fetchGitHubRepos();

    const totalStars = repos.reduce(
      (sum: number, repo: GitHubRepo) => sum + repo.stargazers_count,
      0,
    );

    return {
      followers: user.followers,
      publicRepos: user.public_repos,
      totalStars,
      isError: false,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);

    return {
      followers: 0,
      publicRepos: 0,
      totalStars: 0,
      isError: true,
      errorMessage: "Unable to load GitHub stats. Please try again later.",
    };
  }
}

export async function fetchFeaturedProjects() {
  try {
    const repos = await fetchGitHubRepos();

    // Filter for featured repositories (customize this list)
    const featuredRepoNames = [
      "mcp-git-commit-generator",
      "css-modules-types-generator",
      "express-greeklish",
    ];

    const featuredRepos = featuredRepoNames
      .map((name) => repos.find((repo) => repo.name === name))
      .filter(Boolean) as GitHubRepo[];

    return {
      projects: featuredRepos.map((repo) => ({
        description:
          repo.description ||
          `A ${repo.language || "code"} project by Theoklitos Bampouris`,
        githubUrl: repo.html_url,
        language: repo.language || "Unknown",
        stars: repo.stargazers_count,
        title: formatRepoName(repo.name),
      })),
      isError: false,
    };
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);

    return {
      projects: [],
      isError: true,
      errorMessage:
        "Unable to load projects from GitHub. Please visit my GitHub profile directly.",
    };
  }
}

function formatRepoName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
