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

export const AgentsSettings = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<AgentMember[]>([]);
  const [invited, setInvited] = useState<InvitedAgent[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const AGENT_LIMIT = 5;
  const totalAgents = members.length + invited.length;
  const limitReached = totalAgents >= AGENT_LIMIT;

  const fetchMembers = async () => {
    setInitialLoading(true);
    const orgId = localStorage.getItem('org_id');
    try {
      const res = await fetch(`/api/Agents?org_id=${orgId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        const mappedMembers = (data.members || []).map((member: AgentMember) => ({
          ...member,
          user_id: member.public_user_data?.user_id || '',
        }));
        setMembers(mappedMembers);

        const pendingInvited = (data.invited || []).filter(
          (invite: InvitedAgent) => invite.status === 'pending'
        );
        setInvited(pendingInvited);
      } else {
        toast.error(data?.error || 'Failed to fetch members.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

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
        const mapInviteId = data.id || data.invitation_id || data.data?.id;
        setInvited((prev) => [
          ...prev,
          { id: mapInviteId, email_address: email, status: 'pending' },
        ]);
        toast.success('Invitation sent successfully!');
        setIsOpen(false);
        setEmail('');
        setRole('');
        await fetchMembers();
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
        await fetchMembers();
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
        // Remove the invite from local state immediately
        setInvited((prev) => prev.filter(invite => invite.id !== invitationId));
        // Then refresh from server
        await fetchMembers();
      } else if (res.status === 404) {
        toast.info("Invitation already revoked or not found.");
        setInvited((prev) => prev.filter(invite => invite.id !== invitationId));
        await fetchMembers();
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
    <div className="space-y-6 p-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Agents Management</h2>
        <p className="text-gray-600">
          Manage your organization&apos;s agents and invitations. Current usage: {totalAgents}/{AGENT_LIMIT} agents.
        </p>
      </div>

      {limitReached && (
        <div className="border border-amber-200 rounded-lg bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Agent Limit Reached</h3>
              <p className="text-amber-700">
                You have reached the maximum number of agents ({AGENT_LIMIT}). 
                Contact support to increase your limit.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Team Members & Invitations
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    Email Address
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">Role</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                      <span>Loading members...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : members.length === 0 && invited.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <UserPlus className="h-8 w-8 text-gray-300" />
                      <span className="text-lg font-medium">No team members yet</span>
                      <span className="text-sm">Start by inviting your first agent</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {members.map((member: AgentMember) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {member.public_user_data?.identifier || member.identifier || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role_name)}`}>
                          {getRoleDisplayName(member.role_name)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deletingUserId === member.user_id || actionLoading}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
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
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                Remove Team Member
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-left">
                                Are you sure you want to remove <strong>{member.public_user_data?.identifier || member.identifier}</strong> from your organization?
                                <br /><br />
                                This action cannot be undone. The user will lose access to all organization resources immediately.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member.user_id)}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                              >
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invited.map((invite: InvitedAgent) => (
                    <TableRow key={invite.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {invite.email_address}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          Pending
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Invitation Sent
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={revokingInviteId === invite.id || actionLoading}
                              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                            >
                              {revokingInviteId === invite.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin h-3 w-3 border border-orange-600 border-t-transparent rounded-full"></div>
                                  Revoking...
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <UserMinus className="h-3 w-3" />
                                  Revoke
                                </div>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                Revoke Invitation
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-left">
                                Are you sure you want to revoke the invitation sent to <strong>{invite.email_address}</strong>?
                                <br /><br />
                                This will cancel their pending invitation and they will no longer be able to join your organization using the current invite link.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevokeInvite(invite.id as string)}
                                className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
                              >
                                Revoke Invitation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEmail('');
              setRole('');
            }
          }}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={limitReached}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {limitReached ? 'Agent Limit Reached' : 'Invite New Agent'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Invite New Agent
                </DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
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
                    className="w-full"
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
                    <SelectTrigger className="w-full">
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
                <DialogFooter className="gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={inviting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!email || !role || inviting}
                    
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
  );
};

export default AgentsSettings;