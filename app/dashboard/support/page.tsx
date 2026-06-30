'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  LifeBuoy, Send, Plus, Clock, CheckCircle2,
  AlertCircle, MessageSquare, ExternalLink, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


export default function SupportPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const isIT = locale === 'it';

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim() || !category) {
      toast({ title: isIT ? 'Errore' : 'Error', description: isIT ? 'Compila tutti i campi.' : 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    setSending(true);
    // In production, this would POST to /api/support
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setShowForm(false);
    setSubject('');
    setMessage('');
    setCategory('');
    toast({
      title: isIT ? 'Ticket creato!' : 'Ticket created!',
      description: isIT ? 'Ti risponderemo entro 24-48 ore.' : "We'll respond within 24-48 hours.",
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-primary/10">
          <LifeBuoy className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Supporto' : 'Support'}</h1>
          <p className="text-muted-foreground">{isIT ? 'Crea un ticket di supporto o consulta le risorse di aiuto' : 'Create a support ticket or browse help resources'}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => window.open('/help', '_blank')}>
            <CardContent className="p-4 text-center">
              <Search className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground text-sm">{isIT ? 'Centro Assistenza' : 'Help Center'}</p>
              <p className="text-xs text-muted-foreground">{isIT ? '31+ articoli e guide' : '31+ articles & guides'}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => window.open('/status', '_blank')}>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-foreground text-sm">{isIT ? 'Stato Servizi' : 'System Status'}</p>
              <p className="text-xs text-muted-foreground">{isIT ? 'Tutti operativi' : 'All operational'}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => window.open('/contact', '_blank')}>
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-foreground text-sm">{isIT ? 'Contattaci' : 'Contact Us'}</p>
              <p className="text-xs text-muted-foreground">support@propertypilotai.com</p>
            </CardContent>
          </Card>
        </div>

        {/* New Ticket */}
        {!showForm ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <LifeBuoy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Nessun ticket aperto' : 'No open tickets'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isIT
                  ? 'Hai bisogno di aiuto? Crea un ticket di supporto e ti risponderemo al più presto.'
                  : 'Need help? Create a support ticket and we\'ll get back to you as soon as possible.'}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {isIT ? 'Crea Ticket' : 'Create Ticket'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isIT ? 'Nuovo Ticket di Supporto' : 'New Support Ticket'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{isIT ? 'Categoria' : 'Category'}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={isIT ? 'Seleziona categoria' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">{isIT ? 'Bug / Errore' : 'Bug / Error'}</SelectItem>
                    <SelectItem value="billing">{isIT ? 'Fatturazione' : 'Billing'}</SelectItem>
                    <SelectItem value="feature">{isIT ? 'Richiesta funzionalità' : 'Feature Request'}</SelectItem>
                    <SelectItem value="integration">{isIT ? 'Integrazione' : 'Integration Help'}</SelectItem>
                    <SelectItem value="account">{isIT ? 'Account' : 'Account'}</SelectItem>
                    <SelectItem value="other">{isIT ? 'Altro' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Oggetto' : 'Subject'}</Label>
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder={isIT ? 'Descrivi brevemente il problema' : 'Briefly describe the issue'}
                />
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Descrizione' : 'Description'}</Label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={isIT ? 'Descrivi il problema in dettaglio...' : 'Describe the issue in detail...'}
                  rows={6}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  {isIT ? 'Annulla' : 'Cancel'}
                </Button>
                <Button onClick={handleSubmit} disabled={sending}>
                  {sending ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isIT ? 'Invia Ticket' : 'Submit Ticket'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SLA Info */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              {isIT ? 'Tempi di risposta per piano' : 'Response times by plan'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <Badge variant="outline">Free</Badge>
                <p className="text-muted-foreground mt-1">72h</p>
              </div>
              <div className="text-center">
                <Badge variant="outline">Starter</Badge>
                <p className="text-muted-foreground mt-1">48h</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary">Pro</Badge>
                <p className="text-muted-foreground mt-1">24h</p>
              </div>
              <div className="text-center">
                <Badge>Agency</Badge>
                <p className="text-muted-foreground mt-1">4h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
