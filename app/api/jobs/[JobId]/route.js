// app/api/jobs/[jobId]/route.js

import { NextResponse } from 'next/server';
import { connect } from '@/utils/db'; // your DB connection utility
import Job from '@/models/Job'; // your Mongoose Job model
import mongoose from 'mongoose'; // for ObjectId check

export async function GET(request, { params }) {
    console.log(params);
  const jobId  = params.JobId;
  console.log(`GET /api/jobs/${jobId} hit`);

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    return NextResponse.json({ error: 'Invalid Job ID format' }, { status: 400 });
  }

  try {
    await connect();

    const job = await Job.findById(jobId).lean();

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch job', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
