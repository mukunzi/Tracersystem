
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import SyndicateManagement from '@/components/SyndicateManagement';
import MemberRegistration from '@/components/MemberRegistration';
import ContributionManagement from '@/components/ContributionManagement';
import TrainingManagement from '@/components/TrainingManagement';
import DashboardContent from '@/components/DashboardContent';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      setActiveView(event.detail);
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  const handleNavigate = (view: string) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'syndicates':
        return user?.role === 'admin' ? <SyndicateManagement /> : <MemberRegistration />;
      case 'members':
        return <MemberRegistration />;
      case 'contributions':
        return <ContributionManagement />;
      case 'training':
        return <TrainingManagement />;
      case 'overview':
      default:
        return <DashboardContent />;
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'syndicates':
        return user?.role === 'admin' ? 'Syndicate Management' : 'Member Management';
      case 'members':
        return 'Member Management';
      case 'contributions':
        return 'Contribution Management';
      case 'training':
        return 'Training Management';
      case 'overview':
      default:
        return 'Dashboard';
    }
  };

  return (
    <Layout 
      title={getTitle()} 
      activeView={activeView} 
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
};

export default Dashboard;
