import type { HomePageData, Product, GlobalInfo, MenuItem } from './types';

// Strapi API 基础 URL
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL
const STRAPI_URL_IMG = process.env.NEXT_PUBLIC_STRAPI_API_PROXY

// 缓存目录
const CACHE_DIR = process.cwd() + '/.next/cache/data';

// 内存缓存
const memoryCache: Record<string, { data: any, timestamp: number }> = {};

// 缓存有效期（1小时）
const CACHE_TTL = 60 * 60 * 1000;

// 确保缓存目录存在 - 仅在服务器端执行
if (typeof window === 'undefined') {
  // 动态导入
  import('fs').then(fs => {
    import('path').then(path => {
      const fullCachePath = path.join(process.cwd(), '.next/cache/data');
      if (!fs.existsSync(fullCachePath)) {
        fs.mkdirSync(fullCachePath, { recursive: true });
      }
    });
  }).catch(err => {
    console.error('Error importing fs/path modules:', err);
  });
}

// 获取 API Token
const getApiOptions = () => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  
  if (!token) {
    console.warn("Strapi API Token is not set.");
    return {
      next: { 
        revalidate: 60,
        tags: [] // 添加空的 tags 数组作为默认值
      }
    };
  }
  
  return {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next: { 
      revalidate: 60,
      tags: [] // 添加空的 tags 数组作为默认值
    }
  };
};

