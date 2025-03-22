
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import BmiCalculator from '@/components/calculator/BmiCalculator';
import { ArrowRight, CheckCircle, Lock, BarChart2, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-20 pt-12 md:pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <div className="md:w-1/2 space-y-6 appear">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                <span className="bg-primary rounded-full w-2 h-2 mr-1"></span>
                Just launched
              </div>
              
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Powerful BMI <br />
                <span className="text-primary">Tracking Solution</span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Advanced BMI monitoring with authentication, rate limiting, and payment processing.
                The elegant all-in-one solution for your application needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" onClick={() => navigate('/register')} className="gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Log in
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-3">
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-1 text-green-500" />
                  No credit card
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-1 text-green-500" />
                  Free plan available
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 appear-delay-1">
              <div className="p-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-3xl opacity-30"></div>
                <BmiCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 appear">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
              Complete Managed Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide all the tools you need to manage user authentication, payments, and API usage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-2xl shadow-subtle appear-delay-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Authentication</h3>
              <p className="text-muted-foreground">
                Secure user authentication and account management with easy integration.
              </p>
            </div>
            
            <div className="glass p-6 rounded-2xl shadow-subtle appear-delay-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Rate Limiting</h3>
              <p className="text-muted-foreground">
                Advanced API rate limiting to control usage and prevent abuse of your services.
              </p>
            </div>
            
            <div className="glass p-6 rounded-2xl shadow-subtle appear-delay-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Payment Processing</h3>
              <p className="text-muted-foreground">
                Seamlessly handle subscription payments and manage premium features.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="glass p-8 md:p-12 rounded-2xl shadow-glass text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of developers who trust our platform for their application needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="gap-2">
                Create Free Account <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
