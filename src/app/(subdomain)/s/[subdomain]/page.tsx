import DashboardPage from '@/app/dashboard/page';
import { clerkClient } from '@clerk/nextjs/server';

interface Params {
  subdomain: string;
}

export default async function Subdomain({ params }: { params: Params }) {
  const { subdomain } = params;
  const client = await clerkClient();

  const org = await client.organizations.getOrganization({ slug: subdomain });

  const orgID = org.id;
  return (
    <DashboardPage orgSlug={orgID} />
  );
}