// 通用的数据获取函数，支持 SSG 和 ISR
async function fetchWithCache(url: string, options: any, cacheKey: string) {
  console.log('cacheKey url：', url)
  // 在客户端，直接获取数据，不使用缓存
  if (typeof window !== 'undefined') {
    try {
      // 使用类型断言确保 TypeScript 不会报错
      if(options && options.next && typeof options.next === 'object') {
        (options.next as any).tags = [cacheKey];
      }
      const response = await fetch(url, options);
      console.log('客户端：接口请求返回的数据', response)
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  }
  
  // 以下代码只在服务器端执行
  
  // // 1. 检查内存缓存
  // const now = Date.now();
  // if (memoryCache[cacheKey] && (now - memoryCache[cacheKey].timestamp) < CACHE_TTL) {
  //   console.log('缓存：接口请求返回的数据', memoryCache[cacheKey].data)
  //   return memoryCache[cacheKey].data;
  // }
  
  // // 2. 检查文件缓存 - 仅在服务器端执行
  // try {
  //   // 动态导入 fs 和 path
  //   const fs = await import('fs');
  //   const path = await import('path');
  //   const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
    
  //   if (fs.existsSync(cacheFile)) {
  //     const stats = fs.statSync(cacheFile);
  //     // 如果缓存文件不超过缓存有效期，使用缓存
  //     if ((now - stats.mtimeMs) < CACHE_TTL) {
  //       const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  //       // 更新内存缓存
  //       memoryCache[cacheKey] = { data: cachedData, timestamp: now };
  //       return cachedData;
  //     }
  //   }
  // } catch (error) {
  //   console.error(`Error with file cache:`, error);
  // }
  
  // 3. 从 API 获取数据
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    
    const data = await response.json();
    console.log('客户端3：接口请求返回的数据', data)
    
    // // 4. 更新缓存
    // memoryCache[cacheKey] = { data, timestamp: now };
    
    // 写入文件缓存 - 仅在服务器端执行
    try {
      const fs = await import('fs');
      const path = await import('path');
      const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
      fs.writeFileSync(cacheFile, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing cache file:`, error);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
}

// 获取产品列表
export async function fetchProducts(locale = 'zh') {
  try {
    const options = getApiOptions();
    // 使用类型断言确保 TypeScript 不会报错
    if(options && options.next && typeof options.next === 'object') {
      (options.next as any).tags = ['prod'];
    }
    
    console.log('Product URL: ', `${STRAPI_URL}/products?populate=*&sort=createdAt:desc&locale=${locale}`);
    console.log('Product Options: ', options);
    const response = await fetch(`${STRAPI_URL}/products?populate=*&sort=createdAt:desc&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    // 转换 Strapi 响应格式为应用所需格式
    return data.data?.map((item: any) => ({
      id: item.documentId,
      name: item.name,
      description: item.decs,
      price: item.price || 0,
      image: item.image?.url 
        ? `${STRAPI_URL_IMG}${item.image?.url}`
        : '/placeholder.jpg',
      category: item.category,
    })) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// 获取单个产品详情
export async function fetchProductById(id: string, locale = 'zh') {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/products/${id}?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product with id ${id}`);
    }
    
    const data = await response.json();
    
    const item = data.data;
    return {
      id: item.id,
      name: item.name,
      description: item.decs,
      price: item.price,
      image: item.image?.url 
        ? `${STRAPI_URL_IMG}${item.image?.url}`
        : '/placeholder.jpg',
      category: item.category
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// 提交联系表单
export async function submitContactForm(formData: ContactFormData) {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/inquiries`, {
      method: 'POST',
      ...options,
      body: JSON.stringify({ data: formData }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit contact form');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

// 获取全局信息，支持 SSG 和 ISR
export async function fetchGlobalInfo(locale = 'zh'): Promise<GlobalInfo> {
  try {
    const options = getApiOptions();
    const cacheKey = `global-info-${locale}`;
    
    const data = await fetchWithCache(
      `${STRAPI_URL}/global?populate=*&locale=${locale}`, 
      options, 
      cacheKey
    );
    
    const globalData = data.data;
    
    return {
      siteName: globalData?.siteName || '企业网站',
      logo: globalData?.favicon?.url 
        ? `${STRAPI_URL_IMG}${globalData?.favicon?.url}`
        : '/logo.png',
      translations: globalData?.translations || {},
      locale,
      footer: {
        copyright: globalData?.footer?.copyright || '',
        links: globalData?.footer?.links?.map((link: any) => ({
          id: link.id,
          name: link.name,
          href: link.href
        })) || [],
        socialMedia: globalData?.footer?.socialMedia?.map((item: any) => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          href: item.href
        })) || []
      },
      contactInfo: globalData?.contactInfo || {
        address: '',
        phone: '',
        email: ''
      }
    };
  } catch (error) {
    console.error('Error fetching global info:', error);
    return {
      siteName: '企业网站',
      logo: '/logo.png',
      translations: {},
      locale,
      footer: {
        copyright: '',
        links: [],
        socialMedia: []
      },
      contactInfo: {
        address: '',
        phone: '',
        email: ''
      }
    };
  }
}

// 获取菜单项，支持 SSG 和 ISR
export async function fetchMenuItems(locale = 'zh'): Promise<MenuItem[]> {
  try {
    const options = getApiOptions();
    const cacheKey = `menus-${locale}`;
    
    const data = await fetchWithCache(
      `${STRAPI_URL}/menus?locale=${locale}`, 
      options, 
      cacheKey
    );
    // 确保数据结构正确
    if (!data || !data.data) {
      console.warn(`No menu data found for locale ${locale}`);
      return getDefaultMenuItems(locale);
    }
    
    // 检查数据结构并适当处理
    return data.data.map((item: any) => {

      if (item) {
        return {
          id: item.id,
          name: item.label || item.title || '',
          href: item.path || item.href || '/',
          target: item.target || '_self',
          order: item.order || 0
        };
      } else {
        // 直接使用顶级属性
        return {
          id: item.id || Math.random(),
          name: item.name || item.title || '',
          href: item.url || item.href || '/',
          target: item.target || '_self',
          order: item.order || 0
        };
      }
    });
    
    // 按照 order 字段排序
    // return menuItems.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return getDefaultMenuItems(locale);
  }
}

// 获取翻译数据
export async function fetchTranslations(locale = 'zh') {
  try {
    const options = getApiOptions();
    const cacheKey = `translations-${locale}`;
    
    const data = await fetchWithCache(
      `${STRAPI_URL}/i18n/translations?locale=${locale}`, 
      options, 
      cacheKey
    );
    
    // 转换为键值对格式
    const translations: Record<string, string> = {};
    data.data?.forEach((item: any) => {
      if (item.attributes) {
        translations[item.attributes.key] = item.attributes.value;
      } else {
        translations[item.key] = item.value;
      }
    });
    
    return translations;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
}

// 获取默认菜单项
function getDefaultMenuItems(locale = 'zh'): MenuItem[] {
  if (locale === 'en') {
    return [
      { id: 1, name: 'Home', href: '/', order: 1 },
      { id: 2, name: 'About', href: '/about', order: 2 },
      { id: 3, name: 'Products', href: '/products', order: 3 },
      { id: 4, name: 'News', href: '/news', order: 4 },
      { id: 5, name: 'Contact', href: '/contact', order: 5 }
    ];
  }
  
  return [
    { id: 1, name: '首页', href: '/', order: 1 },
    { id: 2, name: '关于我们', href: '/about', order: 2 },
    { id: 3, name: '产品中心', href: '/products', order: 3 },
    { id: 4, name: '新闻中心', href: '/news', order: 4 },
    { id: 5, name: '联系我们', href: '/contact', order: 5 }
  ];
}

// 获取特定语言的首页数据
export async function fetchHomePageData(locale = 'zh'): Promise<HomePageData> {
  try {
    const options = getApiOptions();
    
    // 获取首页横幅数据，添加语言参数
    const bannerResponse = await fetch(`${STRAPI_URL}/banners?populate=*&locale=${locale}`, options);
    if (!bannerResponse.ok) {
      throw new Error('Failed to fetch banners');
    }
    const bannerData = await bannerResponse.json();
    
    // 转换数据格式
    return {
      banners: Array.isArray(bannerData.data) 
        ? bannerData.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            description: item.decs || '',
            image: STRAPI_URL_IMG + item.img.url || '/placeholder.jpg',
            link: item.link || ''
          }))
        : [],
      
      featuredProducts: [],
      about: null
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      banners: [],
      featuredProducts: [],
      about: null
    };
  }
}

// 获取关于页面数据
export async function fetchAboutPageData(locale = 'zh') {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/about?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch about page data');
    }
    
    const data = await response.json();
    
    if (!data.data) {
      return null;
    }
    
    return {
      title: data.data.attributes.title,
      content: data.data.attributes.content,
      image: data.data.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${data.data.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    };
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return null;
  }
}

// 获取联系页面数据
export async function fetchContactPageData(locale = 'zh') {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/contact?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contact page data');
    }
    
    const data = await response.json();
    
    return {
      title: data.data?.attributes.title || '',
      content: data.data?.attributes.content || '',
      contactInfo: data.data?.attributes.contactInfo || {
        address: '',
        phone: '',
        email: ''
      }
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return {
      title: '',
      content: '',
      contactInfo: {
        address: '',
        phone: '',
        email: ''
      }
    };
  }
}

// 获取新闻列表
export async function fetchNewsItems(locale = 'zh') {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/news?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch news items');
    }
    
    const data = await response.json();
    
    return data.data?.map((item: any) => ({
      id: item.id,
      title: item.attributes.title,
      summary: item.attributes.summary,
      content: item.attributes.content,
      date: item.attributes.publishDate,
      image: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    })) || [];
  } catch (error) {
    console.error('Error fetching news items:', error);
    return [];
  }
}

