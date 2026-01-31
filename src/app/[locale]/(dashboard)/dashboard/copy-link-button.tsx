"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface Props {
  url: string;
}

export function CopyLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Gekopieerd
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Kopieer
        </>
      )}
    </Button>
  );
}
