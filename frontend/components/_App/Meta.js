import Head from 'next/head'

const Meta = ({ metaContent }) => {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={metaContent.keywords} />
      <meta name='description' content={metaContent.description} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon.png' />
      <title>{metaContent.title}</title>
    </Head>
  )
}

export default Meta
