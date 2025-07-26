// Alternative approach: Skeleton loaders for better UX
// This could be implemented for client-side hydration scenarios

export function createSkeletonState() {
  return {
    followers: "---",
    publicRepos: "---",
    totalStars: "---",
    isLoading: true,
    projects: Array(3).fill({
      title: "Loading...",
      description: "Loading project information...",
      language: "---",
      stars: "---",
      githubUrl: "#",
    }),
  };
}

// Usage in components with client-side hydration:
// const [githubStats, setGithubStats] = useState(createSkeletonState());
//
// useEffect(() => {
//   fetchGitHubStats().then(setGithubStats);
// }, []);
