import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardCheck, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  "aria-label"?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  filename,
  language = "jsx",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Map file extensions to proper syntax highlighting language names
  const getLanguageFromFilename = (filename: string): string => {
    const extension = filename?.split(".").pop()?.toLowerCase();
    const extensionMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      rb: "ruby",
      java: "java",
      php: "php",
      go: "go",
      rs: "rust",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      swift: "swift",
      kt: "kotlin",
      sql: "sql",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      md: "markdown",
      yml: "yaml",
      yaml: "yaml",
      sh: "bash",
      bash: "bash",
      dart: "dart",
    };

    return extension ? extensionMap[extension] || "text" : "text";
  };

  const detectedLanguage = filename
    ? getLanguageFromFilename(filename)
    : language;

  return (
    <div className="rounded-md border border-[#2a2a2a] bg-[#1e1e1e] w-full my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-[#2a2a2a]">
        <div className="text-sm font-mono text-[a1a1a1]">
          {filename || detectedLanguage}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[#2a2a2a] hover:bg-gray-600 text-gray-200 transition"
        >
          {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>
      <SyntaxHighlighter
        language={detectedLanguage}
        style={dracula}
        showLineNumbers
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
