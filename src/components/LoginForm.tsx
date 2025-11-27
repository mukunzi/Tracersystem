import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    // Clear credentials when switching tabs
    setCredentials({
      username: '',
      password: ''
    });
  };

  const handleLogin = async (role: 'admin' | 'leader' | 'member') => {
    if (!credentials.username || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(credentials.username, credentials.password, role);
      if (!success) {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Tracer System App</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="leader">Leader</TabsTrigger>
              <TabsTrigger value="member">Member</TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter admin username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter admin password"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('admin')}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in as Administrator'}
              </Button>
              {/* <p className="text-xs text-muted-foreground text-center">
                Default: admin / admin123
              </p> */}
            </TabsContent>

            <TabsContent value="leader" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="leader-username">Syndicate Username</Label>
                <Input
                  id="leader-username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter syndicate username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader-password">Password</Label>
                <Input
                  id="leader-password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter syndicate password"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('leader')}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in as Leader'}
              </Button>
            </TabsContent>

            <TabsContent value="member" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="member-username">Member Username</Label>
                <Input
                  id="member-username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter member username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-password">Password</Label>
                <Input
                  id="member-password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter member password"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('member')}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in as Member'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
