import type { HomePageData, Product, GlobalInfo, MenuItem, NewsItem } from './types';

// 统一 API URL 定义
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
const STRAPI_URL_IMG = process.env.NEXT_PUBLIC_STRAPI_API_PROXY || '';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

// 缓存目录
const CACHE_DIR = process.cwd() + '/.next/cache/data';

// 内存缓存
const memoryCache: Record<string, { data: any, timestamp: number }> = {};

// 缓存有效期（1小时）
const CACHE_TTL = 60 * 60 * 1000;

// 获取 API Token
const getApiOptions = () => {
  if (!API_TOKEN) {
    console.warn("Strapi API Token is not set.");
    return {
      next: { 
        revalidate: 60,
        tags: [] 
      }
    };
  }
  
  return {
    headers: { 
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { 
      revalidate: 60,
      tags: [] 
    }
  };
};

// 通用的数据获取函数，支持 SSG 和 ISR
async function fetchWithCache(url: string, options: any, cacheKey: string) {
  // 在客户端，直接获取数据，不使用缓存
  if (typeof window !== 'undefined') {
    try {
      // 使用类型断言确保 TypeScript 不会报错
      if(options && options.next && typeof options.next === 'object') {
        (options.next as any).tags = [cacheKey];
      }
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  }
  
  // 服务器端 - 使用内存缓存
  const now = Date.now();
  if (memoryCache[cacheKey] && (now - memoryCache[cacheKey].timestamp) < CACHE_TTL) {
    return memoryCache[cacheKey].data;
  }
  
  // 从 API 获取数据
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    
    const data = await response.json();
    
    // 更新内存缓存
    memoryCache[cacheKey] = { data, timestamp: now };
    
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
      if (item) {
        translations[item.key] = item.value;
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
export async function fetchAboutData(locale = 'zh') {
  try {
    const options = getApiOptions();
    const url = `${STRAPI_URL}/about?populate=*&locale=${locale}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch about data');
    }
    
    const data = await response.json();
    
    // 确保内容是字符串
    let content = '';
    if (data.data && data.data.attributes && typeof data.data.attributes.content === 'string') {
      content = data.data.attributes.content;
    } else if (data.data && data.data.attributes && data.data.attributes.content) {
      try {
        content = JSON.stringify(data.data.attributes.content);
      } catch (e) {
        content = '';
      }
    }
    
    return {
      title: data.data?.attributes?.title || '',
      content: content,
      image: data.data?.attributes?.image?.data?.attributes?.url
        ? `${STRAPI_URL_IMG}${data.data.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    return {
      title: '',
      content: '',
      image: '/placeholder.jpg'
    };
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
      title: data.data?.title || '',
      content: data.data?.content || '',
      contactInfo: data.data?.contactInfo || {
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
export async function fetchNewsItems(locale = 'zh', page = 1, pageSize = 10) {
  try {
    const options = getApiOptions();
    options.next.tags = ['news'];
    const url = `${STRAPI_URL}/articles?populate=*&locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news items`);
    }
    
    const data = await response.json();
    
    // 处理不同的响应结构
    let articles = [];
    
    if (data && data.data && Array.isArray(data.data)) {
      // 标准 Strapi v4 响应
      articles = data.data.map((item: any) => {
        // 确保内容是字符串
        let content = '';
        if (typeof item.description === 'string') {
          content = item.description;
        } else if (item.description) {
          try {
            content = JSON.stringify(item.description);
          } catch (e) {
            content = '';
          }
        }
        
        return {
          id: item.documentId || item.id,
          title: item.title || '',
          summary: item.title || '',
          content: content,
          date: item.createdAt || item.date,
          author: item.author?.name || '',
          image: item.cover?.url 
            ? `${STRAPI_URL_IMG}${item.cover.url}`
            : '/placeholder-news.jpg',
          slug: item.slug || item.documentId || item.id
        };
      });
    } else if (Array.isArray(data)) {
      // 直接数组响应
      articles = data.map((item: any) => {
        // 确保内容是字符串
        let content = '';
        if (typeof item.description === 'string') {
          content = item.description;
        } else if (item.description) {
          try {
            content = JSON.stringify(item.description);
          } catch (e) {
            content = '';
          }
        }
        
        return {
          id: item.documentId || item.id,
          title: item.title || '',
          summary: item.title || '',
          content: content,
          date: item.createdAt || item.date,
          author: item.author?.name || '',
          image: item.cover?.url 
            ? `${STRAPI_URL_IMG}${item.cover.url}`
            : '/placeholder-news.jpg',
          slug: item.slug || item.documentId || item.id
        };
      });
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching news items:', error);
    return [];
  }
}

// 获取单个新闻详情
export async function fetchNewsItemById(locale = 'zh', id: string) {
  try {
    const options = getApiOptions();
    const url = `${STRAPI_URL}/articles/${id}?populate=*&locale=${locale}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news item with ID ${id}`);
    }
    
    const data = await response.json();
    
    if (!data) {
      throw new Error(`News item with ID ${id} not found`);
    }
    
    // 处理不同的响应结构
    let newsItem;
    
    if (data.data && data.data.id) {
      // 确保内容是字符串
      let content = '';
      if (typeof data.data.description === 'string') {
        content = data.data.description;
      } else if (data.data.description) {
        try {
          content = JSON.stringify(data.data.description);
        } catch (e) {
          content = '';
        }
      }
      
      newsItem = {
        id: data.data.id,
        title: data.data.title || '',
        summary: data.data.title || '',
        content: content,
        date: data.data.createdAt,
        author: data.data.author?.name || '',
        image: data.data.cover?.url 
          ? `${STRAPI_URL_IMG}${data.data.cover.url}`
          : '/placeholder-news.jpg',
        slug: data.data.slug || data.data.id
      };
    } else if (data.id) {
      // 确保内容是字符串
      let content = '';
      if (typeof data.description === 'string') {
        content = data.description;
      } else if (data.description) {
        try {
          content = JSON.stringify(data.description);
        } catch (e) {
          content = '';
        }
      }
      
      newsItem = {
        id: data.id,
        title: data.title || '',
        summary: data.title || '',
        content: content,
        date: data.createdAt,
        author: data.author?.name || '',
        image: data.cover?.url 
          ? `${STRAPI_URL_IMG}${data.cover.url}`
          : '/placeholder-news.jpg',
        slug: data.slug || data.id
      };
    } else {
      throw new Error(`Unexpected data structure for news item with ID ${id}`);
    }
    
    return newsItem;
  } catch (error) {
    console.error(`Error fetching news item with ID ${id}:`, error);
    return null;
  }
}

// 获取相关新闻
export async function fetchRelatedNews(locale = 'zh', currentId: string, limit = 3) {
  try {
    const allNews = await fetchNewsItems(locale, 1, 20);
    
    // 过滤掉当前新闻
    const filteredNews = allNews.filter(item => item.id.toString() !== currentId.toString());
    
    // 如果没有足够的新闻，直接返回所有过滤后的新闻
    if (filteredNews.length <= limit) {
      return filteredNews;
    }
    
    // 随机选择指定数量的相关新闻
    const shuffled = filteredNews.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related news:', error);
    return [];
  }
}

// 获取支持的语言列表
export async function fetchSupportedLocales() {
  try {
    const options = getApiOptions();
    const url = `${STRAPI_URL}/i18n/locales`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error('Failed to fetch supported locales');
    }
    
    const data = await response.json();
    
    return data.map((locale: any) => ({
      code: locale.code,
      name: locale.name
    }));
  } catch (error) {
    console.error('api 663 Error fetching supported locales:', error);
    // 返回默认语言列表
    return [
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' }
    ];
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
    
    const contactData = data.data || data.data;
    
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
      title: item.title,
      summary: item.summary,
      content: item.content,
      date: item.publishDate,
      image: item.image?.data?.url 
        ? `${STRAPI_URL_IMG}${item.image.data.url}`
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
      title: item.title,
      summary: item.summary,
      content: item.content,
      date: item.publishDate,
      image: item.image?.data?.url 
        ? `${STRAPI_URL_IMG}${item.image.data.url}`
        : '/placeholder.jpg'
    })) || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
}

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

  console.log(`Sending request to: ${STRAPI_URL}${endpoint}`);
  
  const response = await fetch(`${STRAPI_URL}${endpoint}`, mergedOptions);

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
  
  // 使用 STRAPI_URL 而不是 API_URL
  const endpoint = '/inquiries';
  
  try {
    const response = await fetch(`${STRAPI_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
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
    //     const keyword = item.keyword || item?.keyword;
    //     const targetProductId = item.targetProductId || item?.targetProductId;
        
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

// 导出其他必要的函数
export { getApiOptions }; 