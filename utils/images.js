// utils/images.js
import { assets } from "@/assets/assets";

export const getImageSource = (image) => {
  if (!image || image.length === 0) {
    return assets.default_img;
  }

  const images = Array.isArray(image) ? image : [image];

  for (const img of images) {
    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }
  }

  return assets.default_img;
};