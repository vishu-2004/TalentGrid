"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JobCard({ job, showApplyButton = true }) {
  const router = useRouter();

  return (
    <div className="border-2 p-5 rounded-md hover:shadow-md transition-shadow">
      <div className="pb-4">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-500">{job.company}</p>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{job.status}</span>
        </div>
      </div>
      
      <p className="font-semibold mb-3">{job.rate}</p>
      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span className="text-gray-600">{job.location}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-5">
        {job.skills.map((skill, i) => (
          <div key={i} className="appearance-none bg-gray-200 border-2 border-gray-200 rounded-full box-border text-gray-700 cursor-pointer inline-block font-sans font-medium text-xs px-3 py-1">
            {skill}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Just now'}
        </span>
        
        {showApplyButton && (
          <button
            className="bg-black text-white border-2 border-black rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
            onClick={() => router.push(`/jobs/${job._id}`)}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}