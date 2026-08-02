import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { productCategories } from "@/lib/products";

export default function ProductCategories() {
  return (
    <section className="section-pad bg-light section-border">
      <div className="container-site">

        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Capabilities</span>
            <h2 className="section-title small">Sourcing across metals, machinery, materials, and custom requirements.</h2>
          </div>
          <Link href="/products" className="btn btn-secondary">
            View all capabilities <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="cap-grid">
          {productCategories.map((cap) => (
            <Link
              key={cap.slug}
              href={`/products/${cap.slug}`}
              className="cap-grid-card"
            >
              <div className="cap-grid-media" aria-hidden="true">
                <Image
                  src={cap.image}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 25vw, (min-width: 540px) 50vw, 100vw"
                  className="cap-grid-image"
                />
              </div>
              <h3 className="cap-grid-title">{cap.shortTitle}</h3>
              <p className="cap-grid-desc">{cap.description}</p>
              <span className="cap-grid-link">
                View capabilities <ArrowRight size={12} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
