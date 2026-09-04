const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  try {
    const requestUrl = new URL(request.url);
    const path = requestUrl.searchParams.get('path');
    if (!path || !path.startsWith('/') || path.startsWith('//')) return json({ success: false, message: 'A relative API path is required.' }, 400);

    const targetUrl = new URL(path, env.CODEX_API_ORIGIN || 'https://1api.notjitu.workers.dev');
    requestUrl.searchParams.forEach((value, key) => { if (key !== 'path') targetUrl.searchParams.append(key, value); });
    const headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' });
    const options = { method: request.method, headers };
    if (!['GET', 'HEAD'].includes(request.method) && request.body) options.body = await request.text();

    const upstream = await fetch(targetUrl, options);
    const body = await upstream.text();
    const responseHeaders = new Headers(upstream.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => responseHeaders.set(key, value));
    return new Response(body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
  } catch (error) {
    return json({ success: false, message: error?.message || 'Upstream request failed.' }, 502);
  }
}