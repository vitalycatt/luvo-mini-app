import { useEffect, useState } from "react";

export const AnimatedText = ({ lines, baseDelay = 200, wordDelay = 80 }) => {
  const [visibleWords, setVisibleWords] = useState(new Set());

  useEffect(() => {
    let wordIndex = 0;

    lines.forEach((line, lineIndex) => {
      const words = line.split(" ");

      words.forEach((_, wordIdx) => {
        const key = `${lineIndex}-${wordIdx}`;
        const delay = baseDelay + wordIndex * wordDelay;

        setTimeout(() => {
          setVisibleWords((prev) => new Set([...prev, key]));
        }, delay);

        wordIndex++;
      });
    });
  }, [lines, baseDelay, wordDelay]);

  return (
    <div className="space-y-0">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="overflow-hidden">
          <h1 className="text-[28px] font-bold leading-tight">
            {line.split(" ").map((word, wordIdx) => {
              const key = `${lineIndex}-${wordIdx}`;
              const isVisible = visibleWords.has(key);

              return (
                <span
                  key={key}
                  className={`inline-block mr-[0.3em] transition-all ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDuration: "600ms",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h1>
        </div>
      ))}
    </div>
  );
};
