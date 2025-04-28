// app/api/client/jobs/[jobId]/route.js

import { NextResponse } from 'next/server';
import { connect } from '@/utils/db'; // Your DB connection utility
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Your NextAuth options
import Job from '@/models/Job'; // Import your Mongoose Job model
import mongoose from 'mongoose'; // Import mongoose to validate ObjectId

export async function GET(request, context) {
  // The second argument 'context' contains route parameters
  const { jobId } = context.params;
  console.log(`GET /api/client/jobs/${jobId} hit`);

  // Basic check for valid ObjectId format
  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    console.log(`GET /api/client/jobs/${jobId} - Invalid ID format`);
    return NextResponse.json({ error: 'Invalid Job ID format' }, { status: 400 });
  }

  try {
    await connect(); // Ensure database connection

    // 1. Authentication & Authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log(`GET /api/client/jobs/${jobId} - Unauthorized (no session)`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Ensure the user has the 'client' role
    if (session.user.role !== 'client') {
      console.log(`GET /api/client/jobs/${jobId} - Forbidden (role: ${session.user.role})`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const clientId = session.user.id; // Get the authenticated client's ID
    console.log(`GET /api/client/jobs/${jobId} - Authorized for client: ${clientId}`);

    // 2. Fetch the specific job *belonging to this client*
    console.log(`GET /api/client/jobs/${jobId} - Querying for job ID ${jobId} and client ID ${clientId}`);
    const job = await Job.findOne({
      _id: jobId,     // Match the job ID from the URL
      client: clientId // CRITICAL: Ensure the job belongs to the authenticated client
    }).lean(); // Use .lean() for performance if you only need the plain JS object

    // 3. Handle Job Not Found (or not belonging to this client)
    if (!job) {
      console.log(`GET /api/client/jobs/${jobId} - Job not found or access denied for client ${clientId}`);
      // Return 404 whether the job doesn't exist or belongs to another client
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // 4. Return Success Response
    console.log(`GET /api/client/jobs/${jobId} - Job found for client ${clientId}`);
    return NextResponse.json(job); // Return the found job object

  } catch (error) {
    console.error(`Error fetching job ${jobId} for client ${session?.user?.id}:`, error);
    // Handle potential CastError if ID format is wrong despite validation
    if (error.name === 'CastError') {
         return NextResponse.json({ error: 'Invalid Job ID format in query' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch job', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

// You could potentially add PUT/DELETE handlers here later
// export async function PUT(request, context) { ... }
// export async function DELETE(request, context) { ... }