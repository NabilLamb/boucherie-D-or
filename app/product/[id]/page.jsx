// app/product/[id]/page.jsx

import ProductPageClient from "./ProductPageClient";

/**
 * generateMetadata
 * Fetches product data to inject SEO tags.
 * Uses Next.js Data Cache (revalidate) to avoid over-fetching.
 */
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://boucherie-d-or.vercel.app";
    
    // Fetch with Next.js specific caching logic
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 3600 }, // Cache SEO data for 1 hour
    });

    if (!res.ok) {
      return { 
        title: "Product Not Found | Boucherie D'or",
        description: "The requested product could not be found."
      };
    }

    const { product } = await res.json();
    const currency = process.env.NEXT_PUBLIC_CURRENCY || "DH"; // Updated to your usual currency
    const price = product.offerPrice || product.price;
    const productTitle = `${product.name} | Boucherie D'or`;
    const productDescription = product.description?.slice(0, 155) || "Quality meat products from Boucherie D'or.";

    return {
      title: productTitle,
      description: productDescription,
      alternates: {
        canonical: `${baseUrl}/product/${id}`,
      },
      openGraph: {
        title: productTitle,
        description: `${currency}${price.toFixed(2)} / ${product.unit} — ${productDescription}`,
        url: `${baseUrl}/product/${id}`,
        siteName: "Boucherie D'or",
        images: product.image?.[0]
          ? [
              {
                url: product.image[0],
                width: 1200, // Best size for Facebook/WhatsApp sharing
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
      description: "Quality products delivered to your door."
    };
  }
}

/**
 * ProductPage Component
 * Passes the params to the client-side component for rendering.
 */
export default async function ProductPage({ params }) {
  // In Next.js 15+, params should be awaited if used in the component body,
  // but here we just pass it to the Client Component.
  return <ProductPageClient params={params} />;
}