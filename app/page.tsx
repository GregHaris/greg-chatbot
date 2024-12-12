'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Chat from '@/components/Chat';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);
  if (error) return <div>{error.message}</div>;
  if (!user) return null;

  return <Chat />;
}
