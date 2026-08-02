import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageMetadataOptions = {
  pathname: string;
  title: string;
  description: string;
};

export function createPageMetadata({ pathname, title, description }: PageMetadataOptions): Metadata {
  const url = pathname ? `${siteConfig.url}${pathname}` : siteConfig.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} export and trading support`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; pathname?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.pathname ? `${siteConfig.url}${item.pathname}` : siteConfig.url,
    })),
  };
}
