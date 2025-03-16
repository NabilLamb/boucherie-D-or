// utils/imageProcessor.js

export const compressImage = async (file) => {
    if (typeof window === 'undefined') return file; // Skip in SSR
  
    const { readAndCompressImage } = await import('browser-image-resizer');
    
    const config = {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
      autoRotate: true,
      fileType: 'webp'
    };
  
    try {
      return await readAndCompressImage(file, config);
    } catch (error) {
      console.error('Image compression error:', error);
      return file;
    }
  };
  

export const validateImage = (file) => {
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE_MB = MAX_SIZE / (1024 * 1024);
  
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        message: `Unsupported file format (${file.type.split('/')[1]}). Please use: ${ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}`,
        type: 'format'
      };
    }
  
    if (file.size > MAX_SIZE) {
      return {
        message: `File too large (${(file.size/(1024*1024)).toFixed(1)}MB). Maximum allowed: ${MAX_SIZE_MB}MB`,
        type: 'size',
        helpLink: 'https://www.iloveimg.com/compress-image'
      };
    }
  
    return null;
  };