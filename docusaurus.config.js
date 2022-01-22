// @ts-check

const isDeployPreview = !!process.env.NETLIFY && process.env.CONTEXT === 'deploy-preview';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Theoklitos Bampouris',
  tagline: 'Software Engineer | Co-organizer @ Angular Athens Meetup',
  url: 'https://www.bampouris.eu',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://tb-projphotos.netlify.app/avatars/favicon.ico',
  organizationName: 'theoklitosBam7',
  projectName: 'bampouris-eu',
  plugins: ['docusaurus-plugin-sass'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'My Site Logo',
          src: 'img/favicon.png',
        },
        items: [
          { to: 'home', label: 'Home', position: 'left' },
          { to: 'blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/theoklitosBam7/bampouris-eu',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} Theoklitos Bampouris.`,
      },
    }),
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          path: 'blog',
          authorsMapPath: 'authors.yml',
          showReadingTime: true,
          editUrl: 'https://github.com/theoklitosBam7/bampouris-eu/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        gtag: !isDeployPreview
          ? {
              trackingID: 'UA-115207331-1',
              anonymizeIP: true,
            }
          : undefined,
      }),
    ],
  ],
  customFields: {
    avatar: 'img/avatar1.jpg',
    description:
      'Personal web page by Theoklitos Bampouris who lives in Athens (Greece), working as an Software Engineer.',
  },
  stylesheets: [
    {
      href: 'https://www.w3schools.com/w3css/4/w3.css',
      type: 'text/css',
    },
    {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css',
      type: 'text/css',
    },
  ],
};

module.exports = config;
