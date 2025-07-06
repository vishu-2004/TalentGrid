"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import fa from 'fontawesome';

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log("Session Data:", session);

    if (session?.status === 'authenticated') {
      if (session.data?.user?.role === "client") {
        router.replace('/client/dashboard');
      } else {
        router.replace('/seeker/dashboard');
      }
    }
  }, [session, router]);

  const isValidEmail = (email) => {
    const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\\.){1,}([a-z]{2,16})/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      setError('This email is invalid');
      return;
    }

    if (password.length < 8) {
      setError('The password must be at least 8 characters long');
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    setError("");

    setTimeout(async () => {
      const sessionData = await fetch("/api/auth/session").then(res => res.json());
      console.log("Fetched Session:", sessionData);

      if (sessionData?.user?.role === "client") {
        router.replace('/client/dashboard');
      } else {
        router.replace('/jobs');
      }
    }, 1000);
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-[#F5EDFA] p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Log In</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label htmlFor='email' className='block text-sm font-semibold mb-2'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-semibold mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-[#6300B3] text-black p-3 rounded-lg font-semibold'
          >
            Log In
          </button>
        </form>
        <p className='text-center mt-6'>
          Don&apos;t have an account?{' '}
          <Link href='/signin' className='text-[#6300B3] font-thin hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
