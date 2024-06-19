/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createClient } from '@supabase/supabase-js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    if (path === '/api/stories') {
      const page = parseInt(url.searchParams.get('page')) || 1;
      const pageSize = parseInt(url.searchParams.get('pageSize')) || 6;
      const startRange = (page - 1) * pageSize;
      const endRange = startRange + pageSize - 1;

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .range(startRange, endRange);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
}
