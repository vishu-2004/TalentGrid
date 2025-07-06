// "use client";

// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
// import FDcard from "@/components/FDcard";
// import { useState, useEffect } from "react";
// import { signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation"; // Import useRouter

// export default function Page() {
//   const [showDiv, setShowDiv] = useState(false);
//   const { data: session, status } = useSession();
//   const router = useRouter(); // Initialize useRouter

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.replace("/home");
//     } else if (session?.user?.role === "client") {
//       router.replace("/client/dashboard");
//     } else if (session?.user?.role === "freelancer") {
//       router.replace("/jobs");
//     }
//   }, [session, status]);
  

//   const handleClick = () => {
//     setShowDiv(!showDiv); // Toggle the state
//   };

//   const handleSignOut = async () => {
//     console.log("Signing out...");
//     await signOut({ redirect: false }); // Prevent NextAuth auto-redirect
  
//     // Clear session from local storage (in case of cache issues)
//     localStorage.clear();
//     sessionStorage.clear();
  
//     router.replace("/login"); // Manually redirect
//   };

//   if (status === "loading") return <p>Loading...</p>;
  
//   return (
//     <div>
//       <div className="min-h-screen bg-background">
//         <header className="border-b">
//           <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//             <h1 className="text-2xl font-bold">Job Seeker Dashboard</h1>
//             <div className="flex items-center space-x-4">
//               <div
//                 className="text-black cursor-pointer"
//                 onClick={() => router.push("/Fprofile")} // Navigate to Fprofile page
//               >
//                 <FontAwesomeIcon
//                   icon={faUser}
//                   style={{ fontSize: "20px", width: "20px" }}
//                   className="mr-6"
//                 />
//               </div>
//               <button
//                 onClick={handleSignOut}
//                 className="bg-red-500 text-black px-4 py-2 rounded-md hover:bg-red-600 transition"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="container mx-auto px-4 py-8">
//         <p>Welcome, {session?.user?.email}</p>
//           <div className="mb-8">
//             <div className="p-3 rounded-md border border-gray-300 flex justify-start gap-2 items-center shadow-md w-[70vw]">
//               <FontAwesomeIcon
//                 icon={faSearch}
//                 style={{ fontSize: "20px", width: "20px" }}
//                 className="mr-6"
//               />
//               <input
//                 type="text"
//                 className="w-[70vw] border-gray-50 z-10 focus:outline-none"
//                 placeholder="Search for jobs..."
//               />
//             </div>
//           </div>

//           <section>
//             <h2 className="text-4xl font-semibold mb-4">Job Recommendations</h2>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
//               <FDcard />
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  Briefcase,
  FileText,
  Clock,
  MessageSquare,
} from 'lucide-react';

export default function FreelancerDashboard() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login'
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const jobsResponse = await fetch('/api/jobs'); // 🚨 You need to have this API to list all available jobs
        const applicationsResponse = await fetch('/api/applications'); // uses your server-side session
        
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setRecentJobs(jobsData);
        }

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setMyApplications(applicationsData);
        }
      } catch (error) {
        console.error('Error fetching freelancer dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Freelancer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Available Jobs"
          value={recentJobs.length}
          icon={<Briefcase className="text-blue-500" />}
          link="/jobs"
        />
        <StatsCard
          title="My Applications"
          value={myApplications.length}
          icon={<FileText className="text-green-500" />}
          link="/applications"
        />
        <StatsCard
          title="Pending Applications"
          value={myApplications.filter(app => app.status === 'Pending').length}
          icon={<Clock className="text-amber-500" />}
        />
        <StatsCard
          title="Messages"
          value={0} // If you have messages, update later
          icon={<MessageSquare className="text-purple-500" />}
          link="/messages"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Jobs</h2>
            <Link href="/jobs" className="text-sm px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700">
              View All Jobs
            </Link>
          </div>
          <div className="divide-y">
            {recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <div key={job._id} className="py-4">
                  <Link href={`/jobs/${job._id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.description?.substring(0, 100)}...</p>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      <span>{job.status}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-4 text-gray-500">No jobs available currently.</p>
            )}
          </div>
        </div>

        {/* My Applications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Recent Applications</h2>
          <div className="divide-y">
            {myApplications.length > 0 ? (
              myApplications.map(app => (
                <div key={app._id} className="py-4">
                  <Link href={`/applications/${app._id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium">{app.job.title}</h3>
                    <p className="text-sm text-gray-500">{app.coverLetter.substring(0, 100)}...</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' : 
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-4 text-gray-500">You have not applied for any jobs yet.</p>
            )}
          </div>
          <div className="mt-4">
            <Link href="/applications" className="text-blue-600 text-sm hover:underline">
              View all applications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, link }) {
  const content = (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
  
  if (link) {
    return <Link href={link}>{content}</Link>;
  }
  
  return content;
}

