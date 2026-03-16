"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { hapticSuccess } from "@/lib/haptics";

interface ContactImportButtonProps {
  onPick: (contact: { name?: string; tel?: string }) => void;
}

declare global {
  interface Navigator {
    contacts?: {
      select: (properties: string[], options?: { multiple?: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
    };
  }
}

export default function ContactImportButton({ onPick }: ContactImportButtonProps) {
  const [loading, setLoading] = useState(false);
  const supported = typeof navigator !== "undefined" && !!navigator.contacts?.select;

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant="outlined"
      onClick={async () => {
        setLoading(true);
        try {
          const [contact] = await navigator.contacts!.select(["name", "tel"], { multiple: false });
          if (contact) {
            onPick({ name: contact.name?.[0], tel: contact.tel?.[0] });
            hapticSuccess();
          }
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Открываю контакты…" : "Из контактов"}
    </Button>
  );
}
