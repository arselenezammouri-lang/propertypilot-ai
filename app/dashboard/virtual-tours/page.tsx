'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Box, Plus, Eye, Clock, BarChart3, Upload,
  Globe, Sparkles, Play, Settings, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VirtualToursPage() {
  const { locale } = useLocale();
  const [tab, setTab] = useState('gallery');
  const [showCreate, setShowCreate] = useState(false);
  const isIT = locale === 'it';

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10">
            <Box className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Tour Virtuali 3D' : '3D Virtual Tours'}</h1>
            <p className="text-muted-foreground">
              {isIT ? 'Crea tour immersivi con Matterport, CloudPano, 360° o AI' : 'Create immersive tours with Matterport, CloudPano, 360° or AI'}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {isIT ? 'Nuovo Tour' : 'New Tour'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isIT ? 'Tour attivi' : 'Active tours', value: '0', icon: Box, color: 'text-indigo-500' },
          { label: isIT ? 'Visualizzazioni totali' : 'Total views', value: '0', icon: Eye, color: 'text-blue-500' },
          { label: isIT ? 'Tempo medio visita' : 'Avg visit time', value: '—', icon: Clock, color: 'text-emerald-500' },
          { label: isIT ? 'Tasso conversione' : 'Conversion rate', value: '—', icon: BarChart3, color: 'text-purple-500' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">{isIT ? 'Crea Tour Virtuale' : 'Create Virtual Tour'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{isIT ? 'Tipo di tour' : 'Tour type'}</Label>
              <Select defaultValue="360">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="360">{isIT ? '360° da foto (gratuito)' : '360° from photos (free)'}</SelectItem>
                  <SelectItem value="matterport">Matterport 3D</SelectItem>
                  <SelectItem value="cloudpano">CloudPano</SelectItem>
                  <SelectItem value="ai">{isIT ? 'AI Walkthrough (da foto normali)' : 'AI Walkthrough (from regular photos)'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isIT ? 'Titolo immobile' : 'Property title'}</Label>
              <Input placeholder={isIT ? 'Appartamento Via Roma 15, Milano' : 'Apartment 15 Main St, London'} />
            </div>
            <div className="space-y-2">
              <Label>{isIT ? 'Carica foto 360°' : 'Upload 360° photos'}</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{isIT ? 'Trascina foto qui o clicca per caricare' : 'Drag photos here or click to upload'}</p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG • {isIT ? 'Max 50MB per foto' : 'Max 50MB per photo'}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCreate(false)}>{isIT ? 'Annulla' : 'Cancel'}</Button>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                {isIT ? 'Crea Tour' : 'Create Tour'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="gallery">{isIT ? 'Galleria' : 'Gallery'}</TabsTrigger>
          <TabsTrigger value="analytics">{isIT ? 'Analytics' : 'Analytics'}</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-4">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Box className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Nessun tour virtuale ancora' : 'No virtual tours yet'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {isIT
                  ? 'Crea il tuo primo tour virtuale 3D. Supporta Matterport, CloudPano, foto 360° e walkthrough generati da AI.'
                  : 'Create your first 3D virtual tour. Supports Matterport, CloudPano, 360° photos, and AI-generated walkthroughs.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
                {[
                  { icon: Box, label: 'Matterport 3D' },
                  { icon: Globe, label: 'CloudPano' },
                  { icon: Play, label: isIT ? '360° Gratuito' : '360° Free' },
                  { icon: Sparkles, label: 'AI Walkthrough' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-xs text-muted-foreground text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {isIT ? 'Crea il tuo primo tour' : 'Create your first tour'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Analytics dei tour' : 'Tour Analytics'}
              </h3>
              <p className="text-muted-foreground">
                {isIT
                  ? 'Le statistiche appariranno qui quando avrai tour attivi con visitatori.'
                  : 'Statistics will appear here when you have active tours with visitors.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
