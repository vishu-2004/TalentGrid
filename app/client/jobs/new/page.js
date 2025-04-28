 "use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Briefcase, Building, DollarSign, MapPin, Tag, Award } from 'lucide-react';

export default function CreateJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    rate: '',
    skills: [],
    description: '',
    location: '',
    jobType: 'Full-time',
    experience: 'Entry',
    status: 'Open',
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.rate.trim()) newErrors.rate = 'Rate is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/client/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/client/jobs/${data._id}`);
      } else {
        const errorData = await res.json();
        setErrors(prev => ({
          ...prev,
          form: errorData.message || 'Failed to create job'
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        form: 'An error occurred while creating the job'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
      </div>
      
      {errors.form && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          {errors.form}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Job Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Briefcase size={16} className="inline mr-1" />
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g. Senior Frontend Developer"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building size={16} className="inline mr-1" />
                  Company Name*
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.company ? 'border-red-500' : ''}`}
                  placeholder="e.g. Acme Inc."
                />
                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={16} className="inline mr-1" />
                  Rate*
                </label>
                <input
                  type="text"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.rate ? 'border-red-500' : ''}`}
                  placeholder="e.g. $50-70/hr or $80,000-100,000/year"
                />
                {errors.rate && <p className="mt-1 text-sm text-red-600">{errors.rate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={16} className="inline mr-1" />
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="e.g. Remote, New York, NY, or Hybrid"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Tag size={16} className="inline mr-1" />
                  Job Type*
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Award size={16} className="inline mr-1" />
                  Experience Level*
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                >
                  <option value="Entry">Entry Level</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Senior">Senior</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>
            
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Required*
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className={`flex-grow p-2 border rounded-l focus:ring focus:ring-blue-200 ${errors.skills ? 'border-red-500' : ''}`}
                  placeholder="e.g. JavaScript, React, Node.js"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-black rounded-r hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
              
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <div key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Provide a detailed description of the job, responsibilities, qualifications, etc."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center disabled:bg-blue-400"
            >
              {isSubmitting ? 'Posting...' : (
                <>
                  <Save size={16} className="mr-1" />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}