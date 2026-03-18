// app/product/[id]/page.jsx

import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        title: "Product Not Found | Boucherie D'or",
        description: "The requested product could not be found.",
      };
    }

    const { product } = await res.json();
    const currency = process.env.NEXT_PUBLIC_CURRENCY || "DH";
    const price = product.offerPrice || product.price;
    const productTitle = `${product.name} | Boucherie D'or`;
    const productDescription = product.description?.slice(0, 155) || "Quality meat products from Boucherie D'or.";

    return {
      title: productTitle,
      description: productDescription,
      alternates: { canonical: `${baseUrl}/product/${id}` },
      openGraph: {
        title: productTitle,
        description: `${currency}${price.toFixed(2)} / ${product.unit} — ${productDescription}`,
        url: `${baseUrl}/product/${id}`,
        siteName: "Boucherie D'or",
        images: product.image?.[0]
          ? [
              {
                url: product.image[0],
                width: 1200,
                height: 630,
                alt: product.name,
              },
            ]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: productTitle,
        description: productDescription,
        images: product.image?.[0] ? [product.image[0]] : [],
      },
    };
  } catch (error) {
    console.error("[METADATA_ERROR]", error);
    return {
      title: "Boucherie D'or - Premium Meat Shop",
      description: "Quality products delivered to your door.",
    };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch product
  const productRes = await fetch(`${baseUrl}/api/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (!productRes.ok) notFound();

  const { product } = await productRes.json();

  // Extract category ID correctly (handles both object and string)
  const categoryId = product.category?._id || product.category;

  // Fetch related products using the category ID, excluding current product
  const relatedRes = await fetch(
    `${baseUrl}/api/products?category=${categoryId}&exclude=${id}&limit=12`,
    { next: { revalidate: 60 } }
  );
  const { products: relatedProducts } = await relatedRes.json();

  return <ProductPageClient product={product} relatedProducts={relatedProducts || []} />;
}