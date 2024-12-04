'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function AuthPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0Id: user.sub,
          email: user.email,
          name: user.name,
        }),
      })
        .then(() => router.push('/'))
        .catch((error) => console.error('Failed to create user:', error));
    }
  }, [user, router]);

  const handleLogin = () => {
    // Force re-authentication by adding a 'prompt=login' parameter
    const loginUrl = `/api/auth/login?prompt=login${rememberMe ? '&remember=true' : ''}`;
    router.push(loginUrl);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Greg&apos;s Chatbot
      </h1>
      <Button className="mb-4" onClick={handleLogin}>
        Log In / Sign Up
      </Button>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </label>
      </div>
    </div>
  );
}
