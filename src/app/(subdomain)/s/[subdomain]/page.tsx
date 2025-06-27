import DashboardPage from '@/app/dashboard/page';
import {clerkClient} from '@clerk/nextjs/server';

interface Params {
  subdomain: string;
}

export default async function Subdomain({params}: {params: Promise<Params>}) {
  const {subdomain} = await params;
  const client = await clerkClient();

  const org = await client.organizations.getOrganization({slug: subdomain});
  
  const orgID =org.id
  console.log(orgID)
  return (
    <DashboardPage orgSlug={orgID}/>
  );
}
