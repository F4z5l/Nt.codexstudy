export const config = { runtime: 'edge' };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  try {
    const requestUrl = new URL(req.url);
    const path = requestUrl.searchParams.get('path');
    if (!path || !path.startsWith('/') || path.startsWith('//')) return json({ success: false, message: 'A relative API path is required.' }, 400);

    const origin = globalThis.CODEX_API_ORIGIN || globalThis.process?.env?.CODEX_API_ORIGIN || 'https://1api.notjitu.workers.dev';
    const targetUrl = new URL(path, origin);
    requestUrl.searchParams.forEach((value, key) => { if (key !== 'path') targetUrl.searchParams.append(key, value); });

    const headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' });
    const options = { method: req.method, headers };
    if (!['GET', 'HEAD'].includes(req.method) && req.body) options.body = await req.text();

    const upstream = await fetch(targetUrl, options);
    const body = await upstream.text();
    const responseHeaders = new Headers(upstream.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => responseHeaders.set(key, value));
    return new Response(body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
  } catch (error) {
    return json({ success: false, message: error?.message || 'Upstream request failed.' }, 502);
  }
}