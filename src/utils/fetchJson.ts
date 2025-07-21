import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Fetch JSON from a URL or a local file.
 * 
 * @param url - The URL to fetch from.
 * @param init - The fetch init object.
 * @returns The parsed JSON response.
 */
async function fetchJson<T>(...args: Parameters<typeof fetch>): Promise<T> {
  const [url, init] = args;
  const parsed = new URL(url.toString());

  if (parsed.protocol === 'file:') {
    const resolvedPath = path.resolve(process.cwd(), path.join(parsed.hostname, parsed.pathname));
    const content = await readFile(resolvedPath, 'utf-8');
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

  return response.json() as Promise<T>;
}

export default fetchJson;
