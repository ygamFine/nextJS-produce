// 简单的价格格式化函数
export function formatPrice(price: number, locale: string) {
  const currencySymbol = locale === 'en' ? '$' : '¥';
  return `${currencySymbol}${price.toFixed(2)}`;
}

// 格式化日期
export function formatDate(dateString: string, locale = 'zh') {
  if (!dateString) return '';
  
  try {
    // 尝试创建日期对象
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}`);
      return '';
    }
    
    // 根据语言选择不同的格式
    if (locale === 'en') {
      // 英文格式: January 1, 2023
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      // 中文格式: 2023年1月1日
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return '';
  }
} 