'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Button } from '@/components/button';

const ProfileClient = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  if (isLoading) return <div>Load...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Greg&apos;s Chatbot
      </h1>
      <Button onClick={() => router.push('/api/auth/login')}>
        Log In / Sign Up
      </Button>
    </div>
  );
};

export default ProfileClient;
