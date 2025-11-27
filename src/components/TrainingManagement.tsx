
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, MapPin, BookOpen } from 'lucide-react';
import { Member, Training } from '@/types';
import { toast } from 'sonner';

const TrainingManagement: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: 0
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const storedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    const storedTrainings = JSON.parse(localStorage.getItem('trainings') || '[]');
    
    let filteredMembers = storedMembers;
    let filteredTrainings = storedTrainings;
    
    if (user?.role === 'leader' && user.syndicateId) {
      filteredMembers = storedMembers.filter((m: Member) => m.syndicateId === user.syndicateId);
      filteredTrainings = storedTrainings.filter((t: Training) => 
        !t.syndicateId || t.syndicateId === user.syndicateId
      );
    }
    
    setMembers(filteredMembers);
    setTrainings(filteredTrainings);
  };

  const handleCreate = () => {
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTraining: Training = {
      id: Date.now().toString(),
      ...formData,
      registeredMembers: [],
      syndicateId: user?.role === 'leader' ? user.syndicateId : undefined
    };

    const allTrainings = JSON.parse(localStorage.getItem('trainings') || '[]');
    const updated = [...allTrainings, newTraining];
    localStorage.setItem('trainings', JSON.stringify(updated));
    
    loadData();
    resetForm();
    setIsCreateOpen(false);
    toast.success('Training created successfully');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      capacity: 0
    });
  };

  const handleRegisterMember = (memberId: string) => {
    if (!selectedTraining) return;

    if (selectedTraining.registeredMembers.includes(memberId)) {
      toast.error('Member is already registered for this training');
      return;
    }

    if (selectedTraining.registeredMembers.length >= selectedTraining.capacity) {
      toast.error('Training is at full capacity');
      return;
    }

    const updatedTraining = {
      ...selectedTraining,
      registeredMembers: [...selectedTraining.registeredMembers, memberId]
    };

    const allTrainings = JSON.parse(localStorage.getItem('trainings') || '[]');
    const updated = allTrainings.map((t: Training) => 
      t.id === selectedTraining.id ? updatedTraining : t
    );
    
    localStorage.setItem('trainings', JSON.stringify(updated));
    loadData();
    setSelectedTraining(updatedTraining);
    toast.success('Member registered for training');
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getTrainingStatus = (training: Training) => {
    const now = new Date();
    const startDate = new Date(training.startDate);
    const endDate = new Date(training.endDate);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="default">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Training Management</h3>
          <p className="text-sm text-muted-foreground">Organize and manage member training programs</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'leader') && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Training
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Training</DialogTitle>
                <DialogDescription>
                  Set up a new training program for members
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Training Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter training title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter training description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter training location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    placeholder="Maximum participants"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>
                    Create Training
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainings.length}</div>
            <p className="text-xs text-muted-foreground">All programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainings.filter(t => getTrainingStatus(t) === 'upcoming').length}
            </div>
            <p className="text-xs text-muted-foreground">Future trainings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainings.filter(t => getTrainingStatus(t) === 'ongoing').length}
            </div>
            <p className="text-xs text-muted-foreground">Active now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainings.reduce((sum, t) => sum + t.registeredMembers.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Programs</CardTitle>
          <CardDescription>All scheduled training programs</CardDescription>
        </CardHeader>
        <CardContent>
          {trainings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No training programs scheduled</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.title}</TableCell>
                    <TableCell>{new Date(training.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(training.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{training.location}</TableCell>
                    <TableCell>
                      {training.registeredMembers.length} / {training.capacity}
                    </TableCell>
                    <TableCell>{getStatusBadge(getTrainingStatus(training))}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedTraining(training);
                          setIsRegisterOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Training Details and Registration Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTraining?.title}</DialogTitle>
            <DialogDescription>
              Training details and participant management
            </DialogDescription>
          </DialogHeader>
          {selectedTraining && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedTraining.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{selectedTraining.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedTraining.startDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedTraining.endDate).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Registered Participants</Label>
                <div className="mt-2 space-y-2">
                  {selectedTraining.registeredMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No participants registered yet</p>
                  ) : (
                    selectedTraining.registeredMembers.map((memberId) => (
                      <div key={memberId} className="flex items-center justify-between p-2 bg-secondary rounded">
                        <span className="text-sm">{getMemberName(memberId)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {(user?.role === 'admin' || user?.role === 'leader') && (
                <div>
                  <Label className="text-sm font-medium">Register Members</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {members
                      .filter(member => !selectedTraining.registeredMembers.includes(member.id))
                      .map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="text-sm font-medium">{member.name}</span>
                          <p className="text-xs text-muted-foreground">{member.professional}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleRegisterMember(member.id)}
                          disabled={selectedTraining.registeredMembers.length >= selectedTraining.capacity}
                        >
                          Register
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingManagement;
