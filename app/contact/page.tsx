"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Mail,
  Send,
  Check,
  Loader2,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim() || !email.trim()) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: name + ": " + message, source: "contact_page" }),
      });
    } catch {
      // still show sent
    }
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="text-sm h-9 bg-foreground text-background hover:bg-foreground/90 rounded-lg">
              Get started free
            </Button>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Get in touch</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Have a question about PropertyPilot? Want to learn how AI can help your agency?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="pp-card p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message sent!</h3>
                  <p className="text-muted-foreground">We will get back to you within 2 hours.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">Send us a message</h2>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us how we can help..." rows={5} />
                  </div>
                  <Button onClick={handleSend} disabled={sending || !message.trim() || !email.trim()} className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-lg h-11">
                    {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {sending ? "Sending..." : "Send message"}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="pp-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">support@propertypilot.ai</p>
                  </div>
                </div>
              </div>
              <div className="pp-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response time</h3>
                    <p className="text-sm text-muted-foreground">Within 2 hours (9AM-6PM CET)</p>
                  </div>
                </div>
              </div>
              <div className="pp-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Languages</h3>
                    <p className="text-sm text-muted-foreground">IT, EN, FR, ES, AR — write in any language</p>
                  </div>
                </div>
              </div>
              <div className="pp-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">For agencies</h3>
                    <p className="text-sm text-muted-foreground">Want a demo? Book a 15-min call.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
