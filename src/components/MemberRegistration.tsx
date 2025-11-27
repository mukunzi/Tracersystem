import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Copy, Check, Eye, Edit } from 'lucide-react';
import { Member } from '@/types';
import { toast } from 'sonner';
import MemberDetailsDialog from './MemberDetailsDialog';
import EditMemberDialog from './EditMemberDialog';

const MemberRegistration: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [newMemberCredentials, setNewMemberCredentials] = useState<{username: string; password: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    maritalStatus: 'single' as const,
    administrativeLocation: '',
    disabilityStatus: false,
    educationLevel: 'none' as const,
    institutionName: '',
    professional: '',
    contract: false,
    yearJobStart: new Date().getFullYear(),
    socialSecurityId: ''
  });

  useEffect(() => {
    loadMembers();
  }, [user]);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm]);

  const loadMembers = () => {
    const stored = JSON.parse(localStorage.getItem('members') || '[]');
    let filtered = stored;
    
    if (user?.role === 'leader' && user.syndicateId) {
      filtered = stored.filter((m: Member) => m.syndicateId === user.syndicateId);
    }
    
    setMembers(filtered);
  };

  const filterMembers = () => {
    if (!searchTerm) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.idNumber.includes(searchTerm) ||
      member.phoneNumber.includes(searchTerm)
    );
    setFilteredMembers(filtered);
  };

  const generateMemberCredentials = () => {
    const username = `member_${Math.random().toString(36).substring(2, 8)}`;
    const password = Math.random().toString(36).substring(2, 10);
    return { username, password };
  };

  const handleCreate = () => {
    if (!formData.name || !formData.idNumber || !formData.phoneNumber) {
      toast.error('Please fill in required fields');
      return;
    }

    const credentials = generateMemberCredentials();

    const newMember: Member = {
      id: Date.now().toString(),
      ...formData,
      syndicateId: user?.syndicateId || 'default',
      registeredBy: user?.username || 'admin',
      registeredAt: new Date().toISOString(),
      credentials
    };

    const allMembers = JSON.parse(localStorage.getItem('members') || '[]');
    const updated = [...allMembers, newMember];
    localStorage.setItem('members', JSON.stringify(updated));
    
    loadMembers();
    setNewMemberCredentials(credentials);
    setShowCredentialsDialog(true);
    resetForm();
    setIsCreateOpen(false);
    toast.success('Member registered successfully');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      idNumber: '',
      phoneNumber: '',
      maritalStatus: 'single',
      administrativeLocation: '',
      disabilityStatus: false,
      educationLevel: 'none',
      institutionName: '',
      professional: '',
      contract: false,
      yearJobStart: new Date().getFullYear(),
      socialSecurityId: ''
    });
  };

  const handleSaveEdit = (updatedMember: Member) => {
    const allMembers = JSON.parse(localStorage.getItem('members') || '[]');
    const updatedMembers = allMembers.map((m: Member) => 
      m.id === updatedMember.id ? updatedMember : m
    );
    localStorage.setItem('members', JSON.stringify(updatedMembers));
    loadMembers();
  };

  const copyCredentials = (credentials: {username: string; password: string}) => {
    navigator.clipboard.writeText(`Username: ${credentials.username}\nPassword: ${credentials.password}`);
    toast.success('Credentials copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <MemberDetailsDialog
        open={!!viewingMember}
        onOpenChange={(open) => !open && setViewingMember(null)}
        member={viewingMember}
      />

      <EditMemberDialog
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        member={editingMember}
        onSave={handleSaveEdit}
      />

      {/* Credentials Display Dialog */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member Login Credentials</DialogTitle>
            <DialogDescription>
              Please save these credentials and share them with the member
            </DialogDescription>
          </DialogHeader>
          {newMemberCredentials && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Username:</span>
                  <code className="bg-background px-2 py-1 rounded text-sm">
                    {newMemberCredentials.username}
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Password:</span>
                  <code className="bg-background px-2 py-1 rounded text-sm">
                    {newMemberCredentials.password}
                  </code>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => copyCredentials(newMemberCredentials)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Credentials
                </Button>
                <Button onClick={() => setShowCredentialsDialog(false)}>
                  <Check className="w-4 h-4 mr-2" />
                  Got It
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Member Registration</h3>
          <p className="text-sm text-muted-foreground">Register and manage syndicate members</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            {user?.role === 'leader' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Member
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Member</DialogTitle>
              <DialogDescription>
                Fill in the member details for registration. Login credentials will be generated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                  placeholder="Enter ID number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={formData.maritalStatus} onValueChange={(value: any) => setFormData(prev => ({ ...prev, maritalStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="administrativeLocation">Administrative Location</Label>
                <Input
                  id="administrativeLocation"
                  value={formData.administrativeLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, administrativeLocation: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationLevel">Education Level</Label>
                <Select value={formData.educationLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, educationLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="tvet">TVET</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
                  placeholder="Enter institution name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional">Professional</Label>
                <Input
                  id="professional"
                  value={formData.professional}
                  onChange={(e) => setFormData(prev => ({ ...prev, professional: e.target.value }))}
                  placeholder="Enter profession"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearJobStart">Year Job Started</Label>
                <Input
                  id="yearJobStart"
                  type="number"
                  value={formData.yearJobStart}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearJobStart: parseInt(e.target.value) }))}
                  placeholder="Enter start year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialSecurityId">Social Security ID</Label>
                <Input
                  id="socialSecurityId"
                  value={formData.socialSecurityId}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialSecurityId: e.target.value }))}
                  placeholder="Enter social security ID"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="disabilityStatus"
                  checked={formData.disabilityStatus}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, disabilityStatus: checked }))}
                />
                <Label htmlFor="disabilityStatus">Has Disability</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="contract"
                  checked={formData.contract}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, contract: checked }))}
                />
                <Label htmlFor="contract">Has Contract</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Register Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
          <CardDescription>All registered members in the syndicate</CardDescription>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No members found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Professional</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.idNumber}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell>
                      {member.credentials ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {member.credentials.username}
                        </code>
                      ) : (
                        <span className="text-muted-foreground text-xs">Not generated</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {member.educationLevel.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.professional}</TableCell>
                    <TableCell>
                      <Badge variant={member.contract ? "default" : "secondary"}>
                        {member.contract ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {member.credentials && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyCredentials(member.credentials!)}
                            title="Copy member credentials"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewingMember(member)}
                          title="View member details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingMember(member)}
                          title="Edit member"
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

export default MemberRegistration;
