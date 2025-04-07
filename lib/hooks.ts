import useSWR from 'swr';
import { fetchHomePageData } from './api';

export function useHomePageData(locale: string) {
  const { data, error, isLoading } = useSWR(
    `home-page-${locale}`,
    () => fetchHomePageData(locale),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 3600000, // 1小时内不重复请求
    }
  );
  
  return {
    homeData: data,
    isLoading,
    isError: error
  };
} 