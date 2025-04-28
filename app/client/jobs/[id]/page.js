 "use client"
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Save,
  Edit, 
  Users, 
  Calendar, 
  MapPin,
  Tag,
  Award,
  DollarSign,
  Building,
  Briefcase,
  Clock,
  X,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  PauseCircle
} from 'lucide-react';

export default function JobDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const isEditing = searchParams.get('edit') === 'true';
  
  const [job, setJob] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(isEditing);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/client/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          setFormData({
            title: data.title,
            company: data.company,
            rate: data.rate,
            skills: data.skills,
            description: data.description,
            location: data.location,
            jobType: data.jobType,
            experience: data.experience,
            status: data.status,
          });
        } else {
          setError('Failed to load job details');
        }
      } catch (err) {
        setError('An error occurred while fetching job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);
  
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
      const res = await fetch(`/api/client/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        setJob(data);
        setEditMode(false);
        // Update the URL without the edit param
        router.replace(`/client/jobs/${id}`);
      } else {
        const errorData = await res.json();
        setErrors(prev => ({
          ...prev,
          form: errorData.message || 'Failed to update job'
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        form: 'An error occurred while updating the job'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
        <button 
          onClick={() => router.push('/client/jobs')}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Jobs
        </button>
      </div>
    );
  }
  
  const statusIcon = job?.status === 'Open' ? (
    <CheckCircle size={16} className="text-green-600" />
  ) : job?.status === 'Closed' ? (
    <AlertTriangle size={16} className="text-red-600" />
  ) : (
    <PauseCircle size={16} className="text-amber-600" />
  );
  
  const statusTextColor = job?.status === 'Open' 
    ? 'text-green-600' 
    : job?.status === 'Closed' 
      ? 'text-red-600' 
      : 'text-amber-600';
  
  if (editMode) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/client/jobs')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">Edit Job</h1>
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
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  router.push(`/client/jobs/${id}`);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center disabled:bg-blue-400"
              >
                {isSubmitting ? 'Saving...' : (
                  <>
                    <Save size={16} className="mr-1" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/client/jobs')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold flex-grow">{job.title}</h1>
        <button 
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center"
        >
          <Edit size={16} className="mr-1" />
          Edit Job
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          {/* Job Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{job.company}</h2>
              <div className="flex items-center mb-2">
                <MapPin size={16} className="mr-1 text-gray-500" />
                <span className="text-gray-700">{job.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center text-gray-700">
                  <Tag size={16} className="mr-1 text-gray-500" />
                  {job.jobType}
                </div>
                <div className="flex items-center text-gray-700">
                  <Award size={16} className="mr-1 text-gray-500" />
                  {job.experience} Level
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign size={16} className="mr-1 text-gray-500" />
                  {job.rate}
                </div>
              </div>
            </div>
            
            <div className="md:text-right">
              <div className="flex items-center md:justify-end mb-2">
                {statusIcon}
                <span className={`ml-1 font-medium ${statusTextColor}`}>{job.status}</span>
              </div>
              <div className="flex items-center md:justify-end text-gray-700 mb-2">
                <Calendar size={16} className="mr-1 text-gray-500" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center md:justify-end text-blue-600">
                <Users size={16} className="mr-1" />
                <Link href={`/client/jobs/${job._id}/applications`}>
                  {job.applicants?.length || 0} Applications
                </Link>
              </div>
            </div>
          </div>
          
          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Job Description</h3>
            <div className="prose max-w-none">
              {job.description.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <Link 
            href={`/client/jobs`}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Jobs
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push(`/client/jobs/${id}/applications`)}
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center"
            >
              <Users size={16} className="mr-1" />
              View Applications
            </button>
            
            <button
              onClick={() => {
                // Update job status API call would go here
                const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
                fetch(`/api/client/jobs/${id}/status`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ status: newStatus }),
                })
                .then(res => {
                  if (res.ok) {
                    return res.json();
                  }
                  throw new Error('Failed to update status');
                })
                .then(data => {
                  setJob({...job, status: newStatus});
                })
                .catch(err => {
                  console.error('Error updating job status:', err);
                });
              }}
              className={`px-4 py-2 rounded flex items-center ${
                job.status === 'Open' 
                  ? 'bg-red-600 hover:bg-red-700 text-black' 
                  : 'bg-green-600 hover:bg-green-700 text-black'
              }`}
            >
              {job.status === 'Open' ? (
                <>
                  <PauseCircle size={16} className="mr-1" />
                  Close Job
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-1" />
                  Reopen Job
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}