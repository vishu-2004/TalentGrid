"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FImage from "../../components/FImage";

export default function Page() {
  const { data: session } = useSession(); // Fetching user data from NextAuth
  const router = useRouter();

  const [aboutText, setAboutText] = useState(
    "I'm a passionate full stack developer with over 2 years of experience in creating robust web applications. I specialize in React, Node.js, and I'm always eager to take on new challenges and learn new technologies."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://tse4.mm.bing.net/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&pid=Api&P=0&h=180"
  );

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Back to Dashboard Button */}
        <div className="fixed top-32 right-20 z-40 bg-black shadow-md p-2 rounded-md">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          {/* Profile Header */}
          <div className="md:col-span-3">
            <div className="justify-around flex flex-col md:flex-row items-center gap-6 bg-gray-200 p-6 rounded-lg">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full bg-cover border-gray-200"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
              <div className="text-center md:text-left">
                {/* ✅ Updated: Display dynamic username and email */}
                <h1 className="text-3xl font-bold">
                  {session?.user?.name || "User Name"}
                </h1>
                <p className="text-xl text-gray-500">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                ) : (
                  <button onClick={handleSave} className="text-green-500">
                    Save
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{aboutText}</p>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
              <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="relative aspect-video">
                    <FImage />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
              <h2 className="text-2xl font-semibold mb-4">Client Reviews</h2>
              <div className="space-y-4">
                {[
                  {
                    name: "John Smith",
                    review:
                      "Excellent work! Delivered on time and exceeded expectations.",
                  },
                  {
                    name: "Sarah Johnson",
                    review:
                      "Great communication and problem-solving skills. Highly recommended!",
                  },
                ].map((review, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className="fa-solid fa-star"></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
              <h2 className="text-2xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "JavaScript",
                  "React",
                  "Node.js",
                  "Python",
                  "Django",
                  "PostgreSQL",
                  "MongoDB",
                  "Docker",
                  "AWS",
                  "Git",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="appearance-none bg-gray-200 border-2 border-gray-200 rounded-[15px] box-border text-black cursor-pointer inline-block font-sans font-semibold w-[90px] h-[30px] text-[12px] pt-1 py-2 text-center"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
              <h2 className="text-2xl font-semibold mb-4">Education</h2>
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold">BE in Computer Science</h3>
                  <p className="text-sm text-muted-foreground">
                    University of Technology, 2015-2019
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">
                    Full Stack Web Development
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tech Bootcamp, 2020
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}
