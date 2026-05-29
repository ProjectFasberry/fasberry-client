import { Icon } from "@/shared/ui/icon"
import { useState } from "react";

const CopyButton = ({ content }: { content: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-1 *:size-[14px] top-1 p-1 hover:bg-neutral-600 rounded-sm bg-neutral-700 transition-colors"
      aria-label="Копировать"
    >
      {isCopied
        ? <Icon name="sprite:check" className="text-green-400" />
        : <Icon name="sprite:copy" />
      }
    </button>
  )
}

export const Copy = ({ code }: { code: string }) => {
  return (
    <div className="relative overflow-hidden">
      <CopyButton content={code} />
      <pre className="pr-10">
        <code>{code}</code>
      </pre>
    </div>
  )
}
