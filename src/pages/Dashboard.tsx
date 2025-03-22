
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardContent from '@/components/dashboard/Dashboard';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 page-transition">
        <div className="container mx-auto">
          <DashboardContent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
