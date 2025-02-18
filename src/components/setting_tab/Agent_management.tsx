import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const AgentsSettings = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [formData, setFormData] = useState<Omit<Agent, 'created_at'>>({
    id: '',
    name: '',
    email: '',
    role: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_management')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      setAgents(data as Agent[]);
    } catch (error) {
      console.error('Error fetching agents:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleSaveAgent = async () => {
    try {
      setLoading(true);
      if (formData.id) {
        // Update existing agent
        const { data, error } = await supabase
          .from('agent_management')
          .update({
            name: formData.name,
            email: formData.email,
            role: formData.role
          })
          .eq('id', formData.id)
          .select();
  
        if (error) throw error;
        
        const updatedAgents = agents.map(agent => 
          agent.id === formData.id ? data[0] : agent
        );
        setAgents(updatedAgents);
      } else {
        // Add new agent - remove ID from insert data
        const { data, error } = await supabase
          .from('agent_management')
          .insert([{
            name: formData.name,
            email: formData.email,
            role: formData.role
          }])
          .select();
  
        if (error) throw error;
        setAgents([...agents, data[0]]);
      }
  
      setIsOpen(false);
      setFormData({ id: '', name: '', email: '', role: '' });
    } catch (error) {
      console.error('Error saving agent:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async () => {
    if (!formData.id) return;
    
    try {
      setDeleting(true);
      const { error } = await supabase
        .from('agent_management')
        .delete()
        .eq('id', formData.id);

      if (error) throw error;

      setAgents(agents.filter(agent => agent.id !== formData.id));
      setIsOpen(false);
      setFormData({ id: '', name: '', email: '', role: '' });
    } catch (error) {
      console.error('Error deleting agent:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Agents Management</h2>
      <div className="border rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.role}</TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        id: agent.id,
                        name: agent.name,
                        email: agent.email,
                        role: agent.role
                      });
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setFormData({ id: '', name: '', email: '', role: '' });
        }}>
          <DialogTrigger asChild>
            <Button className="mt-4">Add New Agent</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {formData.id ? 'Edit Agent' : 'Add New Agent'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Support">Billing</SelectItem>
                    <SelectItem value="Senior Support">Sales</SelectItem>
                    <SelectItem value="Team Lead">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="w-full" 
                  onClick={handleSaveAgent}
                  disabled={loading || deleting}
                >
                  {loading ? 
                    (formData.id ? 'Updating...' : 'Adding...') : 
                    (formData.id ? 'Update Agent' : 'Add Agent')}
                </Button>
                {formData.id && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAgent}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Agent'}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgentsSettings;