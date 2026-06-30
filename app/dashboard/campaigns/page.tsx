'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Mail, Plus, Zap, Users, BarChart3,
  Clock, Play, Pause, Copy, Sparkles, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  steps: number;
  duration: string;
  category: string;
}

const TEMPLATES: CampaignTemplate[] = [
  { id: 'buyer-welcome', name: 'Buyer Welcome', description: 'Onboard new buyer leads with 5 emails over 14 days', steps: 5, duration: '14 days', category: 'onboarding' },
  { id: 'cold-nurture', name: 'Cold Lead Nurture', description: 'Re-engage cold leads with market updates and new listings', steps: 4, duration: '30 days', category: 'nurture' },
  { id: 'post-viewing', name: 'Post-Viewing Follow-up', description: 'Follow up after property viewings with feedback request', steps: 3, duration: '7 days', category: 'followup' },
  { id: 'seller-nurture', name: 'Seller Nurture', description: 'Keep seller clients informed about market conditions', steps: 6, duration: '60 days', category: 'nurture' },
  { id: 'birthday', name: 'Birthday Campaign', description: 'Send personalized birthday greetings to clients', steps: 1, duration: '1 day', category: 'engagement' },
  { id: 'market-update', name: 'Monthly Market Report', description: 'Monthly market analysis sent to all contacts', steps: 1, duration: 'Monthly', category: 'engagement' },
  { id: 'investor-digest', name: 'Investor Digest', description: 'Weekly investment opportunities for investor clients', steps: 1, duration: 'Weekly', category: 'engagement' },
  { id: 'listing-alert', name: 'Listing Match Alert', description: 'Auto-notify buyers when matching properties are listed', steps: 1, duration: 'Instant', category: 'automation' },
  { id: 'open-house-followup', name: 'Open House Follow-up', description: 'Thank visitors and send additional property details', steps: 3, duration: '14 days', category: 'followup' },
  { id: 're-engagement', name: 'Re-engagement (30/60/90d)', description: 'Win back inactive contacts at 30, 60, and 90 days', steps: 3, duration: '90 days', category: 'nurture' },
];

export default function CampaignsPage() {
  const { locale } = useLocale();
  const [tab, setTab] = useState('templates');
  const isIT = locale === 'it';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Campagne Email' : 'Email Campaigns'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Sequenze email automatiche per nutrire lead e chiudere affari' : 'Automated email sequences to nurture leads and close deals'}</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isIT ? 'Nuova Campagna' : 'New Campaign'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isIT ? 'Campagne attive' : 'Active campaigns', value: '0', icon: Play, color: 'text-emerald-500' },
          { label: isIT ? 'Email inviate (mese)' : 'Emails sent (month)', value: '0', icon: Mail, color: 'text-blue-500' },
          { label: isIT ? 'Tasso apertura' : 'Open rate', value: '—', icon: BarChart3, color: 'text-purple-500' },
          { label: isIT ? 'Lead in sequenza' : 'Leads in sequence', value: '0', icon: Users, color: 'text-orange-500' },
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

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="templates">{isIT ? 'Template' : 'Templates'} ({TEMPLATES.length})</TabsTrigger>
          <TabsTrigger value="active">{isIT ? 'Attive' : 'Active'} (0)</TabsTrigger>
          <TabsTrigger value="completed">{isIT ? 'Completate' : 'Completed'} (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map(template => (
              <Card key={template.id} className="hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />{template.steps} {isIT ? 'email' : 'emails'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />{template.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Nessuna campagna attiva' : 'No active campaigns'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isIT ? 'Scegli un template qui sopra per iniziare la tua prima sequenza email automatica.' : 'Choose a template above to start your first automated email sequence.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Nessuna campagna completata' : 'No completed campaigns'}
              </h3>
              <p className="text-muted-foreground">
                {isIT ? 'Le campagne completate appariranno qui con le statistiche di performance.' : 'Completed campaigns will appear here with performance statistics.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
