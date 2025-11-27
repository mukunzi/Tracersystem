
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Users, DollarSign, GraduationCap, LinkIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  activeView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, activeView, onNavigate }) => {
  const { user, logout } = useAuth();

  const menuItems = user?.role === 'admin' ? [
    { icon: BarChart3, label: 'Dashboard', id: 'overview' },
    { icon: Users, label: 'Members', id: 'members' },
    { icon: DollarSign, label: 'Contributions', id: 'contributions' },
    { icon: GraduationCap, label: 'Training', id: 'training' },
    { icon: LinkIcon, label: 'Syndicates', id: 'syndicates' },
  ] : user?.role === 'leader' ? [
    { icon: BarChart3, label: 'Dashboard', id: 'overview' },
    { icon: Users, label: 'Members', id: 'members' },
    { icon: DollarSign, label: 'Contributions', id: 'contributions' },
  ] : user?.role === 'member' ? [
    { icon: DollarSign, label: 'Contributions', id: 'contributions' },
  ] : [
    { icon: BarChart3, label: 'Dashboard', id: 'overview' },
    { icon: Users, label: 'Members', id: 'members' },
    { icon: DollarSign, label: 'Contributions', id: 'contributions' },
    { icon: GraduationCap, label: 'Training', id: 'training' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <div className="p-4">
              <h1 className="text-lg font-bold">Trade Union</h1>
              <p className="text-sm text-muted-foreground">
                {user?.role === 'admin' ? 'Admin Panel' : 
                 user?.role === 'leader' ? 'Syndicate Leader' : 'Member'}
              </p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={activeView === item.id}
                    className="w-full"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border">
            <div className="p-4 space-y-2">
              <div className="text-sm">
                <p className="font-medium">{user?.username}</p>
                <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <header className="bg-background border-b border-border px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            </div>
          </header>
          
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
