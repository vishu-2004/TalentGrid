"use client"
import React, { useState } from 'react'; 

export default function ApplicationForm({ jobId, onSuccess }) { 
  const [formData, setFormData] = useState({ 
    coverLetter: '', 
    attachments: [], 
  }); 
  
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  
  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    })); 
  }; 
  
  const handleFileChange = (e) => { 
    // In a real implementation, you would handle file uploads
    // For now, just store the file names
    const files = Array.from(e.target.files); 
    setFormData(prev => ({ 
      ...prev, 
      attachments: files.map(file => file.name), 
    })); 
  }; 
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!formData.coverLetter.trim()) { 
      setError('Cover letter is required'); 
      return; 
    } 
    
    try { 
      setLoading(true); 
      setError(null); 
      
      const response = await fetch('/api/applications', { 
        method: 'POST', 
        // headers: { 
        //   'Content-Type': 'application/json', 
        // }, 
        body: JSON.stringify({ 
          jobId, 
          coverLetter: formData.coverLetter, 
          attachments: formData.attachments, 
        }), 
      }); 
      
      if (!response.ok) { 
        const errorData = await response.json(); 
        throw new Error(errorData.error || 'Failed to submit application'); 
      } 
      
      // Success!
      onSuccess(); 
    } catch (err) { 
      console.error('Error submitting application:', err); 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    } 
  }; 
  
  return ( 
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"> 
      {error && ( 
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4"> 
          {error} 
        </div> 
      )} 
      
      <div className="mb-4"> 
        <label className="block text-gray-700 font-medium mb-2"> 
          Cover Letter 
        </label> 
        <textarea 
          name="coverLetter" 
          rows={8} 
          className="w-full p-3 border-2 rounded-md focus:border-blue-500 focus:outline-none" 
          placeholder="Introduce yourself and explain why you're a good fit for this position..." 
          value={formData.coverLetter} 
          onChange={handleChange} 
          required 
        /> 
      </div> 
      
      <div className="mb-6"> 
        <label className="block text-gray-700 font-medium mb-2"> 
          Attachments (Resume, Portfolio, etc.) 
        </label>
        <input
          type="file"
          name="attachments"
          multiple
          className="w-full p-2 border-2 border-gray-300 rounded-md"
          onChange={handleFileChange}
        />
        {formData.attachments.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 font-medium">Selected files:</p>
            <ul className="pl-5 list-disc text-sm text-gray-600">
              {formData.attachments.map((filename, index) => (
                <li key={index}>{filename}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-black font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>
    </form> 
  ); 
}