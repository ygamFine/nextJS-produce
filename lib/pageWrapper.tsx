import React from 'react';
import { fetchSupportedLocales } from './api';

// 简单的页面包装器，避免类型问题
export function withLocale(Component: any) {
  return function LocalePage(props: any) {
    return <Component {...props} />;
  };
}

// 通用的静态参数生成函数
export async function generateCommonStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 通用的重新验证时间 (60秒)
export const commonRevalidate = 60; 