import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  // Website uptime check
  const websiteUrl = 'https://bockdev.com'; // Replace with the URL you want to check
  try {
    const response = await fetch(websiteUrl);
    if (response.ok) {
      return Response.json({ success: true, message: `${websiteUrl} is up.` });
    } else {
      return Response.json({ success: false, message: `${websiteUrl} is down.`, status: response.status });
    }
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return Response.json({ success: false, message: `Failed to check ${websiteUrl}.`, error: errorMessage });
  }
}