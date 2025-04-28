//  "use client"
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { 
//   Plus, 
//   Search, 
//   Filter, 
//   Eye, 
//   Edit, 
//   Users, 
//   Calendar, 
//   MapPin,
//   Tag,
//   AlertCircle,
//   CheckCircle,
//   PauseCircle
// } from 'lucide-react';

// export default function ClientJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
  
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await fetch('/api/client/jobs');
//         if (res.ok) {
//           const data = await res.json();
//           setJobs(data);
//           setFilteredJobs(data);
//         } else {
//           setError('Failed to load jobs');
//         }
//       } catch (err) {
//         setError('An error occurred while fetching your jobs');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);
  
//   useEffect(() => {
//     // Apply filters and search
//     let result = jobs;
    
//     // Apply status filter
//     if (statusFilter !== 'All') {
//       result = result.filter(job => job.status === statusFilter);
//     }
    
//     // Apply search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(job => 
//         job.title.toLowerCase().includes(term) || 
//         job.company.toLowerCase().includes(term) ||
//         job.skills.some(skill => skill.toLowerCase().includes(term))
//       );
//     }
    
//     setFilteredJobs(result);
//   }, [jobs, statusFilter, searchTerm]);
  
//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading...</div>;
//   }

//   const statusIcons = {
//     'Open': <CheckCircle size={16} className="text-green-600" />,
//     'Closed': <AlertCircle size={16} className="text-red-600" />,
//     'On Hold': <PauseCircle size={16} className="text-amber-600" />
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Manage Jobs</h1>
//         <Link href="/client/jobs/new" className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center">
//           <Plus size={20} className="mr-1" />
//           Post New Job
//         </Link>
//       </div>
      
//       {error && (
//         <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
//           {error}
//         </div>
//       )}
      
//       {/* Filter and Search */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="md:w-3/4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search jobs by title, company or skill..."
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full p-3 pl-10 border rounded focus:ring focus:ring-blue-200"
//               />
//               <Search size={20} className="absolute top-3 left-3 text-gray-400" />
//             </div>
//           </div>
          
//           <div className="md:w-1/4">
//             <div className="relative">
//               <select
//                 value={statusFilter}
//                 onChange={e => setStatusFilter(e.target.value)}
//                 className="w-full p-3 pl-10 border rounded appearance-none focus:ring focus:ring-blue-200"
//               >
//                 <option value="All">All Statuses</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Closed</option>
//                 <option value="On Hold">On Hold</option>
//               </select>
//               <Filter size={20} className="absolute top-3 left-3 text-gray-400" />
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Jobs List */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {filteredJobs.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Job
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Details
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Applications
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredJobs.map(job => (
//                   <tr key={job._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{job.title}</div>
//                           <div className="text-sm text-gray-500">{job.company}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         <div className="flex items-center mb-1">
//                           <MapPin size={14} className="mr-1 text-gray-500" />
//                           {job.location}
//                         </div>
//                         <div className="flex items-center mb-1">
//                           <Tag size={14} className="mr-1 text-gray-500" />
//                           {job.jobType}
//                         </div>
//                         <div className="flex items-center">
//                           <Calendar size={14} className="mr-1 text-gray-500" />
//                           {new Date(job.createdAt).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <Users size={16} className="mr-1 text-blue-500" />
//                         <span className="text-sm font-medium">
//                           {job.applicants?.length || 0} Applicants
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {statusIcons[job.status]}
//                         <span className={`ml-1 text-sm font-medium ${
//                           job.status === 'Open' ? 'text-green-600' : 
//                           job.status === 'Closed' ? 'text-red-600' : 
//                           'text-amber-600'
//                         }`}>
//                           {job.status}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <Link href={`/client/jobs/${job._id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
//                           <Eye size={16} className="mr-1" />
//                           View
//                         </Link>
//                         <Link href={`/client/jobs/${job._id}/applications`} className="text-blue-600 hover:text-blue-900 flex items-center">
//                           <Users size={16} className="mr-1" />
//                           Applications
//                         </Link>
//                         <Link href={`/client/jobs/${job._id}?edit=true`} className="text-gray-600 hover:text-gray-900 flex items-center">
//                           <Edit size={16} className="mr-1" />
//                           Edit
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center p-12">
//             <div className="text-gray-400 mb-4">
//               <AlertCircle size={64} />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
//             <p className="text-gray-500 text-center mb-6">
//               {jobs.length === 0 
//                 ? "You haven't posted any jobs yet." 
//                 : "No jobs match your current filters."}
//             </p>
//             {jobs.length === 0 && (
//               <Link href="/client/jobs/new" className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700">
//                 Post Your First Job
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Users, 
  Calendar, 
  MapPin, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  PauseCircle 
} from "lucide-react";

export default function ClientJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/client/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
          setFilteredJobs(data);
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (err) {
        setError("An error occurred while fetching jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (statusFilter !== "All") {
      result = result.filter(job => job.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, statusFilter]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const statusIcons = {
    "Open": <CheckCircle size={16} className="text-green-600" />,
    "Closed": <AlertCircle size={16} className="text-red-600" />,
    "On Hold": <PauseCircle size={16} className="text-amber-600" />
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>
        <Link href="/client/jobs/new" className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center">
          <Plus size={20} className="mr-2 font-bold" />
          Post New Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, company, or skills"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border rounded focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="relative w-full md:w-1/3">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full p-3 pl-10 border rounded focus:ring focus:ring-blue-200"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded shadow overflow-hidden">
        {filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center mb-1">
                        <Tag size={14} className="mr-1 text-gray-500" />
                        {job.jobType}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Users size={16} className="mr-1 text-blue-500" />
                        {job.applicants?.length || 0} Applicants
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {statusIcons[job.status]}
                        <span className={`ml-2 text-sm font-medium ${
                          job.status === "Open" ? "text-green-600" :
                          job.status === "Closed" ? "text-red-600" :
                          "text-amber-600"
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/client/jobs/${job._id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                          <Eye size={16} className="mr-1" /> View
                        </Link>
                        <Link href={`/client/jobs/${job._id}/applications`} className="text-blue-600 hover:text-blue-900 flex items-center">
                          <Users size={16} className="mr-1" /> Applications
                        </Link>
                        <Link href={`/client/jobs/${job._id}?edit=true`} className="text-gray-600 hover:text-gray-900 flex items-center">
                          <Edit size={16} className="mr-1" /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <AlertCircle size={64} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">
              {jobs.length === 0 
                ? "You haven't posted any jobs yet." 
                : "No jobs match your filters."}
            </p>
            {jobs.length === 0 && (
              <Link href="/client/jobs/new" className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700">
                Post Your First Job
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
