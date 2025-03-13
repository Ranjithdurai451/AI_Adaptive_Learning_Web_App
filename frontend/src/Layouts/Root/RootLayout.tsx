import { useTheme } from "@/components/ui/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import BackgroundPaths from "./components/BackgroundPaths";

export default function RootLayout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {location.pathname === "/" && <BackgroundPaths />}
      <div className="h-dvh w-dvw overflow-hidden flex flex-col">
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border flex justify-between items-center p-4">
          <Link to={"/"} className=" text-xl font-bold">
            SparkLearn
          </Link>
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-200"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 flex-grow overflow-auto z-3 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </>
  );
}
