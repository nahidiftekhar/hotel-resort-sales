import { getSession } from 'next-auth/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.scss';

import Layout from '@/components/_App/Layout';
import { layoutContent } from '@/data/common-static-content';

function MyApp({ Component, pageProps, session }) {
  return (
    <Layout staticContent={layoutContent}>
      <Component {...pageProps} session={session} />
    </Layout>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // Fetch the session object using getSession
  const session = await getSession(appContext.ctx);

  // Retrieve the initial props of the child component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  // Pass the session object to the custom MyApp component
  return { pageProps, session };
};

export default MyApp;
