"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react'; 
import { 
  Briefcase, 
  Users, 
  FileText, 
  MessageSquare,
  PieChart,
  Clock
} from 'lucide-react';

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    unreadMessages: 0
  });
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login' // ✅ Redirect after logout
    });
  };
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // const statsResponse = await fetch('/api/client/stats');
        const jobsResponse = await fetch('/api/client/jobs');
        const applicationsResponse = await fetch('/api/client/applications/');
  
        if ( jobsResponse.ok ) {
          // const statsData = await statsResponse.json();
          const jobsData = await jobsResponse.json();
          const applicationsData = await applicationsResponse.json();
  
          // setStats(statsData);
          setRecentJobs(jobsData);
          console.log(jobsData);
          setRecentApplications(applicationsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black rounded hover:bg-red-600 transition"
        >
          {/* <LogOut size={18} /> */}
          Logout
        </button>
        </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Active Jobs" 
          value={recentJobs.length} 
          icon={<Briefcase className="text-blue-500" />} 
          link="/client/jobs" 
        />
        <StatsCard 
          title="Total Applications" 
          value={recentApplications.length} 
          icon={<Users className="text-green-500" />} 
          link='/client/applications'
        />
        <StatsCard 
          title="Pending Reviews" 
          value={stats.pendingReviews} 
          icon={<Clock className="text-amber-500" />} 
        />
        <StatsCard 
          title="Unread Messages" 
          value={stats.unreadMessages} 
          icon={<MessageSquare className="text-purple-500" />} 
          link="/client/messages" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Jobs</h2>
            <Link href="/client/jobs/new" className="text-sm px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700">
              Post New Job
            </Link>
          </div>
          <div className="divide-y">
  {recentJobs.length > 0 ? (
    recentJobs.map((job) => (
      <div key={job._id} className="py-4">
        <Link href={`/client/jobs/${job._id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
          <h3 className="font-medium">{job.title}</h3>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{job.applicants?.length ?? 0} applicants</span> {/* ✅ safer */}
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              job.status === 'Open' ? 'bg-green-100 text-green-800' :
              job.status === 'Closed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {job.status}
            </span>
          </div>
        </Link>
      </div>
    ))
  ) : (
    <p className="py-4 text-gray-500">No jobs posted yet.</p>
  )}
</div>
          <div className="mt-4">
            <Link href="/client/jobs" className="text-blue-600 text-sm hover:underline">
              View all jobs →
            </Link>
          </div>
        </div>
        
        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <div className="divide-y">
            {recentApplications.length > 0 ? (
              recentApplications.map(app => (
                <div key={app._id} className="py-4">
                  <Link href={`/client/applications`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium">Application from {app.applicant.name}</h3>
                    <p className="text-sm text-gray-500">for {app.job.title}</p>
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
              <p className="py-4 text-gray-500">No applications received yet.</p>
            )}
          </div>
          <div className="mt-4">
            <Link href="/client/applications" className="text-blue-600 text-sm hover:underline">
              View all applications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Stats Card Component
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