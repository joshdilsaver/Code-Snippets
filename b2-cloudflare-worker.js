const baseUrl = "https://<fXXX>.backblazeb2.com/file/<bucket-name>"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

/**
 * Return appropriate content type based on file name
 * @param {string} name
 */
function nameToType(name) {
  const arr = name.split('.');
  const extension = arr[arr.length - 1].toLowerCase(); // Convert to lowercase for consistency
  const map = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    woff2: 'binary/octet-stream',
    pdf: 'application/pdf'
  };
  return map[extension] || 'binary/octet-stream';
}

/**
 * Serve content from B2
 * @param {Request} event.request
 */
async function handleRequest(event) {
  // Only allow GET requests
  if (event.request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Return a cached response if we have one
  const cache = caches.default
  let cachedResponse = await cache.match(event.request)
  if (cachedResponse) {
    return cachedResponse
  }

// Processing URL and path
const url = new URL(event.request.url);
let pathname = url.pathname;

// Define an array of extensions that don't need '/index.html' appended
const noAppendExtensions = ['.jpg', '.png', '.pdf', '.ppt'];

// Check and modify the pathname accordingly
if (pathname === '' || pathname === '/' || pathname.endsWith('/')) {
  pathname += 'index.html';
} else {
  // Check if the pathname ends with one of the extensions we're interested in
  const shouldAppend = !noAppendExtensions.some(ext => pathname.endsWith(ext));
  
  if (shouldAppend) {
    pathname += '/index.html';
  }
}

  // Define headers
  const headers = {
    'cache-control': 'public, max-age=14400',
    'content-type': nameToType(pathname)
  };
  
  // If the file is a PDF, also set Content-Disposition to inline
  if (pathname.endsWith('.pdf')) {
    headers['content-type'] = 'application/pdf';
    headers['Content-Disposition'] = `inline; filename="${pathname.split('/').pop()}"`;
  }

  // Fetching content from B2
  const b2Response = await fetch(`${baseUrl}${pathname}`)
  const response = new Response(b2Response.body, { ...b2Response, headers })

  // Return a minimal error page for error codes
  if (response.status > 399) {
    return new Response(response.statusText, { status: response.status })
  }

  // Cache and return the response
  event.waitUntil(cache.put(event.request, response.clone()))
  return response
}
