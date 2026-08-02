import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { productCategories } from "@/lib/products";

export default function ProductsGrid() {
  return (
    <div className="products-page-grid">
      {productCategories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/products/${cat.slug}`}
          className="product-list-card"
        >
          <div className="product-list-media">
            <Image
              src={cat.image}
              alt={cat.imageAlt}
              fill
              sizes="(min-width: 900px) 260px, (min-width: 640px) 50vw, 100vw"
              className="product-list-img"
            />
          </div>
          <div className="product-list-body">
            <span className="eyebrow">{cat.shortTitle}</span>
            <h2>{cat.title}</h2>
            <p>{cat.description}</p>
            <div className="subcat-row">
              {cat.subcategories.slice(0, 3).map((sub) => (
                <span key={sub.slug}>{sub.name}</span>
              ))}
              {cat.subcategories.length > 3 && (
                <span className="subcat-more">+{cat.subcategories.length - 3} more</span>
              )}
            </div>
            <div className="text-link">
              View capabilities <ArrowRight size={14} aria-hidden="true" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
