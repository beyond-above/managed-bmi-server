
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context';
import { toast } from '@/hooks/use-toast';
import { Script } from '@/components/ui/script';

// Add Razorpay typings
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { isAuthenticated, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect if no order ID
    if (!orderId) {
      navigate('/pricing');
      return;
    }

    // Fetch order data from URL params or stored state
    const data = window.history.state?.orderData;
    
    if (data) {
      setOrderData(data);
      setLoading(false);
    } else {
      navigate('/pricing');
    }
  }, [isAuthenticated, navigate, orderId]);

  const handlePayment = () => {
    if (!orderData || !window.Razorpay) {
      toast({
        title: "Error",
        description: "Payment system is not ready yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "BMI Calculator",
      description: "Premium Subscription",
      order_id: orderData.orderId,
      prefill: {
        name: orderData.prefill.name,
        email: orderData.prefill.email
      },
      handler: function(response: any) {
        // Payment successful
        toast({
          title: "Payment Successful",
          description: "Your premium subscription has been activated",
        });
        navigate('/payment-success');
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "You can try again anytime",
          });
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading payment information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <main className="flex-1 py-24 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="p-8 shadow-lg">
            <h1 className="text-2xl font-semibold mb-6">Complete Your Payment</h1>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <p className="text-lg font-medium">Premium Subscription</p>
                <p className="text-muted-foreground">Monthly billing</p>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Subscription fee:</span>
                <span className="text-xl font-semibold">₹{(orderData.amount / 100).toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePayment}
              >
                Pay ₹{(orderData.amount / 100).toFixed(2)}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                By clicking the button above, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
