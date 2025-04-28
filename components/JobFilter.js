 "use client"

import React, { useState } from 'react';

const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const experienceLevels = ["Entry", "Intermediate", "Senior", "Expert"];
const commonSkills = ["React", "Node.js", "Python", "JavaScript", "TypeScript", "MongoDB", "SQL", "AWS", "Docker", "UI/UX", "Java", "PHP"];

export default function JobFilter({ filters, onFilterChange }) {
  const [localSkills, setLocalSkills] = useState(filters.skills || []);
  
  const handleSkillToggle = (skill) => {
    const updatedSkills = localSkills.includes(skill)
      ? localSkills.filter(s => s !== skill)
      : [...localSkills, skill];
    
    setLocalSkills(updatedSkills);
    onFilterChange({ skills: updatedSkills });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };
  
  const clearFilters = () => {
    setLocalSkills([]);
    onFilterChange({
      query: '',
      skills: [],
      location: '',
      jobType: '',
      experience: '',
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg border-2">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Search
        </label>
        <input
          type="text"
          name="query"
          className="w-full p-2 border-2 rounded-md"
          placeholder="Job title, keywords..."
          value={filters.query}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Location
        </label>
        <input
          type="text"
          name="location"
          className="w-full p-2 border-2 rounded-md"
          placeholder="City, country, remote..."
          value={filters.location}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Job Type
        </label>
        <select
          name="jobType"
          className="w-full p-2 border-2 rounded-md"
          value={filters.jobType}
          onChange={handleInputChange}
        >
          <option value="">Any Type</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Experience Level
        </label>
        <select
          name="experience"
          className="w-full p-2 border-2 rounded-md"
          value={filters.experience}
          onChange={handleInputChange}
        >
          <option value="">Any Level</option>
          {experienceLevels.map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Skills
        </label>
        <div className="flex flex-wrap gap-2">
          {commonSkills.map(skill => (
            <button
              key={skill}
              className={`text-xs px-3 py-1 rounded-full border ${
                localSkills.includes(skill)
                  ? 'bg-black text-black border-black'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={clearFilters}
        className="w-full mt-2 p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        Clear Filters
      </button>
    </div>
  );
}