// 获取单个新闻详情
export async function fetchNewsById(id: string, locale = 'zh') {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/news/${id}?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news with id ${id}`);
    }
    
    const data = await response.json();
    const item = data.data;
    
    return {
      id: item.id,
      title: item.attributes.title,
      summary: item.attributes.summary,
      content: item.attributes.content,
      date: item.attributes.publishDate,
      image: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    };
  } catch (error) {
    console.error(`Error fetching news ${id}:`, error);
    return null;
  }
}

/**
 * 获取支持的语言列表
 */
export async function fetchSupportedLocales(): Promise<Array<{code: string, name: string}>> {
  try {
    const response = await fetch(`${STRAPI_URL}/i18n/locales`);
    
    if (!response.ok) {
      console.error('Failed to fetch supported locales');
      return [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' }
      ]; // 默认语言作为后备
    }
    
    const data = await response.json();
    return data.map((locale: any) => ({
      code: locale.code,
      name: locale.name
    }));
  } catch (error) {
    console.error('Error fetching supported locales:', error);
    return [
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' }
    ]; // 默认语言作为后备
  }
}

// 获取联系信息
export async function fetchContactInfo(locale = 'zh') {
  try {
    const options = getApiOptions();
    const cacheKey = `contact-info-${locale}`;
    
    const data = await fetchWithCache(
      `${STRAPI_URL}/contact?locale=${locale}`, 
      options, 
      cacheKey
    );
    
    if (!data || !data.data) {
      console.warn(`No contact info found for locale ${locale}`);
      return getDefaultContactInfo(locale);
    }
    
    const contactData = data.data.attributes || data.data;
    
    return {
      address: contactData.address || '',
      phone: contactData.phone || '',
      email: contactData.email || '',
      mapLocation: contactData.mapLocation || null,
      socialMedia: contactData.socialMedia || []
    };
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return getDefaultContactInfo(locale);
  }
}

// 默认联系信息
function getDefaultContactInfo(locale = 'zh') {
  return {
    address: locale === 'en' ? '123 Business Street, City, Country' : '商业街123号，城市，国家',
    phone: '+1 234 567 890',
    email: 'contact@example.com',
    mapLocation: null,
    socialMedia: []
  };
}

// 获取单个新闻详情 (重命名函数以匹配导入)
export async function fetchNewsItemById(locale = 'zh', id: string) {
  return fetchNewsById(id, locale);
}

// 获取案例详情
export async function fetchCaseById(locale = 'zh', id: string) {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/cases/${id}?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch case with id ${id}`);
    }
    
    const data = await response.json();
    const item = data.data;
    
    return {
      id: item.id,
      title: item.attributes.title,
      summary: item.attributes.summary,
      content: item.attributes.content,
      date: item.attributes.publishDate,
      image: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    };
  } catch (error) {
    console.error(`Error fetching case ${id}:`, error);
    return null;
  }
}

