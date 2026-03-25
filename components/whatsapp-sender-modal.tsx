"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Copy, Check, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppSenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    title: string;
    location: string;
    owner_name: string | null;
    phone_number: string | null;
  };
}

export function WhatsAppSenderModal({
  open,
  onOpenChange,
  listing,
}: WhatsAppSenderModalProps) {
  const [copied, setCopied] = useState(false);
  const { locale } = useLocale();
  const { toast } = useToast();
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).prospectingModals.whatsappSender,
    [locale]
  );

  const agentName = "Marco Rossi";

  const ownerForMessage = listing.owner_name?.trim() || t.messageOwnerFallback;
  const ownerForDescription = listing.owner_name?.trim() || t.descriptionOwnerFallback;

  const message = useMemo(() => {
    return t.messageTemplate
      .replace(/\{owner\}/g, ownerForMessage)
      .replace(/\{agentName\}/g, agentName)
      .replace(/\{location\}/g, listing.location);
  }, [t.messageTemplate, ownerForMessage, listing.location, agentName]);

  const descriptionText = useMemo(
    () => t.description.replace(/\{owner\}/g, ownerForDescription),
    [t.description, ownerForDescription]
  );

  const phoneNumber = listing.phone_number?.replace(/[^\d+]/g, "") || "";
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : "#";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t.clipboardErrorTitle,
        description: t.clipboardErrorDesc,
        variant: "destructive",
      });
    }
  };

  const handleOpenWhatsApp = () => {
    if (whatsappUrl !== "#") {
      window.open(whatsappUrl, "_blank");
      fetch("/api/prospecting/whatsapp-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.id,
          action: "opened",
        }),
      }).catch(console.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Send className="h-6 w-6 text-cyan-400" aria-hidden />
            {t.dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">{descriptionText}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Card className="bg-[#111111] border-purple-500/30">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t.previewLabel}
                  </span>
                  <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 text-xs">
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-400" aria-hidden />
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" aria-hidden />
                        {t.copy}
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-purple-500/20">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{t.recipient}</p>
              <p className="text-sm font-semibold text-white">{listing.owner_name || "N/A"}</p>
            </div>
            <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{t.phone}</p>
              <p className="text-sm font-semibold text-white">{listing.phone_number || "N/A"}</p>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">
              <strong className="text-purple-400">{t.noteLead}</strong> {t.note}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              {t.cancel}
            </Button>
            <Button
              onClick={handleOpenWhatsApp}
              disabled={!phoneNumber}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" aria-hidden />
              {t.openWhatsApp}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
