import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";
import { getProductCategory, productCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) return {};
  const imageUrl = `${siteConfig.url}/og/${category.slug}`;

  return {
    title: category.seoTitle,
    description: category.metaDescription,
    alternates: { canonical: `${siteConfig.url}/products/${category.slug}` },
    openGraph: {
      title: category.seoTitle,
      description: category.metaDescription,
      url: `${siteConfig.url}/products/${category.slug}`,
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${category.title} sourcing by ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category.seoTitle,
      description: category.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) notFound();

  return <ProductDetailPage category={category as NonNullable<typeof category>} />;
}
