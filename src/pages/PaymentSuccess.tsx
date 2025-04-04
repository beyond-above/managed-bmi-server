
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context';

const PaymentSuccess = () => {
  const { refreshProfile } = useAuth();
  
  useEffect(() => {
    // Refresh user profile to get updated subscription status
    refreshProfile();
  }, [refreshProfile]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 page-transition">
        <div className="container mx-auto max-w-md text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-semibold">Payment Successful!</h1>
            
            <p className="text-muted-foreground">
              Thank you for upgrading to Premium! Your account has been upgraded and you now have access to all premium features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/account">View Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
