import DashboardPage from '@/app/dashboard/page';
import { clerkClient, auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface Params {
  subdomain: string;
}

export default async function Subdomain({ params }: { params: Params }) {
  const { subdomain } = params;
  const { userId } = await auth();

  if (!userId) {
    // Not logged in, redirect to login with error
    redirect(`/login?error=not_authenticated`);
  }

  const client = await clerkClient();
  const org = await client.organizations.getOrganization({ slug: subdomain });
  if (!org) {
    redirect('/404');
  }
  // Check if the user is a member of the organization
  const membershipsResponse = await client.organizations.getOrganizationMembershipList({ organizationId: org.id });
  const isMember = membershipsResponse.data.some(
    (m) => m.publicUserData?.userId === userId
  );

  if (!isMember) {
    // Not a member, redirect to login with error
    redirect(`/login?error=not_member`);
  }

  return (
    <DashboardPage orgSlug={org.id} />
  );
}
