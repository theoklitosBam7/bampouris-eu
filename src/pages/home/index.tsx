import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './styles.scss';

const socials = [
  {
    url: 'https://www.linkedin.com/in/theoklitosbam7',
    icon: 'fab fa-linkedin',
  },
  {
    url: 'https://twitter.com/theoklitosBam7',
    icon: 'fab fa-twitter',
  },
  {
    url: 'https://github.com/theoklitosBam7',
    icon: 'fab fa-github',
  },
];

const duties = [
  { title: 'Angular, Node.js' },
  { title: 'Business requirements analysis' },
  { title: 'Application design and development' },
  { title: 'Technical documentation' },
  { title: 'Testing and debugging software' },
  { title: 'Production troubleshooting and support' },
];

function Social({ url, icon }): JSX.Element {
  const toUrl = useBaseUrl(url);
  return (
    <React.Fragment>
      {toUrl && (
        <div className="w3-col s4">
          <a href={toUrl} target="_blank">
            <i className={icon} style={{ fontSize: 65 }}></i>
          </a>
        </div>
      )}
    </React.Fragment>
  );
}

function Duties({ title }): JSX.Element {
  return (
    <React.Fragment>
      <li>
        <span className="fa-li">
          <i className="fas fa-check-square"></i>
        </span>
        {title}.
      </li>
    </React.Fragment>
  );
}

function Home(): JSX.Element {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={`Hello from ${siteConfig.title}`} description={siteConfig.customFields.description}>
      <header className="w3-row w3-container bg-1">
        <div className="w3-col s12 w3-center">
          <h1 className="title-1 margin-bt-4">{siteConfig.title}</h1>
          <img className="margin-bt-4 tb-avatar" src={siteConfig.customFields.avatar} width="350" height="350" />
          <h3 className="subtitle-1">{siteConfig.tagline}</h3>
        </div>
      </header>
      <main className="main-landing">
        <section className="w3-container bg-2">
          <h3 className="subtitle-1 margin-bt-4 w3-center">What Am I?</h3>
          <div className="w3-row">
            <p>
              Software Developer with working experience in Insurance and Banking Projects. I develop new features for
              the business's applications, maintaining at the same time the existing ones.
            </p>
            <p>
              I’m a continuous learner of design patterns and architectures with cutting-edge technologies, focusing on
              results and delivering on time.
            </p>

            {duties && duties.length > 0 && (
              <React.Fragment>
                {' '}
                <p>Main technologies and duties involved on project:</p>
                <ul className="fa-ul">
                  {duties.map((dutie, idx) => (
                    <Duties key={idx} {...dutie} />
                  ))}
                </ul>
              </React.Fragment>
            )}

            <p>
              Last but not least, I’m a{' '}
              <a href="https://www.linux.com" target="_blank">
                Linux
              </a>{' '}
              lover.
            </p>
          </div>
        </section>

        {socials && socials.length > 0 && (
          <section className="w3-container w3-center socials">
            <h3 className="subtitle-1 margin-bt-4">Where To Find Me?</h3>
            <div className="w3-row">
              {socials.map((item, idx) => (
                <Social key={idx} {...item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
