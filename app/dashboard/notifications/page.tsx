'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Bell, Filter, CheckCheck, Settings,
  UserPlus, FileText, Calendar, Zap, CreditCard,
  MessageSquare, AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NotificationsPage() {
  const { locale } = useLocale();
  const [filter, setFilter] = useState('all');
  const isIT = locale === 'it';

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Notifiche' : 'Notifications'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Tutte le tue notifiche in un unico posto' : 'All your notifications in one place'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isIT ? 'Tutte' : 'All'}</SelectItem>
              <SelectItem value="unread">{isIT ? 'Non lette' : 'Unread'}</SelectItem>
              <SelectItem value="lead">{isIT ? 'Lead' : 'Leads'}</SelectItem>
              <SelectItem value="automation">{isIT ? 'Automazioni' : 'Automations'}</SelectItem>
              <SelectItem value="system">{isIT ? 'Sistema' : 'System'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            {isIT ? 'Segna tutte lette' : 'Mark all read'}
          </Button>
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-12 text-center">
          <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isIT ? 'Nessuna notifica' : 'No notifications yet'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {isIT
              ? 'Le notifiche appariranno qui quando ricevi nuovi lead, completano automazioni, o arrivano pagamenti.'
              : 'Notifications will appear here when you receive new leads, automations complete, or payments arrive.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {[
              { icon: UserPlus, label: isIT ? 'Nuovi lead' : 'New leads', color: 'text-blue-500' },
              { icon: Zap, label: isIT ? 'Automazioni' : 'Automations', color: 'text-yellow-500' },
              { icon: CreditCard, label: isIT ? 'Pagamenti' : 'Payments', color: 'text-emerald-500' },
              { icon: AlertTriangle, label: isIT ? 'Sistema' : 'System', color: 'text-red-500' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
