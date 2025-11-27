
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Syndicate, Member } from '@/types';

interface SyndicateDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syndicate: Syndicate | null;
  members: Member[];
}

const SyndicateDetailsDialog: React.FC<SyndicateDetailsDialogProps> = ({
  open,
  onOpenChange,
  syndicate,
  members
}) => {
  if (!syndicate) return null;

  const getLeaderName = (leaderId: string) => {
    const leader = members.find(m => m.id === leaderId);
    return leader ? leader.name : 'Not assigned';
  };

  const getMemberCount = (syndicateId: string) => {
    return members.filter(m => m.syndicateId === syndicateId).length;
  };

  const getSyndicateMembers = (syndicateId: string) => {
    return members.filter(m => m.syndicateId === syndicateId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Syndicate Details</DialogTitle>
          <DialogDescription>
            Complete information about {syndicate.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Syndicate Name</h4>
              <p className="text-lg font-semibold">{syndicate.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Leader</h4>
              <p>{getLeaderName(syndicate.leaderId)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Member Count</h4>
              <p className="text-lg font-semibold">{getMemberCount(syndicate.id)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Created Date</h4>
              <p>{new Date(syndicate.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Login Username</h4>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                {syndicate.leaderCredentials.username}
              </code>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">Members List</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {getSyndicateMembers(syndicate.id).map((member) => (
                <div key={member.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>{member.name}</span>
                  <span className="text-sm text-muted-foreground">{member.idNumber}</span>
                </div>
              ))}
              {getSyndicateMembers(syndicate.id).length === 0 && (
                <p className="text-muted-foreground text-center py-4">No members registered yet</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SyndicateDetailsDialog;
