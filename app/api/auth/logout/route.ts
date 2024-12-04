import { NextResponse } from 'next/server';

export async function GET() {
  const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
  const clientID = process.env.AUTH0_CLIENT_ID;
  const baseURL = process.env.AUTH0_BASE_URL;

  if (!issuerBaseURL || !clientID || !baseURL) {
    throw new Error(
      'Missing required environment variables for Auth0 configuration',
    );
  }

  const logoutUrl = `${issuerBaseURL}/v2/logout?client_id=${clientID}&returnTo=${encodeURIComponent(baseURL)}`;

  return NextResponse.redirect(logoutUrl, { status: 302 });
}
