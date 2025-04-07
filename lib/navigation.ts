import { useRouter } from 'next/navigation';

type Router = ReturnType<typeof useRouter>;

/**
 * 预取多个路由
 */
export function prefetchRoutes(router: Router, routes: string[]) {
  if (!router || !routes.length) return;
  
  routes.forEach(route => {
    try {
      router.prefetch(route);
    } catch (error) {
      console.error(`Failed to prefetch route: ${route}`, error);
    }
  });
}

/**
 * 导航到指定路由
 */
export function navigateTo(href: string, locale: string, router: Router) {
  if (!href || !router) return;
  
  // 处理外部链接
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    window.open(href, '_blank');
    return;
  }
  
  // 确保路径以斜杠开头
  let path = href.startsWith('/') ? href : `/${href}`;
  
  // 添加语言前缀
  if (!path.startsWith(`/${locale}`)) {
    path = `/${locale}${path}`;
  }
  
  router.push(path);
} 