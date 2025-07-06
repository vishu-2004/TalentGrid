"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Briefcase,
  FileText,
  Paperclip,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function ApplicationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchApplications = async () => {
        try {
          const res = await fetch('/api/applications');
          const data = await res.json();
          if (res.ok) {
            setApplications(data);
          } else {
            setError(data.error);
          }
        } catch (err) {
          setError('Failed to fetch applications');
        }
      };
      fetchApplications();
    }
  }, [status]);

  const handleApplyForJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, coverLetter, attachments }),
      });

      const data = await response.json();
      if (response.ok) {
        setApplications(prev => [...prev, data]);
        setJobId('');
        setCoverLetter('');
        setAttachments([]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to submit the application');
    }
    setLoading(false);
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <span>You must be logged in to view this page.</span>
        </div>
        <button
          onClick={() => router.push('/auth/signin')}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold flex-grow">Your Applications</h1>
      </div>

      {/* Application List */}
      <div className="space-y-4 mb-8">
        {applications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <Clock size={20} className="mr-2 text-gray-500" />
            <span className="text-gray-700">No applications found</span>
          </div>
        ) : (
          applications.map(app => (
            <div key={app._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{app.job.title}</h2>
                    <div className="flex items-center text-gray-700 mb-1">
                      <Briefcase size={16} className="mr-1 text-gray-500" />
                      <span>{app.job.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Users size={16} className="mr-1 text-gray-500" />
                      <span>{app.status}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-1" />
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 prose max-w-none">
                  <h3 className="text-lg font-medium mb-1 flex items-center">
                    <FileText size={16} />
                    Cover Letter
                  </h3>
                  <p>{app.coverLetter}</p>
                </div>

                {app.attachments && app.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <Paperclip size={14} className="mr-1" />
                      Attachments
                    </h4>
                    <ul className="list-disc list-inside text-blue-600">
                      {app.attachments.map((file, idx) => (
                        <li key={idx}>
                          {file.url ? (
                            <Link href={file.url} target="_blank" className="underline">
                              {file.name || file.url}
                            </Link>
                          ) : (
                            <span className="text-gray-500">{file.name || 'Attachment'}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply for New Job */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleApplyForJob} className="p-6 space-y-6">
          <div className="flex items-center mb-4">
            <Users size={20} className="mr-2 text-gray-500" />
            <h2 className="text-2xl font-semibold">Apply for a New Job</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase size={16} className="inline mr-1" />
                Job ID*
              </label>
              <input
                type="text"
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                required
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText size={16} className="inline mr-1" />
                Cover Letter*
              </label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={4}
                required
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Paperclip size={16} className="inline mr-1" />
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={e => setAttachments(Array.from(e.target.files))}
                className="w-full"
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 flex items-center disabled:bg-blue-400"
            >
              {loading ? 'Submitting...' : (
                <>Submit Application</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
