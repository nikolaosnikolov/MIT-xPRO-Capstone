import Head from 'next/head'
import Menubar from './menubar.js'

function Layout({ children }) {
    return (
        <>
            <div id='mainDiv'>
                <Head>
                    <title>Restaurant App</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                        crossOrigin="anonymous"
                    />
                </Head>
                <Menubar.element />
                <main style={{ height: '90%' }}>{children}</main>
                <div id="snackbar">
                    <div id="cond"></div>
                    <div id="text"></div>
                </div>
            </div>
        </>
    )
}

export { Layout }