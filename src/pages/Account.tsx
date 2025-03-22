
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { User, Key, CreditCard, Bell, ShieldCheck } from 'lucide-react';

const Account = () => {
  const { profile, isAuthenticated, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 page-transition">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-0.5 mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Account Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full sm:w-auto border-b sm:border-0">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>Billing</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell size={16} />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key size={16} />
                <span>API</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="glass shadow-subtle">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={profile?.name || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile?.email || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="glass shadow-subtle">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Two-factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Protect your account with 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.plan === 'free' 
                            ? 'Available on premium plans' 
                            : 'Add an extra layer of security'}
                        </p>
                      </div>
                      <Switch disabled={profile?.plan === 'free'} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Update password'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card className="glass shadow-subtle">
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-secondary/50 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Plan</p>
                          <p className="text-sm text-muted-foreground">
                            {profile?.plan === 'free' ? 'Free Tier' : 'Premium Tier'}
                          </p>
                        </div>
                        {profile?.plan === 'free' ? (
                          <Button>Upgrade</Button>
                        ) : (
                          <Button variant="outline">Manage</Button>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Plan</span>
                          <span className="text-sm font-medium">
                            {profile?.plan === 'free' ? 'Free' : 'Premium'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">API Requests</span>
                          <span className="text-sm font-medium">
                            {profile?.plan === 'free' ? '100 / month' : 'Unlimited'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Rate Limiting</span>
                          <span className="text-sm font-medium">
                            {profile?.plan === 'free' ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Two-factor Authentication</span>
                          <span className="text-sm font-medium">
                            {profile?.plan === 'free' ? 'No' : 'Yes'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {profile?.plan !== 'free' && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <div className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-gray-200 rounded mr-3"></div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="glass shadow-subtle">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive email updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">API Usage Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified when approaching limits</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-muted-foreground">Be informed about security events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing</p>
                        <p className="text-sm text-muted-foreground">Receive marketing communications</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save preferences'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card className="glass shadow-subtle">
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys and access tokens.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-secondary/50 p-4">
                      <p className="font-medium">API Key</p>
                      <p className="text-sm text-muted-foreground">
                        Use this key to authenticate your API requests
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="flex space-x-2">
                        <Input
                          readOnly
                          value="sk_test_•••••••••••••••••••••••••••••••"
                          className="font-mono"
                        />
                        <Button variant="outline" size="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Last used: Never
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rate Limit</span>
                      <span className="text-sm font-medium">
                        {profile?.plan === 'free' ? '100 requests/month' : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Usage</span>
                      <span className="text-sm font-medium">
                        {profile?.apiRequests.used} requests
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reset Date</span>
                      <span className="text-sm font-medium">
                        1st of next month
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Regenerate Key</Button>
                  <Button>Create Secondary Key</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
