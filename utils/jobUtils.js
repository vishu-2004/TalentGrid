import Job from "../models/Job";
import User from "../models/User";
import mongoose from "mongoose";

/**
 * Create a new job listing
 */
export async function createJob(jobData, clientId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Create the job
    const newJob = await Job.create(
      [{
        ...jobData,
        client: clientId,
        createdBy: clientId,
      }],
      { session }
    );
    
    // Update the client's postedJobs array
    await User.findByIdAndUpdate(
      clientId,
      { $push: { postedJobs: newJob[0]._id } },
      { session }
    );
    
    await session.commitTransaction();
    return newJob[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Get jobs posted by a specific client
 */
export async function getClientJobs(clientId, options = {}) {
  const { status, limit = 10, skip = 0 } = options;
  
  const query = { client: clientId };
  if (status) {
    query.status = status;
  }
  
  return await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('applicants', 'name profilePicture')
    .lean();
}

/**
 * Search for jobs based on criteria
 */
export async function searchJobs(criteria) {
  const { 
    query, 
    skills, 
    location, 
    jobType, 
    experience,
    status = "Open",
    limit = 20, 
    skip = 0 
  } = criteria;
  
  const searchQuery = { status };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (skills && skills.length > 0) {
    searchQuery.skills = { $in: skills };
  }
  
  if (location) {
    searchQuery.location = new RegExp(location, 'i');
  }
  
  if (jobType) {
    searchQuery.jobType = jobType;
  }
  
  if (experience) {
    searchQuery.experience = experience;
  }
  
  return await Job.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('client', 'name companyName profilePicture')
    .lean();
}