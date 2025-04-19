// 首页横幅类型
export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
}

// 产品类型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

// 公司简介类型
export interface About {
  title: string;
  content: string;
  image: string;
}

// 首页数据类型
export interface HomePageData {
  banners: Banner[];
  featuredProducts: Product[];
  about: About | null;
}

// 菜单项类型
export interface MenuItem {
  id: number | string;
  name: string;
  href: string;
  target?: string;
  order?: number;
}

// 全局网站信息类型
export interface GlobalInfo {
  siteName: string;
  logo: string;
  menuItems?: MenuItem[];
  translations: Record<string, string>;
  locale: string;
  footer: {
    copyright: string;
    links: Array<{
      id: number | string;
      name: string;
      href: string;
    }>;
    socialMedia: Array<{
      id: number | string;
      name: string;
      icon: string;
      href: string;
    }>;
  };
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
}

// 修改 LocalePageProps 类型
export type LocalePageProps = {
  params: {
    locale: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

// 修改 NewsItem 类型
export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content: string;
  date?: string;
  author?: string;
  image: string;
  slug?: string;
} 