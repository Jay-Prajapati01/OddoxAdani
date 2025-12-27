// Verification tools for localStorage-based authentication
// This file provides debugging utilities for the frontend auth system

/**
 * Verify localStorage-based auth setup
 */
export async function verifyAuthSetup() {
  console.log('🔍 Checking localStorage Auth Setup...\n');
  
  const results = {
    storage: false,
    users: false,
    errors: [] as string[],
  };

  try {
    // Check if localStorage is available
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    results.storage = true;
    console.log('✅ localStorage available');

    // Check for users
    const usersData = localStorage.getItem('gearguard_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      console.log(`✅ ${users.length} registered user(s) found`);
      results.users = true;
    } else {
      console.log('ℹ️  No registered users yet');
    }

    // Check current session
    const currentUser = localStorage.getItem('gearguard_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log('✅ Logged in as:', user.email);
    } else {
      console.log('ℹ️  Not logged in');
    }

  } catch (error: any) {
    results.errors.push(`❌ Storage error: ${error.message}`);
    console.error('❌ Storage error:', error.message);
  }

  // Summary
  console.log('\n📊 Setup Summary:');
  console.log('Storage:', results.storage ? '✅' : '❌');
  console.log('Users:', results.users ? '✅' : 'ℹ️  None yet');

  if (results.errors.length > 0) {
    console.log('\n⚠️ Issues Found:');
    results.errors.forEach(err => console.log(err));
  } else {
    console.log('\n✅ Everything is working correctly!');
  }

  return results;
}

// Make it available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).verifyAuthSetup = verifyAuthSetup;
  console.log('💡 Tip: Run verifyAuthSetup() in console to check setup');
}
