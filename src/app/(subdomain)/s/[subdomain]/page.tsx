import { clerkClient } from '@clerk/nextjs/server';
import DashboardPage from '@/app/dashboard/page';

interface Params {
  subdomain: string;
}

interface SubdomainProps {
  params: Params;
}

export default async function Subdomain({ params }: SubdomainProps) {
  const { subdomain } = await params;

  // Fetch the org using Clerk
  const clerk = await clerkClient();
  const org = await clerk.organizations.getOrganization({ slug: subdomain });
  const slug = org.slug
  

  return <DashboardPage orgSlug={slug} />;
}
