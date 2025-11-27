
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Member } from '@/types';
import { toast } from 'sonner';

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onSave: (updatedMember: Member) => void;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    maritalStatus: 'single' as 'single' | 'married' | 'divorced' | 'widowed',
    administrativeLocation: '',
    disabilityStatus: false,
    educationLevel: 'none' as 'none' | 'primary' | 'secondary' | 'tvet' | 'university',
    institutionName: '',
    professional: '',
    contract: false,
    yearJobStart: new Date().getFullYear(),
    socialSecurityId: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        idNumber: member.idNumber,
        phoneNumber: member.phoneNumber,
        maritalStatus: member.maritalStatus,
        administrativeLocation: member.administrativeLocation,
        disabilityStatus: member.disabilityStatus,
        educationLevel: member.educationLevel,
        institutionName: member.institutionName,
        professional: member.professional,
        contract: member.contract,
        yearJobStart: member.yearJobStart,
        socialSecurityId: member.socialSecurityId
      });
    }
  }, [member]);

  const handleSave = () => {
    if (!formData.name || !formData.idNumber || !formData.phoneNumber) {
      toast.error('Please fill in required fields');
      return;
    }

    if (member) {
      const updatedMember: Member = {
        ...member,
        ...formData
      };
      onSave(updatedMember);
      onOpenChange(false);
      toast.success('Member updated successfully');
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update member information
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-idNumber">ID Number *</Label>
            <Input
              id="edit-idNumber"
              value={formData.idNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
              placeholder="Enter ID number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phoneNumber">Phone Number *</Label>
            <Input
              id="edit-phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-maritalStatus">Marital Status</Label>
            <Select value={formData.maritalStatus} onValueChange={(value: 'single' | 'married' | 'divorced' | 'widowed') => setFormData(prev => ({ ...prev, maritalStatus: value }))}>
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
            <Label htmlFor="edit-administrativeLocation">Administrative Location</Label>
            <Input
              id="edit-administrativeLocation"
              value={formData.administrativeLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, administrativeLocation: e.target.value }))}
              placeholder="Enter location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-educationLevel">Education Level</Label>
            <Select value={formData.educationLevel} onValueChange={(value: 'none' | 'primary' | 'secondary' | 'tvet' | 'university') => setFormData(prev => ({ ...prev, educationLevel: value }))}>
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
            <Label htmlFor="edit-institutionName">Institution Name</Label>
            <Input
              id="edit-institutionName"
              value={formData.institutionName}
              onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
              placeholder="Enter institution name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-professional">Professional</Label>
            <Input
              id="edit-professional"
              value={formData.professional}
              onChange={(e) => setFormData(prev => ({ ...prev, professional: e.target.value }))}
              placeholder="Enter profession"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-yearJobStart">Year Job Started</Label>
            <Input
              id="edit-yearJobStart"
              type="number"
              value={formData.yearJobStart}
              onChange={(e) => setFormData(prev => ({ ...prev, yearJobStart: parseInt(e.target.value) }))}
              placeholder="Enter start year"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-socialSecurityId">Social Security ID</Label>
            <Input
              id="edit-socialSecurityId"
              value={formData.socialSecurityId}
              onChange={(e) => setFormData(prev => ({ ...prev, socialSecurityId: e.target.value }))}
              placeholder="Enter social security ID"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-disabilityStatus"
              checked={formData.disabilityStatus}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, disabilityStatus: checked }))}
            />
            <Label htmlFor="edit-disabilityStatus">Has Disability</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-contract"
              checked={formData.contract}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, contract: checked }))}
            />
            <Label htmlFor="edit-contract">Has Contract</Label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
