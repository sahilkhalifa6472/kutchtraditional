/**
 * ImgBB Image Hosting Service
 * Uploads images to ImgBB API and returns permanent hosted CDN image URLs (i.ibb.co)
 * which are subsequently stored in Firebase Firestore.
 */

const IMGBB_STORAGE_KEY = 'kutch_traditional_imgbb_api_key';

// Default demo fallback key or user-configured key
export const DEFAULT_IMGBB_KEY = '71ab974d7e1963f45f4db63274f4bc5b';

export function getImgbbApiKey(): string {
  if (typeof window === 'undefined') return DEFAULT_IMGBB_KEY;
  return localStorage.getItem(IMGBB_STORAGE_KEY) || DEFAULT_IMGBB_KEY;
}

export function setImgbbApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key && key.trim()) {
    localStorage.setItem(IMGBB_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(IMGBB_STORAGE_KEY);
  }
}

export interface ImgBBUploadResponse {
  success: boolean;
  url?: string;
  displayUrl?: string;
  thumbUrl?: string;
  deleteUrl?: string;
  error?: string;
}

/**
 * Upload an image File or Base64 data string to ImgBB
 */
export async function uploadToImgBB(
  fileOrBase64: File | string,
  customApiKey?: string
): Promise<ImgBBUploadResponse> {
  const apiKey = (customApiKey && customApiKey.trim()) || getImgbbApiKey();

  try {
    const formData = new FormData();

    if (typeof fileOrBase64 === 'string') {
      // If base64 data URL (e.g. data:image/png;base64,...), strip prefix if needed or pass as is
      const cleanBase64 = fileOrBase64.includes('base64,')
        ? fileOrBase64.split('base64,')[1]
        : fileOrBase64;
      formData.append('image', cleanBase64);
    } else {
      formData.append('image', fileOrBase64);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.success && data.data) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        thumbUrl: data.data.thumb?.url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      const errMsg = data?.error?.message || 'ImgBB upload failed';
      console.warn('[ImgBB] Upload error:', errMsg);
      return {
        success: false,
        error: errMsg,
      };
    }
  } catch (err: any) {
    console.error('[ImgBB] Network or API error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to connect to ImgBB service',
    };
  }
}
