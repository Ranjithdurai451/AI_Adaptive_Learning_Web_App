import React, { useEffect, useState, useRef } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SparkLoaderProps {
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

const SparkLoader: React.FC<SparkLoaderProps> = ({
  onComplete,
  duration = 3000,
  className,
}) => {
  const [stage, setStage] = useState<"spark" | "expand" | "book" | "complete">(
    "spark"
  );
  const [isVisible, setIsVisible] = useState(true);
  const sparkRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  // Function to create spark particles
  const createParticles = () => {
    if (!containerRef.current || !bookRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const bookRect = bookRef.current.getBoundingClientRect();

    // Calculate position relative to the container - use the book as center
    const centerX = bookRect.left - containerRect.left + bookRect.width / 2;
    const centerY = bookRect.top - containerRect.top + bookRect.height / 2;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.classList.add("spark-particle");

      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = "currentColor";
      particle.style.position = "absolute";
      particle.style.borderRadius = "50%";
      particle.style.zIndex = "60";
      particle.style.pointerEvents = "none";

      // Position at the center of the book
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 30; // Longer distance
      const duration = Math.random() * 0.6 + 0.4; // 0.4-1.0s

      // Apply animation
      particle.style.animation = `particleMove ${duration}s ease-out forwards`;
      particle.style.setProperty(
        "--translateX",
        `${Math.cos(angle) * distance}px`
      );
      particle.style.setProperty(
        "--translateY",
        `${Math.sin(angle) * distance}px`
      );

      // Add to container
      containerRef.current.appendChild(particle);
      particlesRef.current.push(particle);

      // Auto-remove after animation
      setTimeout(() => {
        if (containerRef.current?.contains(particle)) {
          containerRef.current.removeChild(particle);
        }
      }, duration * 1000);
    }
  };

  useEffect(() => {
    const timeline = async () => {
      // Initial spark animation
      setStage("spark");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Expand the spark
      setStage("expand");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Transform to book
      setStage("book");
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Complete the animation
      setStage("complete");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create the spark particles at the end
      createParticles();

      // Wait for particles to finish before fading out
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Fade out the loader
      setIsVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (onComplete) onComplete();
    };

    // Start the animation sequence
    const timer = setTimeout(() => {
      timeline();
    }, 200);

    return () => {
      clearTimeout(timer);
      // Clean up any remaining particles
      particlesRef.current.forEach((particle) => {
        if (containerRef.current?.contains(particle)) {
          containerRef.current.removeChild(particle);
        }
      });
    };
  }, [onComplete, duration]);

  return (
    <>
      {/* Add the keyframes for particle animation */}
      <style>{`
        @keyframes particleMove {
          0% {
            opacity: 1;
            transform: translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: translate(var(--translateX), var(--translateY));
          }
        }
        @keyframes flicker {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes spark {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes book-open {
          0% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          className
        )}
        ref={containerRef}
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Initial spark */}
          <div
            ref={sparkRef}
            className={cn(
              "absolute transition-all duration-700 ease-out",
              stage === "spark" ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
          >
            <div className="w-8 h-8 relative text-foreground">
              <Sparkles className="w-full h-full animate-spark" />
              <div className="absolute inset-0 animate-flicker">
                <Sparkles className="w-full h-full opacity-70" />
              </div>
            </div>
          </div>

          {/* Expanding spark */}
          <div
            className={cn(
              "absolute w-24 h-24 rounded-full border-2 border-foreground transition-all duration-700 ease-out",
              stage === "expand" ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
          >
            <div className="absolute inset-0 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-foreground/10" />
            </div>
            <div className="absolute inset-0 rounded-full animate-rotate">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground" />
            </div>
          </div>

          {/* Book transformation */}
          <div
            ref={bookRef}
            className={cn(
              "absolute transition-all duration-700 ease-out",
              stage === "book" || stage === "complete"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0"
            )}
          >
            <div className="relative w-16 h-16 animate-book-open">
              <BookOpen
                className="w-full h-full text-foreground"
                strokeWidth={1.5}
              />
              <div className="absolute inset-0 animate-flicker opacity-50">
                <BookOpen
                  className="w-full h-full text-foreground"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding text that appears in final stage */}
        <div
          className={cn(
            "absolute top-[55%] left-1/2 -translate-x-1/2 transition-all duration-500 ease-out",
            stage === "complete"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <div className="text-center">
            <h1 className="font-semibold text-2xl tracking-tight">
              sparkLearn
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ignite your knowledge
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SparkLoader;