// 获取案例列表
export async function fetchCases(locale = 'zh') {
  try {
    const options = getApiOptions();
    const response = await fetch(`${STRAPI_URL}/cases?populate=*&locale=${locale}`, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cases');
    }
    
    const data = await response.json();
    
    return data.data?.map((item: any) => ({
      id: item.id,
      title: item.attributes.title,
      summary: item.attributes.summary,
      content: item.attributes.content,
      date: item.attributes.publishDate,
      image: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    })) || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
}

// API 基础 URL
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// 通用 API 请求函数
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  if (!API_TOKEN) {
    console.error('API Token not configured');
    throw new Error('API Token not configured');
  }

  const defaultOptions: RequestInit = {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  console.log(`Sending request to: ${API_URL}${endpoint}`);
  
  const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`API error (${response.status}): ${errorText}`);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// 提交询盘表单
export async function submitInquiry(formData: any) {
  console.log('Submitting inquiry:', formData);
  
  return fetchAPI('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }
    }),
  });
}

// 获取内链关键词
export async function fetchInternalLinkKeywords(locale = 'zh') {
  try {
    const options = getApiOptions();
    const cacheKey = `internal-link-keywords-${locale}`;
    
    const data = await fetchWithCache(
      `${STRAPI_URL}/keyword?populate=*&locale=${locale}`, 
      options, 
      cacheKey
    );
    
    console.log('关键词数据',data)
    // if (data && data.data) {
    //   data.data.keys.forEach((item: any) => {
    //     const keyword = item.keyword || item.attributes?.keyword;
    //     const targetProductId = item.targetProductId || item.attributes?.targetProductId;
        
    //     if (keyword && targetProductId) {
    //       keywordsMap[keyword] = targetProductId.toString();
    //     }
    //   });
    // }
    
    return data.data.keys;
  } catch (error) {
    console.error('Error fetching internal link keywords:', error);
    return {};
  }
}

// 处理产品描述中的关键词并生成内链
export function processInternalLinks(
  text: string, 
  keywordsMap: Record<string, string>,
  locale: string
): string {
  if (!text || !keywordsMap || Object.keys(keywordsMap).length === 0) {
    return text;
  }
  
  let result = text;
  
  // 按关键词长度降序排序，优先处理较长的关键词
  const sortedKeywords = Object.entries(keywordsMap)
    .filter(([k, v]) => k && v)
    .sort(([a], [b]) => b.length - a.length);
  
  // 处理每个关键词
  for (const [keyword, targetId] of sortedKeywords) {
    // 检查关键词是否在文本中
    if (result.includes(keyword)) {
      // 检查关键词是否已经在链接中
      const linkPattern = new RegExp(`<a[^>]*>[^<]*${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*</a>`);
      if (linkPattern.test(result)) {
        continue; // 如果关键词已经在链接中，跳过
      }
      
      // 替换第一个匹配项
      const parts = result.split(keyword);
      if (parts.length > 1) {
        result = parts[0] + 
                `<a href="/${locale}/products/${targetId}" class="text-indigo-600 hover:underline">${keyword}</a>` + 
                parts.slice(1).join(keyword);
      }
    }
  }
  
  return result;
} 