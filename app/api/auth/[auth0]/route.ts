import { handleAuth, HandlerError } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  onError: (req, res, error: HandlerError) => {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  },
});
