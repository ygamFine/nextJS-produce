// 简单的价格格式化函数
export function formatPrice(price: number, locale: string) {
  const currencySymbol = locale === 'en' ? '$' : '¥';
  return `${currencySymbol}${price.toFixed(2)}`;
} 