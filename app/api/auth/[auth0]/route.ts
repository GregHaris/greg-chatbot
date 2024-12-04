import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

const authHandler = handleAuth({
  login: handleLogin({
    authorizationParams: {
      prompt: 'login',
    },
    getLoginState: (req: NextRequest) => {
      const url = new URL(req.url);
      const remember = url.searchParams.get('remember') === 'true';
      return { remember };
    },
  }),
});

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ auth0: string }> },
) => {
  const { auth0 } = await params;
  const url = new URL(req.url);
  url.pathname = `/api/auth/${auth0}`;

  const newReq = new NextRequest(url, {
    headers: req.headers,
    method: req.method,
  });

  // Ensure authHandler is called with the awaited params
  return authHandler(newReq, { params: { auth0 } });
};

export const POST = GET;
