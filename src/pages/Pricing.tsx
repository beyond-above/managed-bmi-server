
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context';
import { paymentService } from '@/services/payment-service';
import type { Plan } from '@/services/payment-service';
import { toast } from '@/hooks/use-toast';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'For individuals just getting started',
      features: [
        'Basic BMI calculation',
        'Limited to 100 API requests per month',
        'Standard rate limiting',
        'Email support',
        'Single user'
      ],
      limitations: [
        'No data history',
        'No advanced analytics',
        'No priority support',
        'No custom branding'
      ],
      cta: isAuthenticated && profile?.plan === 'free' ? 'Current Plan' : 'Get Started',
      ctaVariant: isAuthenticated && profile?.plan === 'free' ? 'outline' : 'default',
      popular: false,
      planId: 'free' as Plan
    },
    {
      name: 'Premium',
      price: '12',
      description: 'For professionals with advanced needs',
      features: [
        'Advanced BMI calculation and tracking',
        'Unlimited API requests',
        'No rate limiting',
        'Priority support',
        'Multiple users',
        'Data history and insights',
        'Advanced analytics',
        'Custom branding options',
        'Two-factor authentication'
      ],
      limitations: [],
      cta: isAuthenticated && profile?.plan === 'premium' ? 'Current Plan' : 'Upgrade Now',
      ctaVariant: isAuthenticated && profile?.plan === 'premium' ? 'outline' : 'default',
      popular: true,
      planId: 'premium' as Plan
    }
  ];
  
  const handlePlanSelection = async (plan: Plan) => {
    // If not logged in, redirect to register
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    
    // If selecting current plan, do nothing
    if (profile?.plan === plan) {
      return;
    }
    
    setLoading(plan);
    
    try {
      const { url, error } = await paymentService.createCheckout(plan);
      
      if (error) throw new Error(error);
      
      if (plan === 'free') {
        // For free plan, show success message and reload page
        toast({
          title: "Plan Updated",
          description: "You have been downgraded to the free plan",
        });
        window.location.reload();
        return;
      }
      
      if (!url) {
        throw new Error("Failed to create checkout session");
      }
      
      // For Razorpay, we need to store the order data in history state
      // and navigate to the checkout page
      const orderData = url;
      navigate('/checkout?order_id=' + orderData.orderId, {
        state: { orderData }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 page-transition">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16 appear">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and start managing your BMI with advanced features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name}
                className={`glass p-8 border ${
                  plan.popular ? 'border-primary shadow-lg' : 'border-border shadow-subtle'
                } relative overflow-hidden appear-delay-${index + 1}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-medium">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-4xl font-semibold">${plan.price}</span>
                      <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-b py-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start text-muted-foreground">
                          <XCircle className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.ctaVariant as any}
                    onClick={() => handlePlanSelection(plan.planId)}
                    disabled={isAuthenticated && profile?.plan === plan.planId || loading !== null}
                  >
                    {loading === plan.planId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center space-y-4 appear">
            <h2 className="text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions? We've got answers.
            </p>
            
            <div className="max-w-3xl mx-auto mt-8 grid gap-6">
              <div className="bg-card rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium mb-2">How does the API rate limiting work?</h3>
                <p className="text-muted-foreground">
                  Free tier users are limited to 100 API requests per month. Premium users enjoy unlimited API requests with no rate limiting.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will take effect immediately, with prorated billing for upgrades.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium mb-2">Do you offer a free trial for premium features?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 14-day free trial of our Premium plan. No credit card required to try out all of our features.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
