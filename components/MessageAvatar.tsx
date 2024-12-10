import { Avatar, AvatarFallback } from '@/components/ui/Avatar';

type MessageAvatarProps = {
  role: string;
};

export const MessageAvatar = ({ role }: MessageAvatarProps) => (
  <Avatar className="mr-2">
    <AvatarFallback>{role === 'assistant' ? 'Greg' : 'You'}</AvatarFallback>
  </Avatar>
);
