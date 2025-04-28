// Example implementation for /app/api/applications/route.js (App Router)
import { NextResponse } from 'next/server';
import { connect } from '@/utils/db'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { applyForJob, getUserApplications } from '@/utils/applicationUtils';

// GET - Get user's applications
export async function GET(request) {
  try {
    await connect();
    
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    
    const applications = await getUserApplications(session.user.id);
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST - Submit a job application
export async function POST(request) {
  try {
    await connect();
    
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log(session.user.role)
    if (session.user.role !== 'freelancer') {
      return NextResponse.json(
        { error: 'Only freelancers can apply for jobs' },
        { status: 403 }
      );
    }
    
    const applicationData = await request.json();
    
    // Validate application data
    if (!applicationData.jobId || !applicationData.coverLetter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Submit application
    const newApplication = await applyForJob(
      {
        coverLetter: applicationData.coverLetter,
        attachments: applicationData.attachments || []
      },
      applicationData.jobId,
      session.user.id
    );
    
    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}