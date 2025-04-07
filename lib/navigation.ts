import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

/**
 * 预取多个路由
 */
export function prefetchRoutes(
  routes: string[],
  locale: string,
  router: AppRouterInstance
) {
  routes.forEach(route => {
    // 确保路由以 / 开头
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
    
    // 添加语言前缀（如果需要）
    const localizedRoute = normalizedRoute.startsWith(`/${locale}`)
      ? normalizedRoute
      : `/${locale}${normalizedRoute}`;
    
    // 预取路由
    try {
      router.prefetch(localizedRoute);
      console.log(`Prefetched: ${localizedRoute}`);
    } catch (error) {
      console.error(`Failed to prefetch ${localizedRoute}:`, error);
    }
  });
}

/**
 * 优化的导航函数，使用客户端导航而不是服务器请求
 */
export function navigateTo(
  route: string,
  locale: string,
  router: AppRouterInstance
) {
  // 确保路由以 / 开头
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  
  // 添加语言前缀（如果需要）
  const localizedRoute = normalizedRoute.startsWith(`/${locale}`)
    ? normalizedRoute
    : `/${locale}${normalizedRoute}`;
  
  // 使用 router.push 进行客户端导航
  router.push(localizedRoute);
} 