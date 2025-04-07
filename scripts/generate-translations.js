// JavaScript 版本的翻译生成脚本
const fs = require('fs');
const path = require('path');
const defaultTranslations = require('./default-translations');

async function generateTranslations() {
  try {
    // 创建 public/locales 目录
    const localesDir = path.join(process.cwd(), 'public/locales');
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
    }
    
    // 默认语言列表
    const defaultLocales = [
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' },
      { code: 'ja', name: '日本語' },
      { code: 'asa', name: 'ASA' }
    ];
    
    // 为每种语言生成翻译文件
    for (const locale of defaultLocales) {
      console.log(`Generating translations for ${locale.code}...`);
      
      const translations = defaultTranslations[locale.code] || {};
      
      fs.writeFileSync(
        path.join(localesDir, `${locale.code}.json`),
        JSON.stringify(translations, null, 2)
      );
      
      console.log(`Successfully generated translations for ${locale.code}`);
    }
    
    console.log('Translations generated successfully!');
  } catch (error) {
    console.error('Error generating translations:', error);
  }
}

generateTranslations(); 