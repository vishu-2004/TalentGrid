 "use client"
import React, { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import JobFilter from '@/components/JobFilter';
import { signOut } from 'next-auth/react'; 
export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    query: '',
    skills: [],
    location: '',
    jobType: '',
    experience: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.skills.length) params.append('skills', filters.skills.join(','));
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.experience) params.append('experience', filters.experience);
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
    const handleLogout = async () => {
      await signOut({
        callbackUrl: '/login' // ✅ Redirect after logout
      });
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <JobFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="w-full md:w-3/4">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>
      <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black rounded hover:bg-red-600 transition"
        >
          {/* <LogOut size={18} /> */}
          Logout
        </button>
        </div>
          
          {loading ? (
            <div className="text-center py-10">Loading jobs...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10">
              No jobs found matching your criteria.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}