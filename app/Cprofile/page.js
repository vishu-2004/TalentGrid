"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ClientProfile() {
  const { data: session } = useSession(); // Fetching user data from NextAuth

  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState(
    "Looking for a skilled React and Node.js developer to join our team."
  );
  const [isJobAvailable, setIsJobAvailable] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <nav className="space-y-2">
          <Link
            href="/Cdashboard"
            className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg"
          >
            <span>Dashboard</span>
          </Link>
          <Link
            href="/Cprofile"
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
          >
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-4">
              Client Profile
            </h1>

            {/* ✅ Added User Information */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">
                {session?.user?.name || "User Name"}
              </h2>
              <p className="text-gray-500">
                {session?.user?.email || "user@example.com"}
              </p>
            </div>

            {/* Job Title */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Job Title</h2>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              ) : (
                <p className="text-gray-700">{jobTitle}</p>
              )}
            </div>

            {/* Job Description */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Job Description</h2>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{jobDescription}</p>
              )}
            </div>

            {/* Job Availability */}
            <div className="mb-4 flex items-center">
              <h2 className="text-xl font-semibold mr-2">Job Availability:</h2>
              {isEditing ? (
                <select
                  className="p-2 border rounded-md"
                  value={isJobAvailable ? "Available" : "Not Available"}
                  onChange={(e) =>
                    setIsJobAvailable(e.target.value === "Available")
                  }
                >
                  <option>Available</option>
                  <option>Not Available</option>
                </select>
              ) : (
                <span
                  className={`px-3 py-1 rounded-lg text-white ${
                    isJobAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {isJobAvailable ? "Available" : "Not Available"}
                </span>
              )}
            </div>

            {/* Edit & Save Buttons */}
            <div className="text-center">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-black px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
