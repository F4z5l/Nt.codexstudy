export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  try {
    const url = new URL(req.url).searchParams.get('url');
    const token = globalThis.process?.env?.VPLINK_TOKEN || globalThis.VPLINK_TOKEN;
    if (!url) return new Response(JSON.stringify({ status: 'error', message: 'URL required' }), { status: 400, headers });
    if (!token) return new Response(JSON.stringify({ status: 'error', message: 'Short-link service is not configured.' }), { status: 503, headers });
    const response = await fetch(`https://vplink.in/api?api=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}`);
    return new Response(await response.text(), { status: response.status, headers });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error?.message || 'Short-link service failed.' }), { status: 502, headers });
  }
}