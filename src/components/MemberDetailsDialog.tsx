
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types';

interface MemberDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
}

const MemberDetailsDialog: React.FC<MemberDetailsDialogProps> = ({
  open,
  onOpenChange,
  member
}) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Complete information about {member.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Full Name</h4>
              <p className="text-lg font-semibold">{member.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">ID Number</h4>
              <p>{member.idNumber}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Phone Number</h4>
              <p>{member.phoneNumber}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Marital Status</h4>
              <Badge variant="outline">{member.maritalStatus.toUpperCase()}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Administrative Location</h4>
              <p>{member.administrativeLocation || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Disability Status</h4>
              <Badge variant={member.disabilityStatus ? "destructive" : "secondary"}>
                {member.disabilityStatus ? "Has Disability" : "No Disability"}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Education Level</h4>
              <Badge variant="outline">{member.educationLevel.toUpperCase()}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Institution Name</h4>
              <p>{member.institutionName || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Professional</h4>
              <p>{member.professional || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Contract Status</h4>
              <Badge variant={member.contract ? "default" : "secondary"}>
                {member.contract ? "Has Contract" : "No Contract"}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Year Job Started</h4>
              <p>{member.yearJobStart}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Social Security ID</h4>
              <p>{member.socialSecurityId || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Registered By</h4>
              <p>{member.registeredBy}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Registration Date</h4>
              <p>{new Date(member.registeredAt).toLocaleDateString()}</p>
            </div>
          </div>

          {member.credentials && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Login Credentials</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Username:</span>
                  <code className="ml-2 bg-background px-2 py-1 rounded text-sm">
                    {member.credentials.username}
                  </code>
                </div>
                <div>
                  <span className="text-sm font-medium">Password:</span>
                  <code className="ml-2 bg-background px-2 py-1 rounded text-sm">
                    {member.credentials.password}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsDialog;
