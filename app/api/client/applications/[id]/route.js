import { NextResponse } from 'next/server';
import { connect } from '@/utils/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateApplicationStatus, deleteApplicationById } from '@/utils/applicationUtils';

export async function PUT(request, { params }) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const clientId = session.user.id;
    const { id } = params;
    const { status } = await request.json();
    // Update status if application belongs to one of client's jobs
    const updated = await updateApplicationStatus(id, clientId, status);
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('Error updating application status:', err);
    return NextResponse.json({ error: err.message || 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const clientId = session.user.id;
    const { id } = params;
    // Delete if belongs to client's jobs
    await deleteApplicationById(id, clientId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error deleting application:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete application' }, { status: 500 });
  }
}
