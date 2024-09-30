// components/Home.jsx
"use client"; // Ensure this is a client component

import { useSession, signIn } from "next-auth/react";
import Feed from "@components/Feed";

const Home = () => {
  const { data: session } = useSession(); 

  return (
    <section className='w-full flex-center flex-col'>
      {!session?.user ? (
        <div className="login-prompt mt-8 flex flex-col items-center">
          <h1 className='head_text text-center'>
            Discover & Share
            <br className='max-md:hidden' />
            <span className='orange_gradient text-center'> Creative Quotes</span>
          </h1>
          <p className='desc text-center'>
            Share_Quotes is an open-source tool for the modern world to discover, create, and share creative quotes.
          </p>
          <button
            onClick={() => signIn('google')}
            className="cta-btn px-6 py-3 rounded-full text-white bg-orange-500 hover:bg-white hover:text-orange-500 transition-all duration-300 mt-8"
          >
            Sign In Now!
          </button>
        </div>
      ) : (
        <>
          <h1 className='text-3xl text-center'>
            Welcome back, <span className='orange_gradient'>{session.user.name.split(' ')[0]}</span>
          </h1>
          <p className='desc orange_gradient text-center'>
            Check out some of the newest quotes from our community!
          </p>
          <Feed />
        </>
      )}
    </section>
  );
};

export default Home;
