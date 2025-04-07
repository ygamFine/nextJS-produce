// 测试 API 连接
import { fetchMenuItems, fetchGlobalInfo, fetchSupportedLocales } from '../lib/api';

async function testApi() {
  try {
    console.log('Testing API connections...');
    
    console.log('Fetching supported locales...');
    const locales = await fetchSupportedLocales();
    console.log('Supported locales:', locales);
    
    console.log('Fetching global info...');
    const globalInfo = await fetchGlobalInfo('zh');
    console.log('Global info:', JSON.stringify(globalInfo, null, 2));
    
    console.log('Fetching menu items...');
    const menuItems = await fetchMenuItems('zh');
    console.log('Menu items:', JSON.stringify(menuItems, null, 2));
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 