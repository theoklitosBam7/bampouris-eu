import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import { gitHubStats } from '../../constants/gitHubStats';
import { skills } from '../../constants/skills';
import { socials } from '../../constants/socials';
import { SectionElement } from '../../elements/SectionElement';
import './styles.scss';

function Social({ url, icon }): JSX.Element {
  const toUrl = useBaseUrl(url);
  return (
    <React.Fragment>
      {toUrl && (
        <div className="w3-col s4">
          <a href={toUrl} target="_blank" rel="noreferrer">
            <i className={icon} style={{ fontSize: 65 }}></i>
          </a>
        </div>
      )}
    </React.Fragment>
  );
}

function Skills({ title, url, logo }): JSX.Element {
  return (
    <React.Fragment>
      <a href={url} target="_blank" rel="noreferrer">
        <img src={logo} alt={title} style={{ margin: '16px', width: '50px', height: '50px' }} />
      </a>
    </React.Fragment>
  );
}

function GitStats({ title, url }): JSX.Element {
  return (
    <React.Fragment>
      <img src={url} alt={title} style={{ margin: '8px' }} />
    </React.Fragment>
  );
}

function Home(): JSX.Element {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  const CUSTOM_FIELDS = {
    description: siteConfig.customFields.description as string,
    avatar: siteConfig.customFields.avatar as string,
  };

  return (
    <Layout title={`Hello from ${siteConfig.title}`} description={CUSTOM_FIELDS.description}>
      <SectionElement elemClass={`w3-container w3-row`} lightThemeCls={`bg-1`} darkThemeCls={`bg-1-darkest`}>
        <div className="w3-col s12 w3-center">
          <h1 className="title-1 margin-bt-4">{siteConfig.title}</h1>
          <img
            className="margin-bt-4 tb-avatar"
            src={useBaseUrl(CUSTOM_FIELDS.avatar)}
            alt="avatar_image"
            width="350"
            height="350"
          />
          <h3 className="subtitle-1">{siteConfig.tagline}</h3>
        </div>
      </SectionElement>
      <main className="main-landing">
        <SectionElement elemClass={`w3-container`} lightThemeCls={`bg-5`} darkThemeCls={`bg-4`}>
          <h3 className="subtitle-1 margin-bt-4 w3-center">What Am I?</h3>
          <div className="w3-row">
            <div className="w3-col s12 w3-center">
              <p>Software Engineer with front-end web development orientation.</p>
              <p>
                I participate in analysis, design and implementation of the new features for the company’s web
                applications, maintaining at the same time the existing ones.
              </p>
              <p>
                I’m a continuous learner of design patterns and architectures with cutting-edge technologies, focusing
                on quality and delivering on time.
              </p>
            </div>
          </div>

          {skills && skills.length > 0 && (
            <React.Fragment>
              <div className="w3-row">
                <h3 className="subtitle-1 w3-center">Languages and Tools</h3>
              </div>
              <div className="w3-row margin-1">
                <div className="w3-col w3-center">
                  {skills.map((skill, idx) => (
                    <Skills key={idx} {...skill} />
                  ))}
                </div>
              </div>
            </React.Fragment>
          )}

          {gitHubStats && gitHubStats.length > 0 && (
            <React.Fragment>
              <div className="w3-row margin-1">
                <h3 className="subtitle-1 w3-center">GitHub Stats</h3>
              </div>
              <div className="w3-row">
                <div className="w3-col w3-center">
                  {gitHubStats.map((stat, idx) => (
                    <GitStats key={idx} {...stat} />
                  ))}
                </div>
              </div>
            </React.Fragment>
          )}
        </SectionElement>

        {socials && socials.length > 0 && (
          <SectionElement elemClass={`w3-container w3-center socials`} lightThemeCls={`bg-5`} darkThemeCls={`bg-4`}>
            <h3 className="subtitle-1 margin-bt-4">Where To Find Me?</h3>
            <div className="w3-row">
              {socials.map((item, idx) => (
                <Social key={idx} {...item} />
              ))}
            </div>
          </SectionElement>
        )}
      </main>
    </Layout>
  );
}

export default Home;
