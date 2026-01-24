import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  currentImageUrl?: string | null;
  onImageDelete?: () => Promise<void>;
  isUploading?: boolean;
}

const ImageUpload = ({
  onImageUpload,
  currentImageUrl,
  onImageDelete,
  isUploading = false,
}: ImageUploadProps) => {
  const { isRTL } = useLanguage();
  const [dragActive, setDragActive] = useState(false);

  // ✅ Detect phone/tablet (touch / coarse pointer)
  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    const hasTouch =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints ?? 0) > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    const coarsePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    return hasTouch || coarsePointer;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    disabled: isUploading,
    noClick: isTouchDevice, // ✅ on mobile we will use a button instead of clicking dropzone
    noKeyboard: isTouchDevice,
  });

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Product"
            className="w-full h-48 object-cover rounded-lg border border-luxury-beige"
          />
          {onImageDelete && !isUploading && (
            <button
              onClick={onImageDelete}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
              title={isRTL ? "حذف الصورة" : "Delete image"}
              type="button"
            >
              <X size={16} />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="text-white animate-spin" size={32} />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ✅ MOBILE UI: button for gallery */}
          {isTouchDevice ? (
            <div className="border border-luxury-beige rounded-lg p-6 bg-luxury-white">
              <input {...getInputProps()} disabled={isUploading} />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-luxury-gold/20 flex items-center justify-center">
                  {isUploading ? (
                    <Loader2
                      className="text-luxury-gold animate-spin"
                      size={20}
                    />
                  ) : (
                    <ImageIcon className="text-luxury-gold" size={20} />
                  )}
                </div>
                <div>
                  <p
                    className={`text-luxury-black font-medium ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {isRTL ? "صورة المنتج" : "Product Image"}
                  </p>
                  <p
                    className={`text-luxury-black/60 text-sm ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {isRTL
                      ? "اختر صورة من المعرض"
                      : "Select an image from your gallery"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={open}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Upload size={18} />
                )}
                <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
                  {isUploading
                    ? isRTL
                      ? "جاري رفع الصورة..."
                      : "Uploading..."
                    : isRTL
                      ? "اختر من المعرض"
                      : "Select from gallery"}
                </span>
              </button>

              <p
                className={`text-luxury-black/60 text-sm mt-3 ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                {isRTL ? "PNG، JPG، WEBP حتى 10MB" : "PNG, JPG, WEBP up to 10MB"}
              </p>
            </div>
          ) : (
            /* ✅ DESKTOP UI: drag & drop zone */
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                ${isDragActive || dragActive
                  ? "border-luxury-gold bg-luxury-gold/10"
                  : "border-luxury-beige hover:border-luxury-gold hover:bg-luxury-beige/50"
                }
                ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
            >
              <input {...getInputProps()} disabled={isUploading} />
              <div className="space-y-4">
                {isUploading ? (
                  <Loader2
                    className="text-luxury-gold animate-spin mx-auto"
                    size={48}
                  />
                ) : (
                  <div className="flex justify-center">
                    {isDragActive || dragActive ? (
                      <Upload className="text-luxury-gold" size={48} />
                    ) : (
                      <ImageIcon className="text-luxury-black/40" size={48} />
                    )}
                  </div>
                )}
                <div>
                  <p
                    className={`text-luxury-black font-medium ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {isUploading
                      ? isRTL
                        ? "جاري رفع الصورة..."
                        : "Uploading image..."
                      : isDragActive || dragActive
                        ? isRTL
                          ? "اسقط الصورة هنا"
                          : "Drop the image here"
                        : isRTL
                          ? "اسحب وافلت صورة أو انقر للتحديد"
                          : "Drag & drop an image, or click to select"}
                  </p>
                  <p
                    className={`text-luxury-black/60 text-sm mt-2 ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {isRTL
                      ? "PNG، JPG، WEBP حتى 10MB"
                      : "PNG, JPG, WEBP up to 10MB"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUpload;
