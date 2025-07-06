 "use client"
import { useState, useEffect } from 'react';
import { User, Building, Globe, MapPin, Mail, Save } from 'lucide-react';
import Image from 'next/image';

export default function ClientProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: '',
    bio: '',
    location: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/client/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        setError('An error occurred while fetching your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/client/profile', {
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: JSON.stringify(profile),
      });
      
      if (res.ok) {
        setIsEditing(false);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating your profile');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-4">
                  {profile.profilePicture ? (
                    <Image
                      src={profile.profilePicture} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      name="profilePicture"
                      value={profile.profilePicture}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                    />
                  </div>
                )}
              </div>
              
              {/* Personal Info */}
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                      />
                    ) : (
                      <p className="font-medium">{profile.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                      />
                    ) : (
                      <p className="font-medium">{profile.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Building size={16} className="inline mr-1" />
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyName"
                        value={profile.companyName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                      />
                    ) : (
                      <p className="font-medium">{profile.companyName || '(Not specified)'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Globe size={16} className="inline mr-1" />
                      Company Website
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyWebsite"
                        value={profile.companyWebsite}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                      />
                    ) : (
                      <p className="font-medium">
                        {profile.companyWebsite ? (
                          <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profile.companyWebsite}
                          </a>
                        ) : (
                          '(Not specified)'
                        )}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="industry"
                        value={profile.industry}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                      />
                    ) : (
                      <p className="font-medium">{profile.industry || '(Not specified)'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin size={16} className="inline mr-1" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                      />
                    ) : (
                      <p className="font-medium">{profile.location || '(Not specified)'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Biography */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biography / About
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.bio || '(No biography provided)'}
                </p>
              )}
            </div>
          </div>
          
          {/* Form Actions */}
          {isEditing && (
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center"
              >
                <Save size={16} className="mr-1" />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}