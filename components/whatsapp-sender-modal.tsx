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
import { useState } from "react";

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

  // Mock: in produzione verrebbe dal profilo utente
  const agentName = "Marco Rossi"; // Sostituire con dati reali

  const message = `Ciao ${listing.owner_name || 'Signore/Signora'}, sono ${agentName}, agente immobiliare di PropertyPilot AI.

Ho sviluppato una visione 3D per il tuo immobile in ${listing.location} che mostra il potenziale post-ristrutturazione.

Vorrei condividere con te questo progetto personalizzato. Sarebbe disponibile per una breve chiamata questa settimana per discuterne?

Cordiali saluti,
${agentName}
PropertyPilot AI`;

  const phoneNumber = listing.phone_number?.replace(/[^\d+]/g, '') || '';
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : '#';

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (whatsappUrl !== '#') {
      window.open(whatsappUrl, '_blank');
      // Traccia apertura (in produzione salveresti nel DB)
      fetch('/api/prospecting/whatsapp-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          action: 'opened',
        }),
      }).catch(console.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Send className="h-6 w-6 text-cyan-400" />
            Invia Progetto via WhatsApp
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Anteprima del messaggio che verrà inviato a {listing.owner_name || 'il proprietario'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Preview Messaggio */}
          <Card className="bg-[#111111] border-purple-500/30">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Anteprima Messaggio
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="h-7 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-400" />
                        Copiato
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copia
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-purple-500/20">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Destinatario */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Destinatario</p>
              <p className="text-sm font-semibold text-white">
                {listing.owner_name || 'N/A'}
              </p>
            </div>
            <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Telefono</p>
              <p className="text-sm font-semibold text-white">
                {listing.phone_number || 'N/A'}
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">
              <strong className="text-purple-400">Nota:</strong> Cliccando "Apri WhatsApp", 
              si aprirà l'app WhatsApp con il messaggio pre-compilato. Il destinatario dovrà 
              confermare l'invio.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              Annulla
            </Button>
            <Button
              onClick={handleOpenWhatsApp}
              disabled={!phoneNumber}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apri WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

