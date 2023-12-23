import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { currentUser } from '@clerk/nextjs';

export async function GET() {
  const header = headers();
  const orgId = header.get('organization-id');
  if (!orgId) {
    return new NextResponse(
      JSON.stringify({ name: 'Organization ID header is required' }),
      { status: 400 }
    );
  }

  try {
    const user = await currentUser();
    const communityInfo = await fetchCommunityDetails(orgId);
    const communityData = {
      id: communityInfo.id,
      objectId: communityInfo?._id,
      username: communityInfo.username,
      name: communityInfo.name,
      bio: communityInfo?.bio || '',
      image:
        communityInfo?.image ||
        'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVWRFcXhoWlowYzJOdFZGR1dHeTBtNXZzbTkiLCJyaWQiOiJvcmdfMllYbjNaQmhZc1lTYVZSb2plakJqZTF5Wk9FIiwiaW5pdGlhbHMiOiJUIn0',
      createdBy: communityInfo.createdBy,
    };
    if (user?.id !== communityData.createdBy.id) {
      return new NextResponse(JSON.stringify({ name: 'Unauthorized' }), {
        status: 401,
      });
    }
    return new NextResponse(JSON.stringify(communityData), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        name: 'An error occurred while fetching the community data',
        error: error,
      }),
      { status: 500 }
    );
  }
}
