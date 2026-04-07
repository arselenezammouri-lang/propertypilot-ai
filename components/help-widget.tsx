"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  X,
  Send,
  Book,
  Mail,
  ExternalLink,
  Loader2,
  Check,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I generate a listing?",
    a: "Go to Dashboard → Generate Listing, fill in the property details, and click Generate. AI creates 5 professional variants in seconds.",
  },
  {
    q: "How do I upgrade my plan?",
    a: "Go to Dashboard → Billing or click any upgrade prompt. You'll be redirected to Stripe Checkout to complete payment.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Go to Billing → Manage Subscription. No lock-in, no penalties. Your access continues until the end of the billing period.",
  },
  {
    q: "How many listings can I generate?",
    a: "Starter: 50/month, Pro: 200/month, Agency: Unlimited. Free trial includes 5 listings.",
  },
  {
    q: "Which languages are supported?",
    a: "Italian, English, French, Spanish, German, and Arabic. All AI-generated, not machine translation.",
  },
];

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"menu" | "faq" | "contact">("menu");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, source: "help_widget" }),
      });
      setSent(true);
    } catch {
      // still show sent
      setSent(true);
    }
    setSending(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
        aria-label="Help"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[520px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-foreground text-background">
        <div>
          <h3 className="font-semibold text-sm">PropertyPilot Support</h3>
          <p className="text-xs opacity-70">We typically reply within 2 hours</p>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setView("menu");
            setSent(false);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {view === "menu" && (
          <div className="space-y-3">
            <button
              onClick={() => setView("faq")}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Book className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">FAQ</p>
                <p className="text-xs text-muted-foreground">Quick answers to common questions</p>
              </div>
            </button>
            <button
              onClick={() => setView("contact")}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Contact Us</p>
                <p className="text-xs text-muted-foreground">Send a message to our team</p>
              </div>
            </button>
            <a
              href="/blog"
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Blog & Guides</p>
                <p className="text-xs text-muted-foreground">Tips to get the most out of AI</p>
              </div>
            </a>
          </div>
        )}

        {view === "faq" && (
          <div className="space-y-2">
            <button
              onClick={() => setView("menu")}
              className="text-xs text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
            >
              ← Back
            </button>
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors text-sm font-medium list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-3 py-2 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        )}

        {view === "contact" && (
          <div className="space-y-4">
            <button
              onClick={() => setView("menu")}
              className="text-xs text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
            >
              ← Back
            </button>
            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-semibold mb-1">Message sent!</h4>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll get back to you within 2 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Input
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-lg"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {sending ? "Sending..." : "Send message"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
