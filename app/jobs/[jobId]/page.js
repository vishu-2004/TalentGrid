 "use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ApplicationForm from '@/components/ApplicationForm';

export default function JobDetailPage({ params }) {
  console.log(params)
  const jobId = params.jobId;
  const router = useRouter();
  const { data: session } = useSession();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const data = await response.json();
      setJob(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push(`/login?callbackUrl=/jobs/${jobId}`);
      return;
    }
    console.log(session.user.role )
    if (session.user.role !== 'freelancer') {
      alert('Only freelancers can apply for jobs');
      return;
    }
    
    setShowApplicationForm(true);
  };

  const handleSaveJob = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/jobs/${jobId}`);
      return;
    }
    
    try {
      const response = await fetch('/api/user/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save job');
      }
      
      alert('Job saved successfully!');
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  if (!job) {
    return <div className="text-center py-20">Job not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Job Header */}
        <div className="bg-white p-6 rounded-lg border-2 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-gray-500 mt-1">{job.company}</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md">
              {job.status}
            </span>
          </div>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{job.jobType}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>{job.experience}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold text-lg">{job.rate}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {job.skills.map((skill, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Job Description */}
        <div className="bg-white p-6 rounded-lg border-2 mb-6">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <div className="prose max-w-none">
            <p>{job.description}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {!showApplicationForm && (
            <button
              onClick={handleApply}
              className="bg-black text-black border-2 border-black rounded-lg px-6 py-3 flex-1 hover:bg-gray-800 transition-colors"
            >
              Apply Now
            </button>
          )}
          
          <button
            onClick={handleSaveJob}
            className="bg-white text-black border-2 border-black rounded-lg px-6 py-3 flex-1 hover:bg-gray-100 transition-colors"
          >
            Save Job
          </button>
        </div>
        
        {/* Application Form */}
        {showApplicationForm && (
          <div className="bg-white p-6 rounded-lg border-2 mb-6">
            <h2 className="text-xl font-bold mb-4">Submit Your Application</h2>
            <ApplicationForm jobId={job._id} onSuccess={() => router.push('/applications')} />
          </div>
        )}
      </div>
    </div>
  );
}