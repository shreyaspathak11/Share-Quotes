// app/layout.jsx or app/root-layout.jsx
import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import Head from 'next/head';

export const metadata = {
  title: "Share_Quotes",
  description: "Express your thoughts to the modern world and inspire others",
  icons: {
    icon: "/favicon.ico",
  },
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <Head>
      <link rel="icon" href="/favicon.ico"  />
    </Head>
    <body>
      <Provider>
        <div className='main'>
          <div className='gradient' />
        </div>

        <main className='app'>
          <Nav />
          {children}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
