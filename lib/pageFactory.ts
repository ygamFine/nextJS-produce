import { ReactNode } from 'react';

type PageParams = {
  locale: string;
  [key: string]: string;
};

type PageProps = {
  params: PageParams;
  searchParams?: Record<string, string | string[] | undefined>;
};

type PageComponent<P extends PageParams = PageParams> = (
  props: { params: P; searchParams?: Record<string, string | string[] | undefined> }
) => Promise<ReactNode> | ReactNode;

export function createPage<P extends PageParams = PageParams>(
  component: (props: { params: P; searchParams?: Record<string, string | string[] | undefined> }) => Promise<ReactNode> | ReactNode
): PageComponent<P> {
  return component;
} 