# Greg's Chatbot

Greg's Chatbot is an AI-powered chatbot built with React, TypeScript, Node.js, TailwindCSS, Next.js, etc to provide seamless and intelligent conversational experiences.

## Features

- **AI-Powered Conversations**: Utilizes Llama 3 AI model via Groq's AI for natural and intelligent interactions.
- **Authentication**: Integrated with Auth0 for secure user authentication.
- **Database Management**: Uses Prisma as the ORM for efficient database interactions with Postgresql.
- **Responsive Design**: Built with TailwindCSS and radix ui for a responsive and modern UI.
- **Syntax Highlighting**: Supports code snippets with syntax highlighting using `react-syntax-highlighter`.
- **Analytics**: Integrated with Vercel Analytics and Speed Insights for performance monitoring.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 23.x or later.
- **pnpm**: Version 9.x or later.
- **PostgreSQL**: Ensure you have a PostgreSQL database running.

## Installation

To install Greg's Chatbot, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/gregs-chatbot.git
   ```

2. Navigate to the project directory:

   ```bash
   cd gregs-chatbot
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up your environment variables by creating a .env and .env.local file in the project root directory. Then go to [auth0.com](https://autho.com) to create an account and generate your Auth0 credentials.

5. Install and set up your Postgresql data base.

6. Follow this [Vercel guide](https://vercel.com/guides/nextjs-prisma-postgres) to set up the Prisma ORM and connect it with your Postgres data base

## Usage

1. To start the development server, run:

   ```bash
   pnpm run dev
   ```

2. To build the project for production, run:

   ```bash
   pnpm run build
   ```

3. To start the production server, run:

   ```bash
   pnpm start
   ```

## Scripts

- `dev`: Starts the development server with Turbopack.
- `build`: Builds the project for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.
- `prepare`: Sets up Husky for Git hooks.
- `lint-staged`: Runs linting on staged files.
- `postinstall`: Generates Prisma client after installation.

## Dependencies

- `@ai-sdk/openai: ^1.0.7`
- `@ai-sdk/ui-utils: ^1.0.4`
- `@auth0/nextjs-auth0: ^3.5.0`
- `@prisma/client: ^6.0.1`
- `next: ^15.0.4`
- `react: ^19.0.0`
- `react-dom: ^19.0.0`
- `tailwindcss: ^3.4.16`
- `prisma: ^6.0.1`
- `eslint: ^9.16.0`
- `prettier: ^3.4.2`

## Contributing

If you're interested in contributing to Greg's Chatbot, please feel free to open a pull request on GitHub.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Acknowledgements

- Thanks to Groq AI team for providing the free tier AI API usage
- Thanks to Vercel for the free tier hosting of the site and the great documentation to make the process easy.
- Thanks to the Next.js and Prisma communities for their excellent documentation and support.

## Live Demo

You can check out the live demo of Greg's Chatbot deployed on Vercel:

👉 **[Live Demo](https://gregchatbot.vercel.app)**

Feel free to visit the link, authenticate using your credentials, and start interacting with the chatbot!

## Contact

Feel free to contact me at <d.gregharis@gmail.com> if you have any questions or needs.
