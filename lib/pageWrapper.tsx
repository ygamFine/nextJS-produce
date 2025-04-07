import React from 'react';

// 简单的页面包装器，避免类型问题
export function withLocale(Component: any) {
  return function LocalePage(props: any) {
    return <Component {...props} />;
  };
} 