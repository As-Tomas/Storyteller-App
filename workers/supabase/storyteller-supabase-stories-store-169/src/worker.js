/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

async function validateSecret(request, cache) {
	const secret = request.headers.get('x-secret-key');
	//   console.log("🚀 ~ validateSecret ~ secret:", secret);
	if (!secret) {
		return false;
	}

	const cachedSecret = await cache.get('x-secret-key');
	//   console.log("🚀 ~ validateSecret ~ cachedSecret:", cachedSecret);
	return cachedSecret === secret;
}

export default {
	async fetch(request, env) {
		const cache = env.STORY_CACHE; // Access the KV namespace
		const secretCache = env.SECRET_CACHE; // Access the KV namespace
		const url = new URL(request.url);
		const path = url.pathname;
		const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Validate secret
		const isValidSecret = await validateSecret(request, secretCache);
		if (!isValidSecret) {
			return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
		}

		// Only process POST and GET requests
		if (request.method !== 'POST' && request.method !== 'GET') {
			return new Response(JSON.stringify({ error: `${request.method} method not allowed.` }), { status: 405, headers: corsHeaders });
		}

		if (path === '/api/stories') {
			if (request.method === 'GET') {
				const page = parseInt(url.searchParams.get('page')) || 1;
				const pageSize = parseInt(url.searchParams.get('pageSize')) || 6;
				const startRange = (page - 1) * pageSize;
				const endRange = startRange + pageSize - 1;
				const cacheKey = `stories-${page}-${pageSize}`;

				// Check if data is in cache
				const cachedResponse = await cache.get(cacheKey);
				if (cachedResponse) {
					return new Response(cachedResponse, { headers: corsHeaders });
				}

				const { data, error } = await supabase.from('stories').select('*').range(startRange, endRange);

				if (error) {
					console.error('Supabase error:', error.message);
					return new Response(JSON.stringify({ error: error.message }), {
						status: 500,
						headers: corsHeaders,
					});
				}

				if (data.length === 0) {
					return new Response(JSON.stringify([]), {
					  headers: corsHeaders,
					});
				  }

				const responseJson = JSON.stringify(data);
				await cache.put(cacheKey, responseJson, { expirationTtl: 360 }); // Cache for 1 hour, 86400 for 1 day

				return new Response(responseJson, {
					headers: corsHeaders,
				});
			} else if (request.method === 'POST') {
				let body;
				try {
					body = await request.json();
				} catch (err) {
					console.error('Error parsing JSON:', err);
					return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
						status: 400,
						headers: corsHeaders,
					});
				}

				const { data, error } = await supabase.from('stories').insert([body]);

				if (error) {
					console.error('Supabase error:', error.message);
					return new Response(JSON.stringify({ error: error.message }), {
						status: 500,
						headers: corsHeaders,
					});
				}

				return new Response(JSON.stringify(data), {
					status: 201,
					headers: corsHeaders,
				});
			}
		}

		return new Response('Not Found', { status: 404 });
	},
};
