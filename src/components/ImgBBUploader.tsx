import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Link2, Image as ImageIcon, Key, RefreshCw } from 'lucide-react';
import { uploadToImgBB, getImgbbApiKey, setImgbbApiKey, DEFAULT_IMGBB_KEY } from '../lib/imgbb';
import { compressImageToUnder100Kb } from '../utils/imageCompressor';

interface ImgBBUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  helperText?: string;
}

export const ImgBBUploader: React.FC<ImgBBUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  label = 'Upload Image to ImgBB',
  helperText = 'Files are uploaded directly to ImgBB CDN and stored in Firebase Firestore',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(getImgbbApiKey());
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    // Reset status
    setErrorMessage(null);
    setUploadSuccess(false);

    // Compress image to under 100KB while preserving visual quality
    setIsUploading(true);
    const file = await compressImageToUnder100Kb(rawFile);

    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    try {
      const result = await uploadToImgBB(file, apiKey);
      if (result.success && result.url) {
        setUploadSuccess(true);
        setPreviewUrl(result.url);
        onImageUploaded(result.url);
      } else {
        setErrorMessage(result.error || 'ImgBB upload failed. Check API key or network.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveApiKey = () => {
    setImgbbApiKey(apiKey);
    setShowApiKeySetting(false);
  };

  const handleDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onImageUploaded(url);
  };

  return (
    <div className="space-y-3 bg-[#F9FAF6] p-3.5 rounded-2xl border border-[#DFE7D5]">
      {/* Header with Mode Toggle & API Key Trigger */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#1C2518] flex items-center gap-1.5">
          <ImageIcon size={14} className="text-[#FF5722]" />
          {label}
        </label>
        <div className="flex items-center gap-1">
          <div className="inline-flex rounded-lg bg-[#EAEFE3] p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                mode === 'upload' ? 'bg-white text-[#182313] shadow-xs' : 'text-[#627359]'
              }`}
            >
              ImgBB File
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                mode === 'url' ? 'bg-white text-[#182313] shadow-xs' : 'text-[#627359]'
              }`}
            >
              Direct URL
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowApiKeySetting(!showApiKeySetting)}
            className="p-1 rounded-md text-[#66775D] hover:bg-[#EAEFE3] hover:text-[#192414] transition-colors"
            title="Configure ImgBB API Key"
          >
            <Key size={13} />
          </button>
        </div>
      </div>

      {/* API Key Drawer (Optional / Expandable) */}
      {showApiKeySetting && (
        <div className="p-2.5 bg-white rounded-xl border border-[#DFE7D5] space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#1C2518]">ImgBB API Key:</span>
            <a
              href="https://api.imgbb.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#5B8820] hover:underline"
            >
              Get free key (api.imgbb.com)
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g. 0a7893b86022e038848db907a9e33418"
              className="flex-1 text-xs px-2.5 py-1 rounded-lg border border-[#DFE7D5] focus:outline-none focus:border-[#FF5722]"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-2.5 py-1 bg-[#FF5722] text-white text-[11px] font-bold rounded-lg hover:bg-[#7CA235]"
            >
              Save
            </button>
          </div>
          <p className="text-[10px] text-[#7E8D76]">
            ImgBB gives you 100% free permanent direct image links hosted on worldwide CDNs.
          </p>
        </div>
      )}

      {/* Main Upload / Input Area */}
      {mode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
              isUploading
                ? 'bg-white/80 border-[#FF5722]'
                : 'border-[#CBD7BF] bg-white hover:border-[#FF5722] hover:bg-[#F4F8ED]'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 size={24} className="animate-spin text-[#FF5722]" />
                <span className="text-xs font-bold text-[#1F2C1A]">Uploading to ImgBB CDN...</span>
                <span className="text-[10px] text-[#71826B]">Generating permanent link for Firebase</span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 size={24} className="text-[#5B8820]" />
                <span className="text-xs font-bold text-[#1F2C1A]">Hosted on ImgBB Successfully!</span>
                <span className="text-[10px] text-[#71826B] truncate max-w-[240px]">{previewUrl}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 text-[11px] font-bold text-[#5B8820] hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={11} /> Change image
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#EBF3DE] text-[#4F781E] flex items-center justify-center">
                  <UploadCloud size={20} />
                </div>
                <div className="text-xs font-bold text-[#1C2518]">
                  Click to select photo or take picture
                </div>
                <div className="text-[10px] text-[#7A8A73]">
                  JPG, PNG, WEBP • Uploads instantly to ImgBB
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative">
            <Link2 size={14} className="absolute left-3 top-3 text-[#7B8B74]" />
            <input
              type="text"
              value={previewUrl}
              onChange={handleDirectUrlChange}
              placeholder="https://i.ibb.co/..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#D5DFCC] bg-white focus:outline-none focus:border-[#FF5722]"
            />
          </div>
          <p className="text-[10px] text-[#7A8A73]">Paste any direct image URL</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          <AlertCircle size={14} className="shrink-0" />
          <span className="text-[11px]">{errorMessage}</span>
        </div>
      )}

      {/* Preview Thumbnail */}
      {previewUrl && (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#DFE7D5]">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover border border-[#D5DFCC] shrink-0"
            onError={() => {}}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#1C2518] block truncate">
              {previewUrl.startsWith('data:') ? 'Local preview (ready to upload)' : previewUrl}
            </span>
            <span className="text-[9.5px] text-[#7E8E78] block truncate">
              {previewUrl.includes('ibb.co') ? '✓ Stored on ImgBB CDN' : 'Firebase Ready URL'}
            </span>
          </div>
        </div>
      )}

      <p className="text-[10px] text-[#84947D] leading-tight">{helperText}</p>
    </div>
  );
};
