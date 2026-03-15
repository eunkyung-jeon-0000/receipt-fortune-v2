import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ScrollText, Flame, Moon, Sun, Ghost, Wand2, RefreshCw, Camera, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getFortune, ReceiptData } from './services/gemini';

export default function App() {
  const [formData, setFormData] = useState<ReceiptData>({
    storeName: '',
    items: '',
    totalPrice: '',
    paymentTime: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFormData({
          ...formData,
          image: {
            data: base64String,
            mimeType: file.type,
          },
        });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFortune(null);
    
    const result = await getFortune(formData);
    setFortune(result);
    setLoading(false);
  };

  const handleReset = () => {
    setFortune(null);
    setFormData({
      storeName: '',
      items: '',
      totalPrice: '',
      paymentTime: '',
    });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mystical-bg min-h-screen flex flex-col items-center py-12 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 border border-purple-500/10 rounded-full"
            />
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter uppercase">
          영수증 점성술
        </h1>
        <p className="text-zinc-500 font-medium text-sm tracking-widest uppercase">
          Capitalist Shamanism • Future Insight
        </p>
      </motion.div>

      <main className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {!fortune ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 md:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload Area */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold flex items-center gap-2">
                    <Camera className="w-3 h-3 text-purple-500/70" /> Receipt Photo (Optional)
                  </label>
                  {!imagePreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors bg-zinc-950/50"
                    >
                      <Camera className="w-8 h-8 text-zinc-700 mb-2" />
                      <span className="text-zinc-600 text-xs">영수증 사진을 업로드하세요</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-800">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black rounded-full text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold flex items-center gap-2">
                      <Moon className="w-3 h-3 text-purple-500/70" /> Location
                    </label>
                    <input
                      type="text"
                      placeholder="상호명을 입력하세요 (사진 업로드 시 생략 가능)"
                      className="shaman-input w-full"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold flex items-center gap-2">
                        <Sun className="w-3 h-3 text-purple-500/70" /> Time
                      </label>
                      <input
                        type="text"
                        placeholder="결제 시간"
                        className="shaman-input w-full"
                        value={formData.paymentTime}
                        onChange={(e) => setFormData({ ...formData, paymentTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold flex items-center gap-2">
                        <Ghost className="w-3 h-3 text-purple-500/70" /> Amount
                      </label>
                      <input
                        type="text"
                        placeholder="결제 금액 (예: 12500)"
                        className="shaman-input w-full"
                        value={formData.totalPrice}
                        onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold flex items-center gap-2">
                    <ScrollText className="w-3 h-3 text-purple-500/70" /> Items
                  </label>
                  <textarea
                    rows={3}
                    placeholder="구매한 품목들을 입력하세요"
                    className="shaman-input w-full resize-none"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  />
                </div>

                <div className="pt-6">
                  <button
                    disabled={loading}
                    type="submit"
                    className="shaman-button w-full flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        ANALYZING...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        READ MY FORTUNE
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 md:p-12"
            >
              <div className="prose prose-invert max-w-none">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-purple-500 w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">Divine Result</span>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="fortune-content">
                  <ReactMarkdown
                    components={{
                      h3: ({ children }) => (
                        <h3>{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p>{children}</p>
                      ),
                    }}
                  >
                    {fortune}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-zinc-800 text-center">
                <button
                  onClick={handleReset}
                  className="text-zinc-500 hover:text-purple-500 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
                >
                  Analyze Another Receipt
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto pt-16 text-zinc-700 text-[10px] font-bold tracking-[0.3em] uppercase">
        © 2026 Shamanic OS • v1.0.4
      </footer>
    </div>
  );
}
