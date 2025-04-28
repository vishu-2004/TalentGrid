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
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function ClientManageApplications() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchClientApplications();
    }
  }, [status]);

  const fetchClientApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/client/applications');
      const data = await res.json();
      if (res.ok) {
        setApplications(data);
      } else {
        setError(data.error || 'Failed to load applications');
      }
    } catch (err) {
      setError('Error fetching applications');
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/client/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const deleteApplication = async (id) => {
    try {
      const res = await fetch(`/api/client/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app._id !== id));
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
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
          onClick={() => router.push('/client/dashboard')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold flex-grow">Manage Applications</h1>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <Clock size={20} className="mr-2 text-gray-500" />
            <span className="text-gray-700">No applications received</span>
          </div>
        ) : (
          applications.map(app => (
            <div key={app._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{app.job.title}</h2>
                    <div className="flex items-center text-gray-700">
                      <Users size={16} className="mr-1 text-gray-500" />
                      <span>{app.applicant.name || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium \${
                      app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{app.status}</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-4">
                  <h3 className="text-lg font-medium mb-1 flex items-center">
                    <FileText size={16} className="mr-2 text-gray-500" />Cover Letter
                  </h3>
                  <p>{app.coverLetter}</p>
                </div>

                {app.attachments && app.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <Paperclip size={14} className="mr-1" />Attachments
                    </h4>
                    <ul className="list-disc list-inside text-blue-600">
                      {app.attachments.map((file, idx) => (
                        <li key={idx}>
                          {file.url ? <Link href={file.url} target="_blank" className="underline">{file.name || file.url}</Link> : <span className="text-gray-500">{file.name}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateStatus(app._id, 'accepted')}
                    className="px-3 py-1 bg-green-600 text-black rounded hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle size={16} className="mr-1" />Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, 'rejected')}
                    className="px-3 py-1 bg-red-600 text-black rounded hover:bg-red-700 flex items-center"
                  >
                    <XCircle size={16} className="mr-1" />Reject
                  </button>
                  <button
                    onClick={() => deleteApplication(app._id)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
