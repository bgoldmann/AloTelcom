/**
 * Test Supabase REST API Connection
 * 
 * Copy this entire file into your browser console (F12 → Console tab)
 * Replace YOUR_SUPABASE_URL and YOUR_ANON_KEY with your actual values
 */

// Replace these with your actual values
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// Test 1: Simple REST API call
console.log('Test 1: Testing Supabase REST API...');
console.log('URL:', SUPABASE_URL);

fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', [...response.headers.entries()]);
  
  if (!response.ok) {
    return response.text().then(text => {
      throw new Error(`HTTP ${response.status}: ${text}`);
    });
  }
  
  return response.json();
})
.then(data => {
  console.log('✅ SUCCESS! Data received:', data);
  console.log('Products found:', Array.isArray(data) ? data.length : 'Invalid response format');
})
.catch(error => {
  console.error('❌ ERROR:', error.message);
  
  if (error.message.includes('fetch')) {
    console.error('Network error - possible causes:');
    console.error('1. CORS issue - check Supabase project settings');
    console.error('2. Network/firewall blocking the request');
    console.error('3. Incorrect Supabase URL');
    console.error('4. Supabase project is paused (unlikely since SQL works)');
  } else if (error.message.includes('401') || error.message.includes('403')) {
    console.error('Authentication error - check your API key');
  } else if (error.message.includes('404')) {
    console.error('Not found - check if products table exists');
  } else {
    console.error('Unknown error:', error);
  }
});

// Test 2: Check if Supabase endpoint is reachable
console.log('\nTest 2: Testing basic connectivity...');
fetch(`${SUPABASE_URL}/rest/v1/`, {
  method: 'HEAD',
  headers: {
    'apikey': SUPABASE_ANON_KEY
  }
})
.then(response => {
  console.log('✅ Endpoint is reachable. Status:', response.status);
})
.catch(error => {
  console.error('❌ Endpoint not reachable:', error.message);
  console.error('This usually means:');
  console.error('1. Incorrect Supabase URL');
  console.error('2. Network/CORS blocking');
  console.error('3. Supabase project is paused');
});
