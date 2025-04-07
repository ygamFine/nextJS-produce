// 创建一个脚本，在构建时生成所有语言的翻译文件
const fs = require('fs');
const path = require('path');

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
  }
};

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成翻译文件
function generateTranslations() {
  try {
    console.log('Generating translation files...');
    
    // 创建翻译目录
    const translationsDir = path.join(process.cwd(), 'public', 'locales');
    ensureDirectoryExists(translationsDir);
    
    // 为每种语言生成翻译文件
    for (const locale in defaultTranslations) {
      const filePath = path.join(translationsDir, `${locale}.json`);
      fs.writeFileSync(filePath, JSON.stringify(defaultTranslations[locale], null, 2));
      console.log(`Generated translation file for ${locale}`);
    }
    
    console.log('Translation files generated successfully!');
  } catch (error) {
    console.error('Error generating translation files:', error);
    process.exit(1);
  }
}

// 执行生成
generateTranslations(); 