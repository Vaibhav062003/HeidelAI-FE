'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, UserMinus, Mail, UserPlus, AlertTriangle } from 'lucide-react';

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

interface AgentsSettingsProps {
  members: AgentMember[];
  invited: InvitedAgent[];
  initialLoading: boolean;
  refresh: () => void;
  agentlimit: number;
}

export const AgentsSettings = ({
  members,
  invited,
  initialLoading,
  refresh,
  agentlimit,
}: AgentsSettingsProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [members, setMembers] = useState<AgentMember[]>([]);
  // const [invited, setInvited] = useState<InvitedAgent[]>([]);
  // const [initialLoading, setInitialLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const AGENT_LIMIT = 5;
  const totalAgents = members.length + invited.length;
  const limitReached = totalAgents >= AGENT_LIMIT;

  // const fetchMembers = async () => {
  //   setInitialLoading(true);
  //   const orgId = localStorage.getItem('org_id');
  //   try {
  //     const res = await fetch(`/api/Agents?org_id=${orgId}`, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       const mappedMembers = (data.members || []).map((member: AgentMember) => ({
  //         ...member,
  //         user_id: member.public_user_data?.user_id || '',
  //       }));
  //       setMembers(mappedMembers);

  //       const pendingInvited = (data.invited || []).filter(
  //         (invite: InvitedAgent) => invite.status === 'pending'
  //       );
  //       setInvited(pendingInvited);
  //     } else {
  //       toast.error(data?.error || 'Failed to fetch members.');
  //     }
  //   } catch (err) {
  //     toast.error('Network error. Please try again.');
  //   } finally {
  //     setInitialLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchMembers();
  // }, []);

  const handleInviteAgent = async () => {
    if (!email || !role) {
      toast.error('Please enter both email and role.');
      return;
    }
    setInviting(true);
    setActionLoading(true);
    const OrgId = localStorage.getItem('org_id');
    const payload = { email_address: email, role };
    try {
      const res = await fetch(`/api/Agents?org_id=${OrgId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

        if (res.ok){
        toast.success('Invitation sent successfully!');
        setIsOpen(false);
        setEmail('');
        setRole('');
        refresh();
      } else {
        toast.error(data?.error || 'Failed to invite agent.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setInviting(false);
      setActionLoading(false);
    }
  };

  const handleDeleteMember = async (userId: string) => {
    setDeletingUserId(userId);
    setActionLoading(true);
    const orgId = localStorage.getItem('org_id');
    try {
      const res = await fetch(`/api/Agents?org_id=${orgId}&user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Failed to delete member.');
      } else {
        toast.success('Member deleted successfully!');
        await refresh();
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setDeletingUserId(null);
      setActionLoading(false);
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    setRevokingInviteId(invitationId);
    setActionLoading(true);
    const orgId = localStorage.getItem('org_id');
    if (!orgId) {
      toast.error("Organization ID missing.");
      setRevokingInviteId(null);
      setActionLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/Agents?org_id=${orgId}&invitation_id=${invitationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requesting_user_id: null }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Invitation revoked successfully.");
        await refresh();
      } else if (res.status === 404) {
        toast.info("Invitation already revoked or not found.");
        await refresh();
      } else {
        toast.error(data?.error || "Failed to revoke invitation.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setRevokingInviteId(null);
      setActionLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) { 
      case 'org:admin':
        return 'Administrator';
      case 'org:member':
        return 'Member';
      default:
        return role || 'N/A';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'org:admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'org:member':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
   <div className="h-full w-full overflow-y-auto bg-gray-50/30">
      <div className="
        max-w-7xl mx-auto
        h-full
        p-4 sm:p-6 lg:p-15
        space-y-5
      ">
        
        {/* Header Section */}
        {/* <div className="border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Agents Management
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Manage your organization&apos;s agents and invitations. Current usage: 
            <span className="font-semibold text-gray-900"> {totalAgents}/{AGENT_LIMIT} agents</span>.
          </p>
        </div> */}

        {/* Alert Banner */}
        {limitReached && (
          <div className="border border-amber-200 rounded-xl bg-amber-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-amber-800 mb-2 text-lg">
                  Agent Limit Reached
                </h3>
                <p className="text-amber-700 leading-relaxed">
                  You have reached the maximum number of agents ({AGENT_LIMIT}). 
                  Contact support to increase your limit.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table Container with proper boundaries */}
        <div className="
          bg-white 
          border border-gray-200 
          rounded-xl 
          shadow-sm hover:shadow-md 
          transition-shadow duration-200
          overflow-hidden
        ">
          
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-blue-600" />
              Team Members & Invitations
            </h3>
          </div>

          {/* Table with proper width constraints */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50/80 border-b border-gray-200">
                    <TableHead className="
                      font-semibold text-gray-900 
                      px-6 py-4 text-left
                      w-2/5 min-w-[250px]
                    ">
                      Email Address
                    </TableHead>
                    <TableHead className="
                      font-semibold text-gray-900
                      px-6 py-4 text-left
                      w-1/5 min-w-[120px]
                    ">
                      Role
                    </TableHead>
                    <TableHead className="
                      font-semibold text-gray-900
                      px-6 py-4 text-left
                      w-1/5 min-w-[120px]
                    ">
                      Status
                    </TableHead>
                    <TableHead className="
                      font-semibold text-gray-900
                      px-6 py-4 text-right
                      w-1/5 min-w-[120px]
                    ">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-16 px-6">
                        <div className="flex flex-col items-center gap-4 text-gray-500">
                          <div className="animate-spin h-10 w-10 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                          <span className="text-lg font-medium">Loading members...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : members.length === 0 && invited.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-16 px-6">
                        <div className="flex flex-col items-center gap-4 text-gray-500">
                          <UserPlus className="h-16 w-16 text-gray-300" />
                          <div className="space-y-2">
                            <span className="text-xl font-semibold text-gray-700">No team members yet</span>
                            <span className="text-gray-500">Start by inviting your first agent</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {members.map((member: AgentMember) => (
                        <TableRow key={member.id} className="
                          hover:bg-gray-50/80 
                          transition-colors duration-150
                          border-b border-gray-100
                        ">
                          <TableCell className="px-6 py-4 font-medium">
                            <div className="truncate max-w-xs">
                              {member.public_user_data?.identifier || member.identifier || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className={`
                              inline-flex items-center 
                              px-3 py-1.5 rounded-full 
                              text-sm font-medium border 
                              ${getRoleBadgeColor(member.role_name)}
                            `}>
                              {getRoleDisplayName(member.role_name)}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="
                              inline-flex items-center 
                              px-3 py-1.5 rounded-full 
                              text-sm font-medium 
                              bg-green-100 text-green-800 
                              border border-green-200
                            ">
                              Active
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={deletingUserId === member.user_id || actionLoading}
                                  className="
                                    text-red-600 border-red-200 
                                    hover:bg-red-50 hover:border-red-300
                                  "
                                >
                                  {deletingUserId === member.user_id ? (
                                    <div className="flex items-center gap-2">
                                      <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full"></div>
                                      Removing...
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <Trash2 className="h-3 w-3" />
                                      Remove
                                    </div>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                      {invited.map((invite: InvitedAgent) => (
                        <TableRow key={invite.id} className="
                          hover:bg-gray-50/80 
                          transition-colors duration-150
                          border-b border-gray-100
                        ">
                          <TableCell className="px-6 py-4 font-medium">
                            <div className="truncate max-w-xs">
                              {invite.email_address}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="
                              inline-flex items-center 
                              px-3 py-1.5 rounded-full 
                              text-sm font-medium 
                              bg-gray-100 text-gray-800 
                              border border-gray-200
                            ">
                              Pending
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="
                              inline-flex items-center 
                              px-3 py-1.5 rounded-full 
                              text-sm font-medium 
                              bg-yellow-100 text-yellow-800 
                              border border-yellow-200
                            ">
                              Invitation Sent
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-200 bg-gray-50/30">
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setEmail('');
                setRole('');
              }
            }}>
              <DialogTrigger asChild>
                <Button
                  className="
                    w-full bg-blue-600 hover:bg-blue-700 
                    text-white py-4 text-lg font-medium
                    rounded-lg transition-all duration-200
                    hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  disabled={limitReached}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  {limitReached ? 'Agent Limit Reached' : 'Invite New Agent'}
                </Button>
              </DialogTrigger>

              <DialogContent className="
                w-full max-w-sm mx-4 
                sm:max-w-md sm:mx-0
                lg:max-w-lg
              ">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Invite New Agent
                  </DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4 sm:space-y-5"
                  onSubmit={e => {
                    e.preventDefault();
                    handleInviteAgent();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={inviting}
                      placeholder="agent@example.com"
                      required
                      className="w-full text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role *
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(value) => setRole(value)}
                      disabled={inviting}
                      required
                    >
                      <SelectTrigger className="w-full text-sm sm:text-base">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="org:member">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Member</span>
                            <span className="text-xs text-gray-500">Standard access permissions</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="org:admin">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Administrator</span>
                            <span className="text-xs text-gray-500">Full management permissions</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="gap-2 mt-6 flex flex-col sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      disabled={inviting}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!email || !role || inviting}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      {inviting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          Send Invitation
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsSettings;
