import '../styles/globals.css'
import '../styles/projectsstyle.css'
import { Layout } from '../components/layout.js'
import { SessionProvider } from "next-auth/react"

const MyApp = ({ Component, session, pageProps }) => {
  return (
    <Layout>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Layout>
  )
}

export default MyApp