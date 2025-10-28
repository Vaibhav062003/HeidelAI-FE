'use client';

import React, { useState } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useOrganization } from '@clerk/nextjs';
import { Users, Mail, UserPlus, UserMinus, Trash2, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
}

export const TeamManagement = () => {
  const { memberships, invitations } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
     invitations: true,
  });
  
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitationsList, setInvitationsList] = useState<TeamMember[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; member: TeamMember | null; type: 'member' | 'invitation' }>({ 
    open: false, 
    member: null, 
    type: 'member' 
  });
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  

  React.useEffect(() => {
    if (!memberships?.data) return;
    if (!invitations?.data) return;

 

    const inviteMapped: TeamMember[] = invitations.data.map((inv) => ({
      id: inv.id,
      name: inv.emailAddress || 'Invited User',
      email: inv.emailAddress || 'No Email',
      role: inv.roleName as 'Admin' | 'Member',
    }));

    
    
    const mapped: TeamMember[] = memberships.data.map((m) => ({
      id: m.id,
      name: `${m.publicUserData?.firstName ?? ''} ${m.publicUserData?.lastName ?? ''}`.trim() || 
            m.publicUserData?.identifier || 'Unknown',
      email: m.publicUserData?.identifier ?? 'Unknown',
      role: m.roleName as 'Admin' | 'Member',
    }));

    setMembers(mapped);
    setInvitationsList(inviteMapped);
  }, [memberships?.data, invitations?.data]); 

  const isAdmin = memberships?.data?.some(m => m.roleName === 'Admin') ?? false;


  const handleInvite = () => {
    if (!email) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMember: TeamMember = {
      id: (members.length + 1).toString(),
      name: email.split('@')[0],
      email,
      role: 'Member',
    };

    setMembers((prev) => [...prev, newMember]);
    toast.success('Team member invited successfully!');
    setIsInviteOpen(false);
    setEmail('');
  };

  const handleRemoveMember = (member: TeamMember) => {
    setDeleteDialog({ open: true, member, type: 'member' });
  };

  const handleRevokeInvitation = (invitation: TeamMember) => {
    setDeleteDialog({ open: true, member: invitation, type: 'invitation' });
  };

  const confirmDelete = () => {
    if (!deleteDialog.member) return;

    if (deleteDialog.type === 'member') {
      setMembers((prev) => prev.filter(m => m.id !== deleteDialog.member!.id));
      toast.success('Member removed successfully');
    } else {
      setInvitationsList((prev) => prev.filter(i => i.id !== deleteDialog.member!.id));
      toast.success('Invitation revoked successfully');
    }

    setDeleteDialog({ open: false, member: null, type: 'member' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full max-w-10xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">Team Management</h1>
          </div>
          <p className="text-gray-600 ml-11 text-sm">Manage your team members and invite new collaborators</p>
        </div>

        {/* Stats Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Members</p>
              <p className="text-4xl font-semibold text-gray-900">{members.length}</p>
            </div>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex text-black items-center gap-2 bg-gray-200 px-4 py-2.5  hover:bg-blue-500 hover:text-white  rounded-lg transition-colors font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
        </div>

        {/* Invite Modal */}
        {isInviteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                </div>
                <button onClick={() => setIsInviteOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">Send an invitation to join your organization</p>
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">An invitation will be sent to this email address</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {deleteDialog.type === 'member' ? 'Remove Team Member' : 'Revoke Invitation'}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {deleteDialog.type === 'member'
                  ? `Are you sure you want to remove ${deleteDialog.member?.name} from the team? This action cannot be undone.`
                  : `Are you sure you want to revoke the invitation for ${deleteDialog.member?.email}? They will no longer be able to join using this invitation.`}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteDialog({ open: false, type: 'member', member: null })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {deleteDialog.type === 'member' ? 'Remove' : 'Revoke'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs and Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 px-6 py-4 text-center font-medium text-sm uppercase tracking-wide border-b-2 transition-colors ${
                  activeTab === 'members'
                    ? 'border-gray-900 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Members
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                  {members.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('invitations')}
                className={`flex-1 px-6 py-4 text-center font-medium text-sm uppercase tracking-wide border-b-2 transition-colors ${
                  activeTab === 'invitations'
                    ? 'border-gray-900 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Invitations
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                  {invitationsList.length}
                </span>
              </button>
            </div>
          </div>

          {/* Members Table */}
          {activeTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Member</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</th>
                    {isAdmin && <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {members.length > 0 ? (
                    members.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(member.name)} text-white flex items-center justify-center text-sm font-semibold`}>
                              {getInitials(member.name)}
                            </div>
                            <span className="font-medium text-gray-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                        {isAdmin && (
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => handleRemoveMember(member)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <UserMinus className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 3 : 2} className="px-6 py-12 text-center text-gray-500 text-sm">
                        No team members yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Invitations Table */}
          {activeTab === 'invitations' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Invited User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</th>
                    {isAdmin && <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {invitationsList.length > 0 ? (
                    invitationsList.map((invitation) => (
                      <tr key={invitation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(invitation.email)} text-white flex items-center justify-center text-sm font-semibold`}>
                              {getInitials(invitation.name)}
                            </div>
                            <span className="font-medium text-gray-900">{invitation.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{invitation.email}</td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRevokeInvitation(invitation)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Revoke
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 3 : 2} className="px-6 py-12 text-center text-gray-500 text-sm">
                        No pending invitations
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;