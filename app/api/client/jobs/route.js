// // Example implementation for /app/api/client/jobs/route.js (App Router)
// import { NextResponse } from 'next/server';
// import { connect } from '@/utils/db'
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // CORRECT PATH
// import { createJob, getClientJobs } from '@/utils/jobUtils';

// // GET - Get client's posted jobs
// export async function GET(request) {
//   try {
//     await connect();
    
//     // Verify authentication and authorization
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
//     console.log("session.user.role ",session.user.role )
//     if (session.user.role !== 'client') {
//       return NextResponse.json(
//         { error: 'Only clients can access this endpoint' },
//         { status: 403 }
//       );
//     }
    
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get('status');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const skip = parseInt(searchParams.get('skip') || '0');
    
//     const jobs = await getClientJobs(session.user.id, { status, limit, skip });
    
//     return NextResponse.json(jobs);
//   } catch (error) {
//     console.error('Error fetching client jobs:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch jobs' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new job
// export async function POST(request) {
//   try {
//     await connect();
    
//     // Verify authentication and authorization
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
    
//     if (session.user.role !== 'client') {
//       return NextResponse.json(
//         { error: session.user.role },
//         { status: 403 }
//       );
//     }
    
//     const jobData = await request.json();
    
//     // Validate job data
//     if (!jobData.title || !jobData.description || !jobData.location || 
//         !jobData.jobType || !jobData.experience) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }
    
//     // Create job with client ID
//     const newJob = await createJob(jobData, session.user.id);
    
//     return NextResponse.json(newJob, { status: 201 });
//   } catch (error) {
//     console.error('Error creating job:', error);
//     return NextResponse.json(
//       { error: 'Failed to create job' },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request) {
//   console.log("API route /api/client/jobs hit (minimal)");
//   try {
//     // Return the simplest possible valid response
//     return NextResponse.json({ message: 'Minimal test successful' });
//   } catch (error) {
//     console.error("Error in minimal test handler:", error);
//     return NextResponse.json({ message: 'Minimal test failed' }, { status: 500 });
//   }
// }

// /app/api/client/jobs/route.js (App Router)
import { NextResponse } from 'next/server';
import { connect } from '@/utils/db'; // Your DB connection utility
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Your NextAuth options
import Job from '@/models/Job'; // Import your Mongoose Job model directly
import { getClientJobs } from '@/utils/jobUtils'; // Keep utility for fetching client jobs

