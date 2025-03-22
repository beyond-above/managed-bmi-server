
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-semibold tracking-tight text-primary"
        >
          BMI Manager
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary font-medium' : 'text-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === '/pricing' ? 'text-primary font-medium' : 'text-foreground/80'
            }`}
          >
            Pricing
          </Link>
          
          {!isAuthenticated ? (
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="w-full cursor-pointer">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center p-2 rounded-md text-foreground/80 hover:text-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-dark border-t mt-2 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`py-2 text-sm transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary font-medium' : 'text-foreground/80'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`py-2 text-sm transition-colors hover:text-primary ${
                location.pathname === '/pricing' ? 'text-primary font-medium' : 'text-foreground/80'
              }`}
            >
              Pricing
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`py-2 text-sm transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                Dashboard
              </Link>
            )}
            
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            ) : (
              <div className="border-t pt-4 mt-2 flex flex-col space-y-2">
                <div className="flex items-center space-x-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link 
                  to="/account" 
                  className="py-2 text-sm transition-colors hover:text-primary"
                >
                  Account Settings
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout} 
                  className="justify-start px-0 hover:bg-transparent text-destructive hover:text-destructive"
                >
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
