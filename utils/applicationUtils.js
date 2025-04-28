import mongoose from "mongoose";
import Application from "../models/Application";
import Job from "../models/Job";
import User from "../models/User";

/**
 * Submit a job application
 */
export async function applyForJob(applicationData, jobId, applicantId) {
  try {
    // Get job details to find the client
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.status !== "Open") {
      throw new Error("This job is no longer accepting applications");
    }
    
    // Create the application
    const newApplication = await Application.create([{
      ...applicationData,
      job: jobId,
      applicant: applicantId,
      client: job.client,
    }]);
    
    // Update job's applicants array
    await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: applicantId } }
    );
    
    // Update user's appliedJobs array
    await User.findByIdAndUpdate(
      applicantId,
      { $addToSet: { appliedJobs: jobId } }
    );
    
    return newApplication[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Get applications for a job
 */
export async function getJobApplications(jobId, clientId) {
  // Verify the client owns this job
  const job = await Job.findOne({ _id: jobId, client: clientId });
  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }
  
  return await Application.find({ job: jobId })
    .populate('applicant', 'name email profilePicture skills hourlyRate')
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Update application status
 */
export async function updateApplicationStatus(applicationId, clientId, status, notes) {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new Error("Application not found");
  }
  
  // Verify the client owns this job
  if (application.client.toString() !== clientId) {
    throw new Error("You don't have permission to update this application");
  }
  
  return await Application.findByIdAndUpdate(
    applicationId,
    { 
      status,
      clientNotes: notes || application.clientNotes 
    },
    { new: true }
  );
}

/**
 * Get user's job applications
 */
export async function getUserApplications(userId) {
  return await Application.find({ applicant: userId })
    .populate({
      path: 'job',
      select: 'title company rate status',
      populate: {
        path: 'client',
        select: 'name companyName'
      }
    })
    .sort({ createdAt: -1 })
    .lean();
}

// Function to get applications for a specific client
export const getApplicationsForClient = async (clientId) => {
  try {
    // Fetch all applications where the client matches the given clientId
    const applications = await Application.find({ client: clientId })
      .populate('job', 'title description') // populate job details
      .populate('applicant', 'name email') // populate applicant details
      .select('coverLetter status job applicant client attachments clientNotes createdAt updatedAt'); // select only the relevant fields

    return applications;
  } catch (error) {
    console.error('Error fetching client applications:', error);
    throw new Error('Failed to fetch client applications');
  }
};