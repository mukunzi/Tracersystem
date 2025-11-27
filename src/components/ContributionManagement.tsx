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
import { Plus, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { Member, Contribution } from '@/types';
import { toast } from 'sonner';

const ContributionManagement: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: 0,
    paymentMethod: 'cash' as const,
    period: 'jan' as const,
    year: new Date().getFullYear()
  });

  const months = [
    { value: 'jan', label: 'January' },
    { value: 'feb', label: 'February' },
    { value: 'mar', label: 'March' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'jun', label: 'June' },
    { value: 'jul', label: 'July' },
    { value: 'aug', label: 'August' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'October' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' }
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const storedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    const storedContributions = JSON.parse(localStorage.getItem('contributions') || '[]');
    
    let filteredMembers = storedMembers;
    let filteredContributions = storedContributions;
    
    if (user?.role === 'leader' && user.syndicateId) {
      filteredMembers = storedMembers.filter((m: Member) => m.syndicateId === user.syndicateId);
      const memberIds = filteredMembers.map((m: Member) => m.id);
      filteredContributions = storedContributions.filter((c: Contribution) => memberIds.includes(c.memberId));
    } else if (user?.role === 'member' && user.id) {
      // For members, find their member record and show only their contributions
      const memberRecord = storedMembers.find((m: Member) => 
        m.credentials?.username === user.username
      );
      if (memberRecord) {
        filteredMembers = [memberRecord];
        filteredContributions = storedContributions.filter((c: Contribution) => c.memberId === memberRecord.id);
      } else {
        filteredMembers = [];
        filteredContributions = [];
      }
    }
    
    setMembers(filteredMembers);
    setContributions(filteredContributions);
  };

  const handleCreate = () => {
    if (!formData.memberId || formData.amount <= 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }

    // Check if contribution already exists for this member, period, and year
    const existing = contributions.find(c => 
      c.memberId === formData.memberId && 
      c.period === formData.period && 
      c.year === formData.year
    );

    if (existing) {
      toast.error('Contribution already recorded for this member and period');
      return;
    }

    const newContribution: Contribution = {
      id: Date.now().toString(),
      ...formData,
      recordedBy: user?.username || 'admin',
      recordedAt: new Date().toISOString()
    };

    const allContributions = JSON.parse(localStorage.getItem('contributions') || '[]');
    const updated = [...allContributions, newContribution];
    localStorage.setItem('contributions', JSON.stringify(updated));
    
    loadData();
    resetForm();
    setIsCreateOpen(false);
    toast.success('Contribution recorded successfully');
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      amount: 0,
      paymentMethod: 'cash',
      period: 'jan',
      year: new Date().getFullYear()
    });
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getTotalContributions = () => {
    return contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
  };

  const getContributionsByMonth = () => {
    const monthlyData = months.map(month => {
      const monthContributions = contributions.filter(c => c.period === month.value && c.year === formData.year);
      const total = monthContributions.reduce((sum, c) => sum + c.amount, 0);
      return { month: month.label, total, count: monthContributions.length };
    });
    return monthlyData;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Contribution Management</h3>
          <p className="text-sm text-muted-foreground">
            {user?.role === 'member' ? 'View your contribution history' : 'Record and track member contributions'}
          </p>
        </div>
        {user?.role !== 'member' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Contribution
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Member Contribution</DialogTitle>
                <DialogDescription>
                  Enter contribution details for a member
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={formData.memberId} onValueChange={(value) => setFormData(prev => ({ ...prev, memberId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.idNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="mobibank">Mobile Banking</SelectItem>
                        <SelectItem value="momo">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">Period (Month)</Label>
                    <Select value={formData.period} onValueChange={(value: any) => setFormData(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      placeholder="Enter year"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>
                    Record Contribution
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'member' ? 'My Total Contributions' : 'Total Contributions'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {getTotalContributions().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${contributions.filter(c => 
                c.period === months[new Date().getMonth()].value && 
                c.year === new Date().getFullYear()
              ).reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'member' ? 'My Payments' : 'Contributors'}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'member' 
                ? contributions.length 
                : new Set(contributions.map(c => c.memberId)).size
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'member' ? 'Total payments' : 'Unique members'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'member' ? 'My Contribution History' : 'Recent Contributions'}
          </CardTitle>
          <CardDescription>
            {user?.role === 'member' ? 'Your contribution records' : 'Latest contribution records'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contributions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {user?.role === 'member' ? 'No contributions found' : 'No contributions recorded yet'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {user?.role !== 'member' && <TableHead>Member</TableHead>}
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions
                  .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
                  .slice(0, 10)
                  .map((contribution) => (
                  <TableRow key={contribution.id}>
                    {user?.role !== 'member' && (
                      <TableCell className="font-medium">{getMemberName(contribution.memberId)}</TableCell>
                    )}
                    <TableCell>${contribution.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {contribution.paymentMethod.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{months.find(m => m.value === contribution.period)?.label}</TableCell>
                    <TableCell>{contribution.year}</TableCell>
                    <TableCell>{contribution.recordedBy}</TableCell>
                    <TableCell>{new Date(contribution.recordedAt).toLocaleDateString()}</TableCell>
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

export default ContributionManagement;
