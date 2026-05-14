const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CACHE_MAX_AGE = 30;

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');

  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Missing endpoint parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Remove endpoint from params, forward the rest to CoinGecko
  url.searchParams.delete('endpoint');
  const target = `${COINGECKO_API}/${endpoint}?${url.searchParams.toString()}`;

  try {
    const response = await fetch(target);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream error: ${response.status}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=60`,
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to reach CoinGecko' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
