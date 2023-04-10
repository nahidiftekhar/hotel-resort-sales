import '@/styles/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from '@/components/_App/Layout'
import { layoutContent } from '@/data/common-static-content'

function MyApp({ Component, pageProps }) {
  return (
    <Layout staticContent={layoutContent}>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
