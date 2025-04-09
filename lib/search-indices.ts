// 搜索项类型
export interface SearchItem {
  id: string;
  title: string;
  content: string;
  type: 'product' | 'news' | 'case';
  url: string;
  image?: string;
  date?: string;
  price?: number;
}

// 搜索索引
export const searchIndices: Record<string, SearchItem[]> = {
  zh: [],
  en: [],
  ja: [],
  asa: []
};

// 在客户端加载索引
export async function loadSearchIndex(locale: string): Promise<SearchItem[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const response = await fetch(`/search/index-${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load search index for ${locale}`);
    }
    
    const data = await response.json();
    searchIndices[locale] = data;
    return data;
  } catch (error) {
    console.error(`Error loading search index for ${locale}:`, error);
    return [];
  }
} 