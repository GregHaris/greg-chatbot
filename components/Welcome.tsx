import { useUser } from '@auth0/nextjs-auth0/client';

const SAMPLE_QUESTIONS = [
  'What is a Chatbot?',
  'What is the area of a circle?',
  'Create a a website for me',
  'Teach me Python',
];

interface SampleQuestionButtonProps {
  question: string;
  onClick: (question: string) => void;
}

function SampleQuestionButton({
  question,
  onClick,
}: SampleQuestionButtonProps) {
  return (
    <button
      className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors w-full"
      onClick={() => onClick(question)}
    >
      {question}
    </button>
  );
}

export function Welcome() {
  const { user } = useUser();

  // Function to extract the part of the name before the '@' symbol
  const getDisplayName = (name: string | null | undefined) => {
    if (!name) return '';
    const atIndex = name.indexOf('@');
    return atIndex !== -1 ? name.substring(0, atIndex) : name;
  };

  const handleSampleQuestionClick = (question: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.value = question;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-4">
      <div className="flex flex-col items-center justify-center space-y-2 mt-8 sm:mt-0">
        <h1 className="text-4xl font-bold text-center break-words">
          Hi {getDisplayName(user?.name)}, I&apos;m Greg
        </h1>
        <p className="text-xl text-muted-foreground text-center p-4">
          How can I help you today?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full max-w-2xl">
        {SAMPLE_QUESTIONS.map((question) => (
          <SampleQuestionButton
            key={question}
            question={question}
            onClick={handleSampleQuestionClick}
          />
        ))}
      </div>
    </div>
  );
}
