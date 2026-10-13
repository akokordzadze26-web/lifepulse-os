"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const translations: Record<string, any> = {
  en: {
    back: "← Back to Home",
    title: "Media Vault & Camera",
    takePhoto: "📷 Take Photo",
    capture: "📸 Capture",
    switchCamera: "🔄 Switch Camera",
    closeCamera: "✕ Close",
    uploadFile: "📁 Upload File",
    galleryTitle: "🖼️ Your Media Gallery",
    emptyGallery: "Gallery is empty",
    emptySub: "Take a photo with the camera or upload a file.",
    delete: "Delete",
    zoomIn: "🔍 Zoom In",
    zoomOut: "🔍 Zoom Out",
    resetZoom: "↺ Reset",
    closePreview: "✕ Close",
  },
  ka: {
    back: "← მთავარზე დაბრუნება",
    title: "მედია ვოლტი & კამერა",
    takePhoto: "📷 ფოტოს გადაღება",
    capture: "📸 გადაღება",
    switchCamera: "🔄 კამერის შეცვლა",
    closeCamera: "✕ დახურვა",
    uploadFile: "📁 ფაილის ატვირთვა",
    galleryTitle: "🖼️ შენი მედია გალერეა",
    emptyGallery: "გალერეა ცარიელია",
    emptySub: "გადაიღე ფოტო კამერით ან ატვირთე ფაილი.",
    delete: "წაშლა",
    zoomIn: "🔍 გადიდება",
    zoomOut: "🔍 დაპატარავება",
    resetZoom: "↺ საწყისი",
    closePreview: "✕ დახურვა",
  },
  ru: {
    back: "← На главную",
    title: "Хранилище медиа и камера",
    takePhoto: "📷 Сделать фото",
    capture: "📸 Снять",
    switchCamera: "🔄 Переключить камеру",
    closeCamera: "✕ Закрыть",
    uploadFile: "📁 Загрузить файл",
    galleryTitle: "🖼️ Ваша медиагалерея",
    emptyGallery: "Галерея пуста",
    emptySub: "Сделайте фото с помощью камеры или загрузите файл.",
    delete: "Удалить",
    zoomIn: "🔍 Увеличить",
    zoomOut: "🔍 Уменьшить",
    resetZoom: "↺ Сброс",
    closePreview: "✕ Закрыть",
  },
};

interface MediaItem {
  id: string;
  url: string;
  date: string;
}

