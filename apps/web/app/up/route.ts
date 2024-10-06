export const dynamic = 'force-static';

import { type NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  return new Response('OK');
}
