
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import BmiCalculator from '@/components/calculator/BmiCalculator';
import { BarChart, History, Users } from 'lucide-react';

interface BmiHistoryData {
  date: string;
  bmi: number;
}

// Mock data for the BMI history
const mockBmiData: BmiHistoryData[] = [
  { date: 'Jan 1', bmi: 24.5 },
  { date: 'Feb 1', bmi: 24.2 },
  { date: 'Mar 1', bmi: 23.8 },
  { date: 'Apr 1', bmi: 23.4 },
  { date: 'May 1', bmi: 22.9 },
  { date: 'Jun 1', bmi: 22.6 },
  { date: 'Jul 1', bmi: 22.3 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate the percentage of API requests used
  const apiRequestsPercentage = user ? Math.floor((user.apiRequests.used / user.apiRequests.limit) * 100) : 0;
  
  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto page-transition">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your BMI tracking and view your statistics.
        </p>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart size={16} />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={16} />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass shadow-subtle">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent BMI</CardTitle>
                <CardDescription>
                  Your latest BMI measurement and trend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-semibold">22.3</p>
                    <p className="text-sm text-green-500 font-medium">Normal weight</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="text-sm text-green-500">-2.2 from Jan</p>
                  </div>
                </div>
                
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockBmiData}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                        tickLine={false}
                        axisLine={false}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bmi" 
                        stroke="#3498db" 
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 2 }}
                        activeDot={{ r: 5, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-subtle">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">API Usage</CardTitle>
                <CardDescription>
                  Your current rate limit and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {user?.apiRequests.used} / {user?.apiRequests.limit} requests
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user?.plan === 'free' ? 'Free Plan' : 'Premium Plan'}
                    </span>
                  </div>
                  <Progress value={apiRequestsPercentage} className="h-2" />
                </div>
                
                {user?.plan === 'free' && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm mb-2">
                      Upgrade to Premium for unlimited API requests and advanced features.
                    </p>
                    <Button size="sm" className="w-full">Upgrade Plan</Button>
                  </div>
                )}
                
                <div className="border rounded-lg divide-y">
                  <div className="p-3 flex justify-between">
                    <span className="text-sm">Rate Limiting</span>
                    <span className="text-sm font-medium">
                      {user?.plan === 'free' ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-sm">Reset Period</span>
                    <span className="text-sm font-medium">Monthly</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-sm">Next Reset</span>
                    <span className="text-sm font-medium">14 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card className="glass shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg font-medium">BMI History</CardTitle>
              <CardDescription>
                Track your BMI measurements over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockBmiData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis 
                      domain={['dataMin - 1', 'dataMax + 1']} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bmi" 
                      stroke="#3498db" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-secondary/50 p-3">
                  <div className="col-span-4 font-medium text-sm">Date</div>
                  <div className="col-span-4 font-medium text-sm">BMI</div>
                  <div className="col-span-4 font-medium text-sm">Category</div>
                </div>
                <div className="divide-y">
                  {mockBmiData.map((entry, index) => (
                    <div key={index} className="grid grid-cols-12 p-3">
                      <div className="col-span-4 text-sm">{entry.date}</div>
                      <div className="col-span-4 text-sm">{entry.bmi}</div>
                      <div className="col-span-4 text-sm text-green-500">Normal</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculator" className="flex justify-center">
          <BmiCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
