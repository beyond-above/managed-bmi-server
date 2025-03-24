import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { LoaderCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { login, register, signInWithGoogle, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);
    
    try {
      if (type === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register(name, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading(true);
      await signInWithGoogle();
      // No navigation needed as it will redirect to Google
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred with Google sign in');
      setSocialLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md glass shadow-subtle animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-medium">
          {type === 'login' ? 'Sign in to your account' : 'Create your account'}
        </CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Enter your email to sign in to your account' 
            : 'Enter your information to create an account'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {type === 'login' && (
                <a 
                  href="#" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder={type === 'login' ? '••••••••' : 'Create a password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={formLoading || socialLoading}
          >
            {socialLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={formLoading || socialLoading}
          >
            {formLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : type === 'login' ? 'Sign in' : 'Create account'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            {type === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => navigate(type === 'login' ? '/register' : '/login')}
            >
              {type === 'login' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
