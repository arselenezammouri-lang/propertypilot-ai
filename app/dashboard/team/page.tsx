'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Users, Plus, Shield, Mail, MoreHorizontal,
  Crown, UserCog, Eye, Briefcase, Star,
  BarChart3, Clock, Trophy, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const ROLES = [
  { id: 'owner', label: 'Owner', icon: Crown, color: 'text-amber-500', description: 'Full access, billing, delete agency' },
  { id: 'admin', label: 'Admin', icon: Shield, color: 'text-red-500', description: 'Manage team, settings, integrations' },
  { id: 'manager', label: 'Manager', icon: UserCog, color: 'text-blue-500', description: 'View all data, assign leads, reports' },
  { id: 'agent', label: 'Agent', icon: Briefcase, color: 'text-emerald-500', description: 'Own leads, listings, CRM access' },
  { id: 'viewer', label: 'Viewer', icon: Eye, color: 'text-slate-500', description: 'Read-only access to dashboards' },
];

export default function TeamPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [tab, setTab] = useState('members');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');
  const isIT = locale === 'it';

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast({ title: isIT ? 'Errore' : 'Error', description: isIT ? 'Inserisci un indirizzo email.' : 'Enter an email address.', variant: 'destructive' });
      return;
    }
    toast({ title: isIT ? 'Invito inviato!' : 'Invitation sent!', description: `${inviteEmail} — ${inviteRole}` });
    setInviteEmail('');
    setShowInvite(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Team' : 'Team Management'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Gestisci il tuo team, ruoli e permessi' : 'Manage your team, roles, and permissions'}</p>
          </div>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {isIT ? 'Invita Membro' : 'Invite Member'}
        </Button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <Card className="border-primary/30">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground">{isIT ? 'Invita un nuovo membro' : 'Invite a new member'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Email</Label>
                <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@agency.com" />
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Ruolo' : 'Role'}</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.filter(r => r.id !== 'owner').map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowInvite(false)}>{isIT ? 'Annulla' : 'Cancel'}</Button>
              <Button onClick={handleInvite}>
                <Mail className="h-4 w-4 mr-2" />
                {isIT ? 'Invia Invito' : 'Send Invite'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="members">{isIT ? 'Membri' : 'Members'}</TabsTrigger>
          <TabsTrigger value="roles">{isIT ? 'Ruoli' : 'Roles'}</TabsTrigger>
          <TabsTrigger value="leaderboard">{isIT ? 'Classifica' : 'Leaderboard'}</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Solo tu nel team' : 'Just you in the team'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {isIT
                  ? 'Invita agenti e collaboratori per gestire lead, annunci e clienti insieme. Piano Agency: fino a 25 utenti.'
                  : 'Invite agents and collaborators to manage leads, listings, and clients together. Agency plan: up to 25 users.'}
              </p>
              <Button onClick={() => setShowInvite(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {isIT ? 'Invita il primo membro' : 'Invite first member'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <div className="space-y-3">
            {ROLES.map(role => {
              const Icon = role.icon;
              return (
                <Card key={role.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-muted ${role.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{role.label}</h3>
                        {role.id === 'owner' && <Badge variant="outline" className="text-xs">1 max</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isIT ? 'Classifica Team' : 'Team Leaderboard'}
              </h3>
              <p className="text-muted-foreground">
                {isIT
                  ? 'Quando avrai più agenti, vedrai qui la classifica per deal chiusi, lead convertiti e tempo di risposta.'
                  : 'When you have more agents, the leaderboard will show deals closed, leads converted, and response time.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
