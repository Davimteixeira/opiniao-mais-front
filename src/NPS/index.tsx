import React, { useState } from "react";
import { Frown, MehIcon, SmileIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Rating = 1 | 2 | 3 | 4 | 5;

type Period = "7d" | "30d" | "90d" | "12m";

export default function NPS() {
  const [rating, setRating] = useState<Rating | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating !== null) {
      toast.success("Avaliação enviada com sucesso!");
      setRating(null);
      setFeedback("");
    }
  };

  const getEmojiForRating = (value: number) => {
    const baseClass = "w-6 h-6";
    switch (value) {
      case 1:
        return <Frown className={`${baseClass} text-red-500`} />;
      case 2:
        return <MehIcon className={`${baseClass} text-red-400`} />;
      case 3:
        return <MehIcon className={`${baseClass} text-yellow-500`} />;
      case 4:
        return <SmileIcon className={`${baseClass} text-green-400`} />;
      case 5:
        return <SmileIcon className={`${baseClass} text-green-500`} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="max-w-2xl w-full px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Você ficou satisfeito com nosso atendimento?
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex justify-between items-center max-w-md mx-auto mb-4 gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value as Rating)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110
                      ${rating === value ? "bg-gray-100 scale-110" : ""}`}
                    >
                      <div className="transform scale-125 sm:scale-150">
                        {getEmojiForRating(value)}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  <span>Muito insatisfeito</span>
                  <span>Muito satisfeito</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={rating === null}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
