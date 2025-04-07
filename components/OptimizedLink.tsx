'use client';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { navigateTo } from '@/lib/navigation';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function OptimizedLink({ href, children, className, onClick }: OptimizedLinkProps) {
  const router = useRouter();
  const { locale } = useLocale();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    // 如果没有被阻止默认行为，则执行导航
    if (!e.defaultPrevented) {
      e.preventDefault();
      navigateTo(href, locale, router);
    }
  };
  
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
} 