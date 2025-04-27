"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import FDcard from "@/components/FDcard";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Page() {
  const [showDiv, setShowDiv] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (session?.user?.role === "Client") {
      router.replace("/Cdashboard");
    } else if (session?.user?.role === "Freelancer") {
      router.replace("/dashboard");
    }
  }, [session, status]);
  

  const handleClick = () => {
    setShowDiv(!showDiv); // Toggle the state
  };

  const handleSignOut = async () => {
    console.log("Signing out...");
    await signOut({ redirect: false }); // Prevent NextAuth auto-redirect
  
    // Clear session from local storage (in case of cache issues)
    localStorage.clear();
    sessionStorage.clear();
  
    router.replace("/login"); // Manually redirect
  };

  if (status === "loading") return <p>Loading...</p>;
  
  return (
    <div>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div
                className="text-black cursor-pointer"
                onClick={() => router.push("/Fprofile")} // Navigate to Fprofile page
              >
                <FontAwesomeIcon
                  icon={faUser}
                  style={{ fontSize: "20px", width: "20px" }}
                  className="mr-6"
                />
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
        <p>Welcome, {session?.user?.email}</p>
          <div className="mb-8">
            <div className="p-3 rounded-md border border-gray-300 flex justify-start gap-2 items-center shadow-md w-[70vw]">
              <FontAwesomeIcon
                icon={faSearch}
                style={{ fontSize: "20px", width: "20px" }}
                className="mr-6"
              />
              <input
                type="text"
                className="w-[70vw] border-gray-50 z-10 focus:outline-none"
                placeholder="Search for jobs..."
              />
            </div>
          </div>

          <section>
            <h2 className="text-4xl font-semibold mb-4">Job Recommendations</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <FDcard />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
