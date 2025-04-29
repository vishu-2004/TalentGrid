import { NextResponse } from 'next/server';
import { connect } from '@/utils/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getApplicationsForClient } from '@/utils/applicationUtils';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Fetch applications for jobs belonging to this client
    const clientId = session.user.id;
    const applications = await getApplicationsForClient(clientId);
    return NextResponse.json(applications, { status: 200 });
  } catch (err) {
    console.error('Error fetching client applications:', err);
    return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
  }
}
