/**
 * Test Supabase REST API from Browser Console
 * 
 * This script can be pasted into the browser console to test Supabase connection.
 * First, get your values from the Network tab:
 * 1. Open DevTools (F12) → Network tab
 * 2. Filter by "products" or "supabase"
 * 3. Find a request to supabase.co
 * 4. Click on it → Headers tab
 * 5. Look for the Request URL and Authorization header
 * 
 * OR run this first to expose the values:
 */

// Method 1: Get values from window (if exposed)
// If the app exposes these, you might find them in window.__ENV__ or similar
console.log('Looking for Supabase URL in window object...');
for (let key in window) {
  if (key.includes('SUPABASE') || key.includes('supabase')) {
    console.log(key, window[key]);
  }
}

// Method 2: Get values from Network tab
// 1. Open DevTools (F12) → Network tab
// 2. Refresh the page
// 3. Find the request to "supabase.co" (might be under "products" or similar)
// 4. Click on it
// 5. Check the Request URL and Headers
// 6. Copy the URL and the apikey/Authorization header values

// Method 3: Manual test (replace YOUR_URL and YOUR_KEY)
const testManual = (url, key) => {
  console.log('Testing Supabase REST API...');
  console.log('URL:', url);
  
  fetch(`${url}/rest/v1/products?select=id&limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    return response.text().then(text => {
      try {
        return JSON.parse(text);
      } catch {
        console.warn('Response is not JSON:', text.substring(0, 200));
        return { error: 'Response is not JSON', text: text.substring(0, 200) };
      }
    });
  })
  .then(data => {
    console.log('✅ SUCCESS! Data received:', data);
    if (Array.isArray(data)) {
      console.log(`✅ Products found: ${data.length}`);
    }
  })
  .catch(error => {
    console.error('❌ ERROR:', error);
  });
};

// To use: testManual('https://your-project.supabase.co', 'your-anon-key');
