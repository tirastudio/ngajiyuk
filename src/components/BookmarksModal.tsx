import React from 'react';
import { Bookmark } from '../types/quran';
import { X, Trash2, ArrowRight, Bookmark as BookmarkIcon, BookOpen } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Daftar Bookmark Ayat
              </h3>
              <p className="text-xs text-stone-500">
                {bookmarks.length} ayat tersimpan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 font-semibold p-1.5"
                title="Hapus Semua Bookmark"
              >
                Hapus Semua
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <BookmarkIcon className="w-12 h-12 mx-auto text-stone-300" />
              <p className="font-bold text-stone-700 text-sm">Belum ada ayat yang ditandai</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Saat membaca surah, klik ikon bookmark di samping ayat untuk menyimpannya ke daftar ini.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-400 bg-stone-50/50 hover:bg-white transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    QS. {bm.surahName} : {bm.ayahNumber}
                  </span>

                  <button
                    onClick={() => onRemoveBookmark(bm.id)}
                    className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                    title="Hapus bookmark ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-arabic text-right text-stone-900 text-base leading-relaxed line-clamp-1" dir="rtl">
                  {bm.arabSnippet}...
                </p>

                <p className="text-xs text-stone-600 line-clamp-2 italic">
                  "{bm.translationSnippet}..."
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Lanjutkan Membaca</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
