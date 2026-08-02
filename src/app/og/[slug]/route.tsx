import { ImageResponse } from "next/og";
import { getProductCategory, productCategories } from "@/lib/products";
import { getResourceGuide, resourceGuides } from "@/lib/resources";

export const runtime = "nodejs";
export const alt = "Safar Traders trade and export support";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [...productCategories, ...resourceGuides].map(({ slug }) => ({ slug }));
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductCategory(slug);
  const resource = getResourceGuide(slug);
  const title = product?.title ?? resource?.title ?? "Trade & Export Support";
  const label = product ? "Industrial sourcing from India" : resource ? "Buyer resource" : "Safar Traders";

  return new ImageResponse(
    (
      <div style={{ display: "flex", height: "100%", width: "100%", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#020617", padding: "64px", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", color: "#93c5fd", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em" }}>Safar Traders</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 20, color: "#93c5fd", fontSize: 24, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
          <div style={{ maxWidth: 1040, fontSize: 60, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.025em" }}>{title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #475569", paddingTop: 28, color: "#cbd5e1", fontSize: 24 }}>
          <span>Trade &amp; Export Partner</span>
          <span>safartraders.com</span>
        </div>
      </div>
    ),
    size,
  );
}
