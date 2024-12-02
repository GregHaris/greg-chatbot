import { auth } from '@/auth';

import Chat from '@/components/chat';

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    return null; // or some loading state
  }

  return <Chat />;
}