// GET - Get jobs posted by the currently authenticated client
export async function GET(request) {
  console.log("GET /api/client/jobs hit");
  try {
    await connect(); // Ensure database connection

    // 1. Authentication & Authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("GET /api/client/jobs - Unauthorized (no session)");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Ensure the user has the 'client' role
    if (session.user.role !== 'client') {
      console.log(`GET /api/client/jobs - Forbidden (role: ${session.user.role})`);
      return NextResponse.json(
        { error: 'Forbidden: Only clients can access this endpoint' },
        { status: 403 }
      );
    }
    console.log(`GET /api/client/jobs - Authorized for client: ${session.user.id}`);

    // 2. Parse Query Parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined; // Pass status if present
    const rawLimit = searchParams.get('limit') || '10';
    const rawSkip = searchParams.get('skip') || '0';

    // Ensure limit and skip are valid numbers
    const limit = parseInt(rawLimit, 10);
    const skip = parseInt(rawSkip, 10);

    const options = {
      limit: isNaN(limit) || limit <= 0 ? 10 : limit,
      skip: isNaN(skip) || skip < 0 ? 0 : skip,
    };
    if (status && ['Open', 'Closed', 'On Hold'].includes(status)) { // Validate status enum
      options.status = status;
    }
    console.log(`GET /api/client/jobs - Fetching jobs for client ${session.user.id} with options:`, options);

    console.log(`GET /api/client/jobs - Fetching jobs for client ${session.user.id} with options:`, options);

    const jobsResult = await getClientJobs(session.user.id, options);
    
    // If jobsResult is an array, just return it directly
    if (Array.isArray(jobsResult)) {
      console.warn(`getClientJobs for user ${session.user.id} returned array. Sending it directly.`);
      return NextResponse.json(jobsResult);
    }
    
    // If it's an object with jobs array
    if (jobsResult && typeof jobsResult === 'object' && Array.isArray(jobsResult.jobs)) {
      return NextResponse.json(jobsResult.jobs);
    }
    
    // Fallback if structure is wrong
    console.error(`getClientJobs for user ${session.user.id} returned invalid structure.`, jobsResult);
    return NextResponse.json([]);

  } catch (error) {
    console.error('Error fetching client jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client jobs', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

// POST - Create a new job (Client Only - Implementing Option B: No Transactions)
export async function POST(request) {
  console.log("POST /api/client/jobs hit");
  try {
    await connect(); // Ensure database connection

    // 1. Authentication & Authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("POST /api/client/jobs - Unauthorized (no session)");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Ensure the user has the 'client' role
    if (session.user.role !== 'client') {
       console.log(`POST /api/client/jobs - Forbidden (role: ${session.user.role})`);
      return NextResponse.json(
        { error: 'Forbidden: Only clients can post jobs' }, // Clearer error message
        { status: 403 }
      );
    }
     console.log(`POST /api/client/jobs - Authorized for client: ${session.user.id}`);

    // 2. Get and Validate Request Body based on Schema
    const jobData = await request.json();
    console.log("POST /api/client/jobs - Received job data:", jobData);

    // **Updated validation based on the provided Job Schema**
    const requiredFields = [
        'title',
        'company', // Added from schema
        'rate',    // Added from schema
        'description',
        'location',
        'jobType',
        'experience'
    ];
    const missingFields = requiredFields.filter(field => !jobData[field]);

    if (missingFields.length > 0) {
      console.log(`POST /api/client/jobs - Validation failed: Missing fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Optional: Add validation for enum fields if needed (Mongoose will also validate)
    const validJobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
    const validExperience = ["Entry", "Intermediate", "Senior", "Expert"];
    if (!validJobTypes.includes(jobData.jobType)) {
        return NextResponse.json({ error: `Invalid jobType. Must be one of: ${validJobTypes.join(', ')}`}, { status: 400 });
    }
     if (!validExperience.includes(jobData.experience)) {
        return NextResponse.json({ error: `Invalid experience. Must be one of: ${validExperience.join(', ')}`}, { status: 400 });
    }

    // 3. Prepare Data for Creation (Option B - Direct Model Usage)
    const dataToCreate = {
      // Map directly from jobData using schema field names
      title: jobData.title,
      company: jobData.company,
      rate: jobData.rate,
      description: jobData.description,
      location: jobData.location,
      jobType: jobData.jobType,
      experience: jobData.experience,
      skills: jobData.skills || [], // Use provided skills or default to empty array

      // --- Assign required relationship fields ---
      client: session.user.id,      // Assign the logged-in client's ID
      createdBy: session.user.id,   // Also set createdBy to the client

      // --- Set defaults or use provided values for optional fields ---
      status: jobData.status && ['Open', 'Closed', 'On Hold'].includes(jobData.status) ? jobData.status : 'Open', // Default 'Open' or validated input
      isActive: jobData.isActive !== undefined ? jobData.isActive : true, // Default true or use provided
      applicants: [], // Initialize applicants as empty
    };

    // 4. Create Job using Mongoose Model (No transactions)
    console.log("POST /api/client/jobs - Attempting Job.create with data:", dataToCreate);
    const newJob = await Job.create(dataToCreate);
    console.log(`POST /api/client/jobs - Job created successfully with ID: ${newJob._id}`);

    // 5. Return Success Response
    return NextResponse.json(newJob, { status: 201 });

  } catch (error) {
    console.error('Error creating job:', error);

    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
         console.log("POST /api/client/jobs - Mongoose Validation Error:", error.errors);
         // Extract specific error messages
         const errorMessages = Object.values(error.errors).map(e => e.message).join(', ');
         return NextResponse.json(
            { error: 'Validation failed', details: errorMessages, fields: error.errors },
            { status: 400 }
         );
    }

    // Specific check for the transaction error (unlikely now, but safe)
    if (error.name === 'MongoServerError' && error.code === 20) {
         return NextResponse.json(
            { error: 'Database configuration error encountered.', details: 'Transactions require a replica set.' },
            { status: 500 }
         );
    }

    // General catch-all for other errors
    return NextResponse.json(
      { error: 'Failed to create job', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}