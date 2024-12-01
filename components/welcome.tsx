const SAMPLE_QUESTIONS = [
  "What is Greg's Chatbot?",
  'What is the area of a  circle?',
  'Tell me about your capabilities',
  'What technologies do you use?',
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
      className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors"
      onClick={() => onClick(question)}
    >
      {question}
    </button>
  );
}

export function Welcome() {
  const handleSampleQuestionClick = (question: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.value = question;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-4">
      <div className="flex items-center justify-center space-x-2">
        <h1 className="text-4xl font-bold">Hi, I&apos;m Greg</h1>
      </div>
      <p className="text-xl text-muted-foreground">How can I help you today?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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
