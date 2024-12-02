'use client';

import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn('github', { callbackUrl: '/chat' })}
      className="w-full"
    >
      Sign in with GitHub
    </Button>
  );
}
