"use client"
import AgentsSettings from '@/components/setting_tab/Agent_management'
import React from 'react'

interface AgentMember {
  id: string | number;
  identifier: string;
  role_name: string;
  user_id: string; 
  public_user_data?: {
    identifier?: string;
    user_id?: string;
  };
}

interface InvitedAgent {
  id: string | number;
  email_address: string;
  status: string;
}

const team_collabration = () => {
  // Define placeholder values for the required props
  const members: AgentMember[] = [];
  const invited: InvitedAgent[] = [];
  const initialLoading = false;
  const refresh = () => {};
  const agentLimit = 0;

  return (
    <AgentsSettings
      members={members}
      invited={invited}
      initialLoading={initialLoading}
      refresh={refresh}
      agentLimit={agentLimit}
    />
  )
}

export default team_collabration