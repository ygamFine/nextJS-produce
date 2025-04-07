// 创建一个脚本，在构建时生成所有语言的翻译文件
import fs from 'fs';
import path from 'path';
import { fetchSupportedLocales } from '../lib/api';

async function generateTranslations() {
  try {
    // 获取支持的语言列表
    const locales = await fetchSupportedLocales();
    console.log('Supported locales:', locales);
    
    // 创建 public/locales 目录
    const localesDir = path.join(process.cwd(), 'public/locales');
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
    }
    
    // 默认翻译
    const defaultTranslations = {
      zh: {
        "home": "首页",
        "about": "关于我们",
        "products": "产品",
        "news": "新闻",
        "contact": "联系我们",
        "language": "语言",
        "search": "搜索",
        "menu": "菜单",
        "footer.copyright": "版权所有",
        "footer.rights": "保留所有权利",
        "welcome": "欢迎访问我们的网站"
      },
      en: {
        "home": "Home",
        "about": "About Us",
        "products": "Products",
        "news": "News",
        "contact": "Contact",
        "language": "Language",
        "search": "Search",
        "menu": "Menu",
        "footer.copyright": "Copyright",
        "footer.rights": "All Rights Reserved",
        "welcome": "Welcome to our website"
      },
      ja: {
        "home": "ホーム",
        "about": "会社概要",
        "products": "製品",
        "news": "ニュース",
        "contact": "お問い合わせ",
        "language": "言語",
        "search": "検索",
        "menu": "メニュー",
        "footer.copyright": "著作権",
        "footer.rights": "無断複写・転載を禁じます",
        "welcome": "ようこそ私たちのウェブサイトへ"
      },
      asa: {
        "home": "Home (ASA)",
        "about": "About Us (ASA)",
        "products": "Products (ASA)",
        "news": "News (ASA)",
        "contact": "Contact (ASA)",
        "language": "Language (ASA)",
        "search": "Search (ASA)",
        "menu": "Menu (ASA)",
        "footer.copyright": "Copyright (ASA)",
        "footer.rights": "All Rights Reserved (ASA)",
        "welcome": "Welcome to our website (ASA)"
      }
    };
    
    // 为每种语言获取翻译并保存为 JSON 文件
    for (const locale of locales) {
      console.log(`Generating translations for ${locale.code}...`);
      
      try {
        // 尝试从 API 获取翻译
        // const translations = await fetchTranslations(locale.code);
        
        // 使用默认翻译（如果 API 不可用）
        const translations = defaultTranslations[locale.code as keyof typeof defaultTranslations] || {};
        
        fs.writeFileSync(
          path.join(localesDir, `${locale.code}.json`),
          JSON.stringify(translations, null, 2)
        );
        
        console.log(`Successfully generated translations for ${locale.code}`);
      } catch (error) {
        console.error(`Error generating translations for ${locale.code}:`, error);
        
        // 使用默认翻译作为后备
        const fallbackTranslations = defaultTranslations[locale.code as keyof typeof defaultTranslations] || {};
        
        fs.writeFileSync(
          path.join(localesDir, `${locale.code}.json`),
          JSON.stringify(fallbackTranslations, null, 2)
        );
        
        console.log(`Used fallback translations for ${locale.code}`);
      }
    }
    
    console.log('Translations generated successfully!');
  } catch (error) {
    console.error('Error generating translations:', error);
    
    // 如果出错，创建默认翻译文件
    const localesDir = path.join(process.cwd(), 'public/locales');
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
    }
    
    const defaultLocales = [
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' },
      { code: 'ja', name: '日本語' },
      { code: 'asa', name: 'ASA' }
    ];
    
    const defaultTranslations = {
      zh: {
        "home": "首页",
        "about": "关于我们",
        "products": "产品",
        "news": "新闻",
        "contact": "联系我们",
        "language": "语言",
        "search": "搜索",
        "menu": "菜单",
        "footer.copyright": "版权所有",
        "footer.rights": "保留所有权利",
        "welcome": "欢迎访问我们的网站"
      },
      en: {
        "home": "Home",
        "about": "About Us",
        "products": "Products",
        "news": "News",
        "contact": "Contact",
        "language": "Language",
        "search": "Search",
        "menu": "Menu",
        "footer.copyright": "Copyright",
        "footer.rights": "All Rights Reserved",
        "welcome": "Welcome to our website"
      },
      ja: {
        "home": "ホーム",
        "about": "会社概要",
        "products": "製品",
        "news": "ニュース",
        "contact": "お問い合わせ",
        "language": "言語",
        "search": "検索",
        "menu": "メニュー",
        "footer.copyright": "著作権",
        "footer.rights": "無断複写・転載を禁じます",
        "welcome": "ようこそ私たちのウェブサイトへ"
      },
      asa: {
        "home": "Home (ASA)",
        "about": "About Us (ASA)",
        "products": "Products (ASA)",
        "news": "News (ASA)",
        "contact": "Contact (ASA)",
        "language": "Language (ASA)",
        "search": "Search (ASA)",
        "menu": "Menu (ASA)",
        "footer.copyright": "Copyright (ASA)",
        "footer.rights": "All Rights Reserved (ASA)",
        "welcome": "Welcome to our website (ASA)"
      }
    };
    
    for (const locale of defaultLocales) {
      const translations = defaultTranslations[locale.code as keyof typeof defaultTranslations];
      
      fs.writeFileSync(
        path.join(localesDir, `${locale.code}.json`),
        JSON.stringify(translations, null, 2)
      );
      
      console.log(`Created default translations for ${locale.code}`);
    }
  }
}

generateTranslations(); 