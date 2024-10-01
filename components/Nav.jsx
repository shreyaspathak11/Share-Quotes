"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react'; // Remove getProviders and signIn imports
import { useRouter } from 'next/navigation'; // Add useRouter for navigation

const Nav = () => {
  const { data: session } = useSession();
  const router = useRouter(); // Initialize router for navigation
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Navigate to home after sign out
  };

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src='/assets/images/logo.svg'
          alt='logo'
          width={50}
          height={50}
          className='object-contain'
        />
        <p className="logo_text">Share Quotes</p>
      </Link>

      {/* Desktop Nav */}
      {session?.user && (
        <div className="sm:flex hidden">
          <div className='flex gap-3 md:gap-5'>
            <Link href='/create-prompt' className='black_btn'>
              Add a Quote
            </Link>

            <button type="button" onClick={handleSignOut} className='outline_btn'>
              Sign Out
            </button>

            <Link href='/profile'>
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className='object-contain rounded-full'  // Make the image circular
                alt='profile'
              />
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {session?.user && (
        <div className="sm:hidden flex relative">
          <div className='flex'>
            <Image
              src={session?.user.image}
              className="rounded-full" // Make the image circular
              width={37}
              height={37}
              alt='profile'
              onClick={() => setToggleDropdown((prev) => !prev)}
            />

            {toggleDropdown && (
              <div className='dropdown'>
                <Link 
                  href="/profile"
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>

                

                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    handleSignOut(); // Sign out and navigate home
                  }}
                  className='mt-5 w-full black_btn'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
