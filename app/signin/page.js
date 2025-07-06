"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [selectedRole, setSelectedRole] = useState('');
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If role passed in query, pre-select it
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'client' || roleFromQuery === 'freelancer') {
      setSelectedRole(roleFromQuery);
    }
  }, [searchParams]);

  const isValidEmail = (email) => {
    const emailRegex = /[a-z0-9._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9-]+\\.){1,}([a-z]{2,16})/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole || !Name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // if (!isValidEmail(email)) {
    //   setError('This email is invalid');
    //   return;
    // }
    if (password.length < 8) {
      setError('The password must be at least 8 characters long');
      return;
    }
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name, email, password, roleName: selectedRole }),
      });
      if (res.status === 400) {
        setError('This email is already registered');
      } else if (res.status === 200) {
        router.push('/login');
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }
  };
  const roles = [
    { label: 'Recruiter', value: 'client' },
    { label: 'Job Seeker', value: 'freelancer' }
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="font-semibold mb-2">Select Role:</p>
            <ul className="list-disc list-inside flex space-x-4">
            {roles.map((role) => (
              <li key={role.value} className="flex items-center">
                <input
                  type="radio"
                  id={role.value}
                  name="role"
                  value={role.value} // ✅ backend value
                  checked={selectedRole === role.value}
                  onChange={() => setSelectedRole(role.value)} // ✅ store value
                  className="mr-2"
                />
                <label htmlFor={role.value} className="capitalize">
                  {role.label} {/* ✅ what user sees */}
                </label>
              </li>
            ))}
            </ul>
          </div>

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6300B3] text-black p-3 rounded-lg font-semibold"
          >
            Sign In
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6300B3] font-thin hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
