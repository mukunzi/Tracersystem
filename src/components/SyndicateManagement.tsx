import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Eye, Copy } from 'lucide-react';
import { Syndicate, Member } from '@/types';
import { toast } from 'sonner';
import SyndicateDetailsDialog from './SyndicateDetailsDialog';
import EditSyndicateDialog from './EditSyndicateDialog';

const SyndicateManagement: React.FC = () => {
  const [syndicates, setSyndicates] = useState<Syndicate[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignLeaderOpen, setIsAssignLeaderOpen] = useState(false);
  const [selectedSyndicate, setSelectedSyndicate] = useState<string>('');
  const [viewingSyndicate, setViewingSyndicate] = useState<Syndicate | null>(null);
  const [editingSyndicate, setEditingSyndicate] = useState<Syndicate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    assignFromMember: false,
    memberId: '',
    leaderUsername: '',
    leaderPassword: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedSyndicates = localStorage.getItem('syndicates');
    const storedMembers = localStorage.getItem('members');
    
    if (storedSyndicates) {
      setSyndicates(JSON.parse(storedSyndicates));
    }
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    }
  };

  const generateCredentials = () => {
    const username = `syndicate_${Math.random().toString(36).substring(2, 8)}`;
    const password = Math.random().toString(36).substring(2, 12);
    return { username, password };
  };

  const getUnassignedMembers = () => {
    const assignedLeaderIds = syndicates.map(s => s.leaderId);
    return members.filter(m => !assignedLeaderIds.includes(m.id));
  };

  const handleCreate = () => {
    if (!formData.name) {
      toast.error('Please enter syndicate name');
      return;
    }

    let leaderCredentials;
    let leaderId = '';

    if (formData.assignFromMember && formData.memberId) {
      const member = members.find(m => m.id === formData.memberId);
      if (!member) {
        toast.error('Selected member not found');
        return;
      }
      leaderId = member.id;
      leaderCredentials = generateCredentials();
    } else {
      if (!formData.leaderUsername || !formData.leaderPassword) {
        toast.error('Please fill in leader credentials');
        return;
      }
      leaderCredentials = {
        username: formData.leaderUsername,
        password: formData.leaderPassword
      };
    }

    const newSyndicate: Syndicate = {
      id: Date.now().toString(),
      name: formData.name,
      leaderId,
      leaderCredentials,
      createdAt: new Date().toISOString(),
      memberCount: 0
    };

    const updated = [...syndicates, newSyndicate];
    localStorage.setItem('syndicates', JSON.stringify(updated));
    setSyndicates(updated);
    
    resetForm();
    setIsCreateOpen(false);
    toast.success('Syndicate created successfully');
  };

  const handleAssignLeader = () => {
    if (!selectedSyndicate || !formData.memberId) {
      toast.error('Please select syndicate and member');
      return;
    }

    const member = members.find(m => m.id === formData.memberId);
    if (!member) {
      toast.error('Selected member not found');
      return;
    }

    const credentials = generateCredentials();
    const updatedSyndicates = syndicates.map(s => 
      s.id === selectedSyndicate 
        ? { ...s, leaderId: member.id, leaderCredentials: credentials }
        : s
    );

    localStorage.setItem('syndicates', JSON.stringify(updatedSyndicates));
    setSyndicates(updatedSyndicates);
    
    setIsAssignLeaderOpen(false);
    setSelectedSyndicate('');
    setFormData(prev => ({ ...prev, memberId: '' }));
    toast.success(`Leader assigned successfully. Credentials: ${credentials.username}/${credentials.password}`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      assignFromMember: false,
      memberId: '',
      leaderUsername: '',
      leaderPassword: ''
    });
  };

  const handleSaveEdit = (updatedSyndicate: Syndicate) => {
    const updatedSyndicates = syndicates.map(s => 
      s.id === updatedSyndicate.id ? updatedSyndicate : s
    );
    localStorage.setItem('syndicates', JSON.stringify(updatedSyndicates));
    setSyndicates(updatedSyndicates);
  };

  const getMemberCount = (syndicateId: string) => {
    return members.filter((m: Member) => m.syndicateId === syndicateId).length;
  };

  const getLeaderName = (leaderId: string) => {
    const leader = members.find(m => m.id === leaderId);
    return leader ? leader.name : 'Not assigned';
  };

  const copyCredentials = (credentials: { username: string; password: string }) => {
    navigator.clipboard.writeText(`Username: ${credentials.username}\nPassword: ${credentials.password}`);
    toast.success('Credentials copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <SyndicateDetailsDialog
        open={!!viewingSyndicate}
        onOpenChange={(open) => !open && setViewingSyndicate(null)}
        syndicate={viewingSyndicate}
        members={members}
      />

      <EditSyndicateDialog
        open={!!editingSyndicate}
        onOpenChange={(open) => !open && setEditingSyndicate(null)}
        syndicate={editingSyndicate}
        onSave={handleSaveEdit}
      />

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Syndicate Management</h3>
          <p className="text-sm text-muted-foreground">Manage trade union syndicates and their leaders</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAssignLeaderOpen} onOpenChange={setIsAssignLeaderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Assign Leader
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Leader to Syndicate</DialogTitle>
                <DialogDescription>
                  Select a syndicate and member to assign as leader
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Syndicate</Label>
                  <Select value={selectedSyndicate} onValueChange={setSelectedSyndicate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose syndicate" />
                    </SelectTrigger>
                    <SelectContent>
                      {syndicates.map((syndicate) => (
                        <SelectItem key={syndicate.id} value={syndicate.id}>
                          {syndicate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Member as Leader</Label>
                  <Select value={formData.memberId} onValueChange={(value) => setFormData(prev => ({ ...prev, memberId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose member" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnassignedMembers().map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.idNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAssignLeaderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignLeader}>
                    Assign Leader
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Syndicate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Syndicate</DialogTitle>
                <DialogDescription>
                  Set up a new syndicate with leader assignment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="syndicate-name">Syndicate Name</Label>
                  <Input
                    id="syndicate-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter syndicate name"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="assign-member"
                    checked={formData.assignFromMember}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      assignFromMember: e.target.checked,
                      memberId: '',
                      leaderUsername: '',
                      leaderPassword: ''
                    }))}
                  />
                  <Label htmlFor="assign-member">Assign existing member as leader</Label>
                </div>

                {formData.assignFromMember ? (
                  <div className="space-y-2">
                    <Label>Select Member as Leader</Label>
                    <Select value={formData.memberId} onValueChange={(value) => setFormData(prev => ({ ...prev, memberId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose member" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUnassignedMembers().map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.idNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="leader-username">Leader Username</Label>
                      <Input
                        id="leader-username"
                        value={formData.leaderUsername}
                        onChange={(e) => setFormData(prev => ({ ...prev, leaderUsername: e.target.value }))}
                        placeholder="Username for syndicate leader"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leader-password">Leader Password</Label>
                      <Input
                        id="leader-password"
                        type="password"
                        value={formData.leaderPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, leaderPassword: e.target.value }))}
                        placeholder="Password for syndicate leader"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>
                    Create Syndicate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Syndicates Overview</CardTitle>
          <CardDescription>List of all registered syndicates with their leaders</CardDescription>
        </CardHeader>
        <CardContent>
          {syndicates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No syndicates created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Login Username</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syndicates.map((syndicate) => (
                  <TableRow key={syndicate.id}>
                    <TableCell className="font-medium">{syndicate.name}</TableCell>
                    <TableCell>{getLeaderName(syndicate.leaderId)}</TableCell>
                    <TableCell>{syndicate.leaderCredentials.username}</TableCell>
                    <TableCell>{getMemberCount(syndicate.id)}</TableCell>
                    <TableCell>{new Date(syndicate.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyCredentials(syndicate.leaderCredentials)}
                          title="Copy login credentials"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewingSyndicate(syndicate)}
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingSyndicate(syndicate)}
                          title="Edit syndicate"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SyndicateManagement;
