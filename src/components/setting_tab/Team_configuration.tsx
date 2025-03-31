"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Team {
  id: string;
  team_name: string;
  members: number;
  team_leader: string;
  created_at?: string;
}

interface TeamFormData {
  team_name: string;
  members: number;
  team_leader: string;
}

export const TeamsConfiguration = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<TeamFormData>({
    team_name: '',
    members: 0,
    team_leader: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleCreateTeam = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .insert([
          {
            team_name: formData.team_name,
            members: parseInt(formData.members.toString()),
            team_leader: formData.team_leader
          }
        ])
        .select();

      if (error) throw error;

      setTeams([...teams, data[0] as Team]);
      setIsCreateOpen(false);
      setFormData({ team_name: '', members: 0, team_leader: '' });
    } catch (error) {
      console.error('Error creating team:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .update({
          team_name: formData.team_name,
          members: formData.members,  // No need to parse, it's already a number
          team_leader: formData.team_leader
        })
        .eq('id', currentTeam?.id)  // Add optional chaining
        .select();
  
      if (error) throw error;
  
      // Type assertion for the response data
      const updatedTeam = data[0] as Team;
      setTeams(teams.map(team => 
        team.id === currentTeam?.id ? updatedTeam : team
      ));
      setIsEditOpen(false);
      setCurrentTeam(null);
      setFormData({ team_name: '', members: 0, team_leader: '' });
    } catch (error) {
      console.error('Error updating team:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!currentTeam?.id) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', currentTeam.id);

      if (error) throw error;

      setTeams(teams.filter(team => team.id !== currentTeam.id));
      setIsEditOpen(false);
      setCurrentTeam(null);
      setFormData({ team_name: '', members: 0, team_leader: '' });
    } catch (error) {
      console.error('Error deleting team:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setDeleting(false);
    }
  };

  const handleManage = (team: Team) => {
    setCurrentTeam(team);
    setFormData({
      team_name: team.team_name,
      members: team.members,
      team_leader: team.team_leader
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Teams Configuration</h2>
      <div className="border rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Team Leader</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.team_name}</TableCell>
                <TableCell>{team.members}</TableCell>
                <TableCell>{team.team_leader}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    onClick={() => handleManage(team)}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Create Team Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Create Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team_name">Team Name</Label>
                <Input
                  id="team_name"
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="members">Members</Label>
                <Input
                  id="members"
                  type="number"
                  min="0"
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="team_leader">Team Leader</Label>
                <Input
                  id="team_leader"
                  value={formData.team_leader}
                  onChange={(e) => setFormData({ ...formData, team_leader: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateTeam}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Team'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Team Dialog */}
        <Dialog open={isEditOpen} onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setCurrentTeam(null);
            setFormData({ team_name: '', members: 0, team_leader: '' });
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_team_name">Team Name</Label>
                <Input
                  id="edit_team_name"
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_members">Members</Label>
                <Input
                  id="edit_members"
                  type="number"
                  min="0"
                  value={formData.members}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    members: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit_team_leader">Team Leader</Label>
                <Input
                  id="edit_team_leader"
                  value={formData.team_leader}
                  onChange={(e) => setFormData({ ...formData, team_leader: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleUpdateTeam}
                  disabled={loading || deleting}
                >
                  {loading ? 'Updating...' : 'Update Team'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTeam}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Team'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeamsConfiguration;