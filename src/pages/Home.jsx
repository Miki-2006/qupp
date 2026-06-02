import { useState, useEffect, useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import fetchDailyQuote from "../storage/fetchDailyQuote";

export default function Home({favoriteQuotes, setFavoriteQuotes, handleToggleFavorite}) {
  const navigate = useNavigate();
  const [dailyQuote, setDailyQuote] = useState(null);
  const shareCardRef = useRef(null);

  useEffect(() => {
    const getDailyQuote = async () => {
      const data = await fetchDailyQuote();
      if (data) {
        setDailyQuote(data);
      }
    };

    getDailyQuote();
  }, []);

  const handleDownloadImage = async () => {
    if (!shareCardRef.current || !dailyQuote) return;
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "qupp-daily-quote.png";
      link.click();
    } catch (error) {
      console.error("Error in downloading quote image:", error);
    }
  };

  const handleShareImage = async () => {
    if (!shareCardRef.current || !dailyQuote) return;
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "qupp-daily-quote.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Daily quote by qupp",
          });
        } else {
          handleDownloadImage();
        }
      }, "image/png");
    } catch (error) {
      console.error("Error in sharing quote image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {dailyQuote && (
          <Card className="bg-white/90 border-brand-100 rounded-3xl p-5 space-y-4">
            <div
              ref={shareCardRef}
              className="relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br from-brand-500 via-brand-700 to-accent-500 text-white shadow-xl min-h-[320px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
              <div className="relative z-10 h-full flex flex-col">
                <img
                  src="/qupp-logo.png"
                  alt="qupp logo"
                  className="h-10 w-auto object-contain brightness-0 invert opacity-95 mx-auto mb-5"
                />
                <p className="text-center text-base md:text-lg font-semibold tracking-wide mb-5">
                  Quote of the Day
                </p>
                <p className="text-lg md:text-xl italic leading-relaxed mb-5 text-center">
                  "{dailyQuote.quote}"
                </p>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100 text-center">
                  — {dailyQuote.author}
                </p>

                <div className="mt-auto pt-5">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-cyan-100">
                    {dailyQuote.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleDownloadImage}
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Download quote image"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleShareImage}
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Share quote image"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {!dailyQuote && (
          <Card className="bg-white/90 border-brand-100 rounded-3xl p-6 text-center">
            <p className="text-slate-600">Loading today's inspiration...</p>
          </Card>
        )}

        <div className="text-center py-8">
          <p className="text-brand-700 text-sm mb-4">
            Want to get quote test your personality?
          </p>
          <Button
            onClick={() => navigate("/quiz")}
            className="rounded-full px-8 py-6 text-lg font-semibold shadow-xl"
          >
            Test your personality
          </Button>
        </div>
      </div>
    </div>
  );
}
