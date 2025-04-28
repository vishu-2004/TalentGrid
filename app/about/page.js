import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">About TalentGrid</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At TalentGrid, we are on a mission to revolutionize how job seekers and businesses connect. 
            We believe in creating opportunities for talented individuals worldwide while helping 
            businesses find the perfect match for their projects.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-gray-700 mb-6">
            Founded in 2025, TalentGrid has quickly grown into a trusted platform for job seekers 
            and businesses alike. Our team is passionate about building a community where skills are 
            valued and quality work is rewarded fairly.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">For Job seekers</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Access to global opportunities</li>
                <li>Profile showcasing</li>
                <li>Skill development resources</li>
                <li>Community support</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">For Recruiters</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Access to global talent pool</li>
                
                <li>Project management tools</li>
                <li>Milestone-based payments</li>
                <li>Quality assurance</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-8 border border-yellow-200">
          <h2 className="text-2xl font-semibold mb-4 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-gray-700">Constantly improving our platform to meet evolving needs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-gray-700">Building meaningful connections between professionals</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Trust</h3>
              <p className="text-gray-700">Creating a secure and transparent environment for all users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;