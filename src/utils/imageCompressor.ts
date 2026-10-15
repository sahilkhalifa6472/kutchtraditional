/**
 * Compresses an image file client-side using Canvas to ensure it's under 100KB
 * while maintaining high visual quality.
 */
export async function compressImageToUnder100Kb(file: File, maxWidth = 1000, maxHeight = 1000): Promise<File> {
  // If already under 100KB, return as is
  if (file.size <= 100 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize proportionally if dimensions exceed max limits
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.88;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Compress iteratively until under ~100KB (approx 135k characters in base64) or quality reaches 0.3
        while (dataUrl.length > 135000 && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Convert base64 back to File object
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        const compressedFile = new File([u8arr], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: mime });
        resolve(compressedFile);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
