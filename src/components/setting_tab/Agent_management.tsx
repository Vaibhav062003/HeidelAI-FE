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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AgentMember {
  id: string | number;
  identifier: string;
  role_name: string;
  user_id: string; // <-- add this
  public_user_data?: {
    identifier?: string;
    user_id?: string; // Clerk puts user_id here
  };
}

export const AgentsSettings = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<AgentMember[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false); // For global loading

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
        const mappedMembers = (data.data || []).map((member: AgentMember) => ({
          ...member,
          user_id: member.public_user_data?.user_id || '',
        }));
        setMembers(mappedMembers);
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
      if (!res.ok) {
        toast.error(data?.error || 'Failed to invite agent.');
      } else {
        toast.success('Invitation sent successfully!');
        setIsOpen(false);
        setEmail('');
        setRole('');
        await fetchMembers(); // Refetch members for latest data
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setInviting(false);
      setActionLoading(false);
    }
  };

  const handleDeleteMember = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
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
        await fetchMembers(); // Refetch members for latest data
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setDeletingUserId(null);
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold mb-2">Agents Management</h2>
      <div className="border rounded-lg p-6 bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400 py-8">
                  <span className="animate-spin mr-2">⏳</span>Loading members...
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400 py-8">
                  No members to display.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member: AgentMember) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.public_user_data?.identifier || member.identifier || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {member.role_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingUserId === member.user_id || actionLoading}
                      onClick={() => handleDeleteMember(member.user_id)}
                    >
                      {deletingUserId === member.user_id ? (
                        <span className="animate-spin mr-2">⏳</span>
                      ) : null}
                      {deletingUserId === member.user_id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEmail('');
            setRole('');
          }
        }}>
          <DialogTrigger asChild>
            <Button className="mt-6 w-full" variant="default">
              Invite Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Agent</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleInviteAgent();
              }}
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={inviting}
                  placeholder="Enter agent's email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value)}
                  disabled={inviting}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="org:member">Member</SelectItem>
                    <SelectItem value="org:admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                type="submit"
                disabled={!email || !role || inviting}
              >
                {inviting ? 'Inviting...' : 'Send Invitation'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgentsSettings;