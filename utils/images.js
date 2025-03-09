import { assets } from "@/assets/assets";

export const getImageSource = (image) => {
  try {
    if (!image) return assets.default_img;
    // If it's an object with a .url property
    if (typeof image === "object" && image.url) {
      return image.url.startsWith("http") ? image.url : assets.default_img;
    }
    // If it's a string, see if it matches a key in assets or an http link
    if (typeof image === "string") {
      // If it starts with http(s), use it directly
      if (image.startsWith("http")) return image;
      // Else see if it matches a key in `assets`
      return assets[image] || assets.default_img;
    }
    // Otherwise fallback
    return assets.default_img;
  } catch {
    return assets.default_img;
  }
};