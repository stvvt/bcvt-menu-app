import { readFile } from 'fs/promises';

/**
 * Fetch JSON from a URL or a local file.
 * 
 * @param url - The URL to fetch from.
 * @param init - The fetch init object.
 * @returns The parsed JSON response.
 */
async function fetchJson(...args: Parameters<typeof fetch>) {
  const [url, init] = args;
  const parsed = new URL(url.toString());

  if (parsed.protocol === 'file:') {
    const path = parsed.pathname;
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  }

  const fetchInit = {
    ...init,
    headers: {
      ...init?.headers,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, fetchInit);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default fetchJson;