export default function MediaPage() {
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // კამერის რეჟიმი: 'user' (წინა/სელფი) ან 'environment' (უკანა)
  const [cameraMode, setCameraMode] = useState<"user" | "environment">("user");

  // Lightbox Zoom state
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const loadSettings = () => {
    const savedLang = localStorage.getItem("lifepulse_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    const savedTheme = localStorage.getItem("lifepulse_theme");
    setIsDarkMode(savedTheme !== "light");
  };

  useEffect(() => {
    loadSettings();
    const handleLangChange = () => loadSettings();
    window.addEventListener("lifepulse_lang_change", handleLangChange);
    return () => window.removeEventListener("lifepulse_lang_change", handleLangChange);
  }, []);

  useEffect(() => {
    const savedMedia = localStorage.getItem("lifepulse_media");
    if (savedMedia) {
      try {
        setMediaList(JSON.parse(savedMedia));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const t = translations[lang] || translations.en;

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async (mode: "user" | "environment") => {
    stopCamera();
    setIsCameraActive(true);
    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraActive(false);
    }
  }, [stopCamera]);

  // კამერის რეჟიმის გადართვა (წინა <-> უკანა)
  const toggleCameraMode = () => {
    const nextMode = cameraMode === "user" ? "environment" : "user";
    setCameraMode(nextMode);
    startCamera(nextMode);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // თუ წინა კამერაა და გადაღებისას გინდა რომ სარკისებრი არ იყოს, უბრალოდ ვხატავთ ჩვეულებრივად
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        const newItem: MediaItem = {
          id: Date.now().toString(),
          url: dataUrl,
          date: new Date().toLocaleString(),
        };
        const updated = [newItem, ...mediaList];
        setMediaList(updated);
        localStorage.setItem("lifepulse_media", JSON.stringify(updated));
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newItem: MediaItem = {
            id: Date.now().toString() + Math.random(),
            url: event.target.result as string,
            date: new Date().toLocaleString(),
          };
          setMediaList((prev) => {
            const updated = [newItem, ...prev];
            localStorage.setItem("lifepulse_media", JSON.stringify(updated));
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteMedia = (id: string) => {
    const updated = mediaList.filter((item) => item.id !== id);
    setMediaList(updated);
    localStorage.setItem("lifepulse_media", JSON.stringify(updated));
  };

  const openPreview = (url: string) => {
    setActivePreview(url);
    setZoomScale(1);
  };

  const closePreview = () => {
    setActivePreview(null);
    setZoomScale(1);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-12 transition-colors duration-300 relative overflow-hidden ${
      isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#FDFBF7] text-[#2C221E]"
    }`}>
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-fade-in relative z-10">
        
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-6 flex-wrap gap-4 glass-card ${
          isDarkMode ? "border-zinc-800/80" : "border-[#E5DFD3]"
        }`}>
          <Link 
            href="/" 
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold smooth-transition flex items-center gap-2 border cursor-pointer ${
              isDarkMode 
                ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800" 
                : "bg-white/80 hover:bg-[#EFECE6] text-[#2C221E] border-[#DCD6C8]"
            }`}
          >
            {t.back}
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xl">📸</span>
            <h1 className="text-xl font-extrabold tracking-tight">{t.title}</h1>
          </div>
        </div>

        {/* Camera Modal */}
        {isCameraActive && (
          <div className="p-6 rounded-3xl border bg-black/90 border-zinc-800 space-y-4 text-center glass-card">
            <div className="relative w-full max-w-lg mx-auto h-72 rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                // სელფის რეჟიმში ვიდეო არის სარკისებრი (scale-x-[-1]), ხოლო უკანა კამერისას ჩვეულებრივი
                className={`w-full h-full object-cover ${cameraMode === "user" ? "scale-x-[-1]" : ""}`} 
              />
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={toggleCameraMode}
                className="px-5 py-3 rounded-2xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer smooth-transition"
              >
                {t.switchCamera}
              </button>
              <button
                onClick={capturePhoto}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer smooth-transition"
              >
                {t.capture}
              </button>
              <button
                onClick={stopCamera}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white cursor-pointer smooth-transition"
              >
                {t.closeCamera}
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              setCameraMode("user"); // ნაგულისხმევად ირთვება წინა კამერა (სელფი)
              startCamera("user");
            }}
            className={`px-6 py-3.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer shadow-md ${
              isDarkMode ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-100" : "bg-white border-[#DCD6C8] hover:bg-[#F4F0EA] text-[#2C221E]"
            }`}
          >
            {t.takePhoto}
          </button>

          <label className={`px-6 py-3.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer shadow-md ${
            isDarkMode ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-100" : "bg-white border-[#DCD6C8] hover:bg-[#F4F0EA] text-[#2C221E]"
          }`}>
            {t.uploadFile}
            <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Gallery Section */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <h2 className="text-base font-bold">{t.galleryTitle}</h2>

          {mediaList.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <div className="text-3xl">🖼️</div>
              <p className="text-sm font-semibold">{t.emptyGallery}</p>
              <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-[#7B6E63]"}`}>{t.emptySub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mediaList.map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-md">
                  <img
                    src={item.url}
                    alt="Media"
                    onClick={() => openPreview(item.url)}
                    className="w-full h-48 object-cover cursor-zoom-in group-hover:scale-105 smooth-transition"
                  />
                  {/* თარიღი ზედა კუთხეში */}
<div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-lg pointer-events-none">
  <p className="text-[10px] text-zinc-300">{item.date}</p>
</div>

{/* წაშლის ღილაკი: მუდმივად ჩანს ტელეფონზეც და კომპიუტერზეც */}
<button
  onClick={(e) => {
    e.stopPropagation();
    deleteMedia(item.id);
  }}
  onTouchStart={(e) => e.stopPropagation()}
  className="absolute top-2 right-2 px-3 py-1.5 rounded-xl text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer shadow-lg active:scale-95 z-20"
>
  🗑️ {t.delete}
</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Interactive Lightbox / Photo Zoom Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 animate-fade-in">
          
          {/* Top Control Bar */}
          <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
            <div className="flex gap-2">
              <button
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.5, 4))}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer transition-all"
              >
                {t.zoomIn}
              </button>
              <button
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.5, 0.5))}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer transition-all"
              >
                {t.zoomOut}
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer transition-all"
              >
                {t.resetZoom}
              </button>
            </div>

            <button
              onClick={closePreview}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-all"
            >
              {t.closePreview}
            </button>
          </div>

          {/* Zoomable Image Canvas */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={activePreview}
              alt="Zoomed Preview"
              style={{ transform: `scale(${zoomScale})` }}
              className="max-h-[80vh] max-w-full object-contain smooth-transition rounded-2xl shadow-2xl cursor-grab"
            />
          </div>

          <p className="text-center text-xs text-zinc-500">
            LifePulse OS — Photo Viewer.
          </p>
        </div>
      )}

      <footer className="text-center text-xs text-zinc-500 py-6 relative z-10">
        LifePulse OS — Premium Edition.
      </footer>
    </div>
  );
}