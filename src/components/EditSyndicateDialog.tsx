
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Syndicate } from '@/types';
import { toast } from 'sonner';

interface EditSyndicateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syndicate: Syndicate | null;
  onSave: (updatedSyndicate: Syndicate) => void;
}

const EditSyndicateDialog: React.FC<EditSyndicateDialogProps> = ({
  open,
  onOpenChange,
  syndicate,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    leaderUsername: '',
    leaderPassword: ''
  });

  useEffect(() => {
    if (syndicate) {
      setFormData({
        name: syndicate.name,
        leaderUsername: syndicate.leaderCredentials.username,
        leaderPassword: syndicate.leaderCredentials.password
      });
    }
  }, [syndicate]);

  const handleSave = () => {
    if (!formData.name || !formData.leaderUsername || !formData.leaderPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (syndicate) {
      const updatedSyndicate: Syndicate = {
        ...syndicate,
        name: formData.name,
        leaderCredentials: {
          username: formData.leaderUsername,
          password: formData.leaderPassword
        }
      };
      onSave(updatedSyndicate);
      onOpenChange(false);
      toast.success('Syndicate updated successfully');
    }
  };

  if (!syndicate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Syndicate</DialogTitle>
          <DialogDescription>
            Update syndicate information and credentials
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-syndicate-name">Syndicate Name</Label>
            <Input
              id="edit-syndicate-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter syndicate name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-leader-username">Leader Username</Label>
            <Input
              id="edit-leader-username"
              value={formData.leaderUsername}
              onChange={(e) => setFormData(prev => ({ ...prev, leaderUsername: e.target.value }))}
              placeholder="Enter leader username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-leader-password">Leader Password</Label>
            <Input
              id="edit-leader-password"
              type="password"
              value={formData.leaderPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, leaderPassword: e.target.value }))}
              placeholder="Enter leader password"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSyndicateDialog;
