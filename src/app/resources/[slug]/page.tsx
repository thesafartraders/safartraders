import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceGuidePage from "@/components/ResourceGuidePage";
import { getResourceGuide, resourceGuides } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return resourceGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getResourceGuide(slug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };
  const imageUrl = `${siteConfig.url}/og/${guide.slug}`;

  return {
    title: guide.seoTitle,
    description: guide.metaDescription,
    alternates: { canonical: `${siteConfig.url}/resources/${guide.slug}` },
    openGraph: {
      title: guide.seoTitle,
      description: guide.metaDescription,
      url: `${siteConfig.url}/resources/${guide.slug}`,
      type: "article",
      locale: "en_US",
      siteName: siteConfig.name,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${guide.title} by ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle,
      description: guide.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function ResourceGuideRoute({ params }: PageProps) {
  const { slug } = await params;
  const guide = getResourceGuide(slug);
  if (!guide) notFound();

  return <ResourceGuidePage guide={guide as NonNullable<typeof guide>} />;
}
