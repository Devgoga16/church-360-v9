import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch("/faq.json");
        const data = await response.json();
        setFaqs(data.faqs);
      } catch (error) {
        console.error("Error loading FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Cargando preguntas frecuentes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
        >
          <button
            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900 dark:text-white text-left">
              {faq.question}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform duration-200",
                expandedId === faq.id && "rotate-180",
              )}
            />
          </button>

          {expandedId === faq.id && (
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
