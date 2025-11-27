
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'leader' | 'member';
  syndicateId?: string;
}

export interface Syndicate {
  id: string;
  name: string;
  leaderId: string;
  leaderCredentials: {
    username: string;
    password: string;
  };
  createdAt: string;
  memberCount: number;
}

export interface Member {
  id: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  administrativeLocation: string;
  disabilityStatus: boolean;
  educationLevel: 'none' | 'primary' | 'secondary' | 'tvet' | 'university';
  institutionName: string;
  professional: string;
  contract: boolean;
  yearJobStart: number;
  socialSecurityId: string;
  syndicateId: string;
  registeredBy: string;
  registeredAt: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'mobibank' | 'momo';
  period: 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';
  year: number;
  recordedBy: string;
  recordedAt: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  registeredMembers: string[];
  syndicateId?: string;
}
