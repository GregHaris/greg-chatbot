import { auth } from '@/auth';

import { LoginButton } from '@/components/login-button';

export default async function LoginPage() {
  const session = await auth();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Greg&apos;s Chatbot</h1>
          <p className="mt-2 text-gray-600">Please sign in to continue</p>
        </div>
        <div className="mt-8 space-y-6">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
