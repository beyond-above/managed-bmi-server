
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4 page-transition">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to home
          </Link>
          
          <AuthForm type="register" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
