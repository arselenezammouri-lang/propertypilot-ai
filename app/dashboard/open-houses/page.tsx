'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Home, Plus, Calendar, Users, QrCode,
  MapPin, Clock, BarChart3, Copy, ExternalLink,
  Sparkles, Mail, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface OpenHouse {
  id: string;
  title: string;
  address: string;
  date: string;
  timeSlot: string;
  maxVisitors: number;
  registeredCount: number;
  status: 'upcoming' | 'live' | 'completed';
  publicUrl: string;
}

export default function OpenHousesPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const isIT = locale === 'it';

  // Demo data
  const openHouses: OpenHouse[] = [];

  const handleCreate = () => {
    if (!title.trim() || !address.trim() || !date) {
      toast({ title: isIT ? 'Errore' : 'Error', description: isIT ? 'Compila tutti i campi obbligatori.' : 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    toast({ title: isIT ? 'Open House creato!' : 'Open House created!', description: isIT ? 'La pagina pubblica è pronta per essere condivisa.' : 'The public page is ready to share.' });
    setShowForm(false);
    setTitle(''); setAddress(''); setDate(''); setTimeSlot('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Open House' : 'Open Houses'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Organizza visite aperte con registrazione digitale e follow-up automatico' : 'Organize open houses with digital sign-in and automated follow-up'}</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {isIT ? 'Nuovo Open House' : 'New Open House'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">{isIT ? 'Crea Open House' : 'Create Open House'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isIT ? 'Titolo immobile' : 'Property title'}</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={isIT ? 'Appartamento Via Roma 15, Milano' : 'Apartment 15 Main St, London'} />
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Indirizzo' : 'Address'}</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={isIT ? 'Via Roma 15, 20121 Milano' : '15 Main Street, London SW1'} />
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Data' : 'Date'}</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Orario' : 'Time slot'}</Label>
                <Input value={timeSlot} onChange={e => setTimeSlot(e.target.value)} placeholder="10:00 - 13:00" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>{isIT ? 'Annulla' : 'Cancel'}</Button>
              <Button onClick={handleCreate}>
                <Sparkles className="h-4 w-4 mr-2" />
                {isIT ? 'Crea e Genera Pagina' : 'Create & Generate Page'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {openHouses.length === 0 && !showForm && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isIT ? 'Nessun Open House ancora' : 'No Open Houses yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {isIT
                ? 'Crea un open house per ricevere registrazioni online, check-in digitale con QR code e follow-up automatico via email e WhatsApp.'
                : 'Create an open house to receive online registrations, digital QR check-in, and automated follow-up via email and WhatsApp.'}
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                <QrCode className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground text-center">{isIT ? 'Check-in QR Code' : 'QR Code Check-in'}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground text-center">{isIT ? 'Follow-up automatico' : 'Auto Follow-up'}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground text-center">{isIT ? 'Analytics visite' : 'Visit Analytics'}</span>
              </div>
            </div>

            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {isIT ? 'Crea il tuo primo Open House' : 'Create your first Open House'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {openHouses.length > 0 && (
        <div className="space-y-3">
          {openHouses.map(oh => (
            <Card key={oh.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{oh.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{oh.address}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{oh.date} {oh.timeSlot}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{oh.registeredCount}/{oh.maxVisitors}</span>
                  </div>
                </div>
                <Badge variant={oh.status === 'upcoming' ? 'secondary' : oh.status === 'live' ? 'default' : 'outline'}>
                  {oh.status === 'upcoming' ? (isIT ? 'In programma' : 'Upcoming') : oh.status === 'live' ? 'LIVE' : (isIT ? 'Completato' : 'Completed')}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
