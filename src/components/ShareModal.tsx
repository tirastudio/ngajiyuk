import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Facebook, AtSign } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  text,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleTelegram = () => {
    const encoded = encodeURIComponent(text);
    window.open(`https://t.me/share/url?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const encodedQuote = encodeURIComponent(text);
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedQuote}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleThreads = () => {
    const encoded = encodeURIComponent(text);
    window.open(`https://www.threads.net/intent/post?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
      }).catch(() => {
        // user cancelled
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Bagikan ke Media Sosial
              </h3>
              <p className="text-xs text-stone-500">{title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Preview */}
        <div className="p-5 space-y-4">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
            {text}
          </div>

          {/* Social Share Buttons: WhatsApp, Telegram, Facebook, Threads */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              id="share-btn-whatsapp"
              onClick={handleWhatsApp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-2xs">
                <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
              </div>
              <span className="text-xs font-bold">WhatsApp</span>
            </button>

            <button
              id="share-btn-telegram"
              onClick={handleTelegram}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center mb-1.5 shadow-2xs">
                <Send className="w-4 h-4 fill-white text-sky-500 ml-0.5" />
              </div>
              <span className="text-xs font-bold">Telegram</span>
            </button>

            <button
              id="share-btn-facebook"
              onClick={handleFacebook}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-2xs">
                <Facebook className="w-4 h-4 fill-white text-blue-600" />
              </div>
              <span className="text-xs font-bold">Facebook</span>
            </button>

            <button
              id="share-btn-threads"
              onClick={handleThreads}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300/80 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-1.5 shadow-2xs">
                <AtSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold">Threads</span>
            </button>
          </div>

          {/* Direct Copy & Native Share buttons */}
          <div className="pt-1 flex gap-2">
            <button
              id="share-btn-copy"
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer border border-stone-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin ke Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks Lengkap</span>
                </>
              )}
            </button>

            {'share' in navigator && (
              <button
                id="share-btn-native"
                onClick={handleNativeShare}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Lainnya</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
