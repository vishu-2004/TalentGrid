// Example implementation for /app/api/jobs/route.js (App Router)
import { NextResponse } from 'next/server';
import { connect } from '@/utils/db'
import Job from '@/models/Job';
import { searchJobs } from '@/utils/jobUtils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // CORRECT PATH

// GET - Search or list jobs
export async function GET(request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query') || '';
    const skills = searchParams.get('skills')?.split(',') || [];
    const location = searchParams.get('location') || '';
    const jobType = searchParams.get('jobType') || '';
    const experience = searchParams.get('experience') || '';
    const status = searchParams.get('status') || 'Open';
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    const jobs = await searchJobs({
      query,
      skills,
      location,
      jobType,
      experience,
      status,
      limit,
      skip
    });
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create a new job (client only)
export async function POST(request) {
  try {
    await connect();
    
    // Verify authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (session.user.role !== 'client') {
      return NextResponse.json(
        { error: 'Only clients can post jobs' },
        { status: 403 }
      );
    }
    
    const jobData = await request.json();
    
    // Validate job data
    if (!jobData.title || !jobData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create job with client ID
    const newJob = await createJob(jobData, session.user.id);
    
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}