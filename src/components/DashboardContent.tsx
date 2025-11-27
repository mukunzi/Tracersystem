
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, GraduationCap, Settings, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();

  const getFilteredData = () => {
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const contributions = JSON.parse(localStorage.getItem('contributions') || '[]');
    const trainings = JSON.parse(localStorage.getItem('trainings') || '[]');
    const syndicates = JSON.parse(localStorage.getItem('syndicates') || '[]');

    let filteredMembers = members;
    let filteredContributions = contributions;
    let filteredTrainings = trainings;

    if (user?.role === 'leader' && user.syndicateId) {
      filteredMembers = members.filter((m: any) => m.syndicateId === user.syndicateId);
      const memberIds = filteredMembers.map((m: any) => m.id);
      filteredContributions = contributions.filter((c: any) => memberIds.includes(c.memberId));
      filteredTrainings = trainings.filter((t: any) => !t.syndicateId || t.syndicateId === user.syndicateId);
    }

    return { filteredMembers, filteredContributions, filteredTrainings, syndicates };
  };

  const { filteredMembers, filteredContributions, filteredTrainings, syndicates } = getFilteredData();

  // Calculate statistics
  const stats = {
    totalMembers: filteredMembers.length,
    totalContributions: filteredContributions.reduce((sum: number, c: any) => sum + c.amount, 0),
    totalTrainings: filteredTrainings.length,
    totalSyndicates: user?.role === 'admin' ? syndicates.length : 1,
    avgContribution: filteredContributions.length > 0 ? 
      filteredContributions.reduce((sum: number, c: any) => sum + c.amount, 0) / filteredContributions.length : 0
  };

  // Monthly contributions data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    const monthContributions = filteredContributions.filter((c: any) => {
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      return c.period === monthNames[i];
    });
    return {
      month,
      amount: monthContributions.reduce((sum: number, c: any) => sum + c.amount, 0),
      count: monthContributions.length
    };
  });

  // Education level distribution
  const educationData = [
    { name: 'None', value: filteredMembers.filter((m: any) => m.educationLevel === 'none').length },
    { name: 'Primary', value: filteredMembers.filter((m: any) => m.educationLevel === 'primary').length },
    { name: 'Secondary', value: filteredMembers.filter((m: any) => m.educationLevel === 'secondary').length },
    { name: 'TVET', value: filteredMembers.filter((m: any) => m.educationLevel === 'tvet').length },
    { name: 'University', value: filteredMembers.filter((m: any) => m.educationLevel === 'university').length },
  ].filter(item => item.value > 0);

  // Payment method distribution
  const paymentMethodData = [
    { name: 'Cash', value: filteredContributions.filter((c: any) => c.paymentMethod === 'cash').length },
    { name: 'Bank', value: filteredContributions.filter((c: any) => c.paymentMethod === 'bank').length },
    { name: 'MobiBank', value: filteredContributions.filter((c: any) => c.paymentMethod === 'mobibank').length },
    { name: 'MoMo', value: filteredContributions.filter((c: any) => c.paymentMethod === 'momo').length },
  ].filter(item => item.value > 0);

  // Syndicate performance (for admin only)
  const syndicatePerformance = user?.role === 'admin' ? syndicates.map((syndicate: any) => {
    const syndicateMembers = filteredMembers.filter((m: any) => m.syndicateId === syndicate.id);
    const syndicateMemberIds = syndicateMembers.map((m: any) => m.id);
    const syndicateContributions = filteredContributions.filter((c: any) => syndicateMemberIds.includes(c.memberId));
    
    return {
      name: syndicate.name,
      members: syndicateMembers.length,
      contributions: syndicateContributions.reduce((sum: number, c: any) => sum + c.amount, 0),
      avgContribution: syndicateMembers.length > 0 ? 
        syndicateContributions.reduce((sum: number, c: any) => sum + c.amount, 0) / syndicateMembers.length : 0
    };
  }) : [];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-2))",
    },
  };

  // const educationData = [
  //   { name: 'None', value: 5 },
  //   { name: 'Primary', value: 10 },
  //   { name: 'Secondary', value: 15 },
  //   { name: 'TVET', value: 8 },
  //   { name: 'University', value: 12 },
  // ];

  // const paymentMethodData = [
  //   { name: 'Cash', value: 59 },
  //   { name: 'Bank', value: 9 },
  //   { name: 'MobiBank', value: 71 },
  //   { name: 'MoMo', value: 17 },
  // ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Dashboard Overview</h3>
        <p className="text-sm text-muted-foreground">
          Comprehensive view of trade union metrics and performance
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {user?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Syndicates</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSyndicates}</div>
              <p className="text-xs text-muted-foreground">Active syndicates</p>
            </CardContent>
          </Card>
        )}
        
        {user?.role !== 'member' && (
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <p className="h-4 w-4 text-muted-foreground">RWF</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {stats.totalContributions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: RWF {stats.avgContribution.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrainings}</div>
            <p className="text-xs text-muted-foreground">Available programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Contributions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Contributions</CardTitle>
            <CardDescription>Contribution trends throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--chart-1))" 
                    fill="hsl(var(--chart-1))" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Education Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Education Level Distribution</CardTitle>
            <CardDescription>Member education backgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={educationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Preferred contribution payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Syndicate Performance (Admin Only) */}
        {user?.role === 'admin' && syndicatePerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Syndicate Performance</CardTitle>
              <CardDescription>Member count and contribution performance by syndicate</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={syndicatePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="members" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="contributions" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContributions.slice(-5).reverse().map((contribution: any, index: number) => {
              const member = filteredMembers.find((m: any) => m.id === contribution.memberId);
              return (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Contribution recorded: RWF {contribution.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member?.name} • {contribution.period} {contribution.year} • {contribution.paymentMethod}
                    </p>
                  </div>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              );
            })}
            {filteredContributions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
