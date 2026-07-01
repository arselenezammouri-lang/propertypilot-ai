'use client';

import { useState, useCallback } from 'react';
import {
  Bell, Check, CheckCheck, Trash2, Filter,
  UserPlus, FileText, Calendar, Zap, CreditCard,
  MessageSquare, AlertTriangle, Settings, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'lead' | 'listing' | 'viewing' | 'automation' | 'payment' | 'message' | 'system';
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
}

const ICON_MAP: Record<string, typeof Bell> = {
  lead: UserPlus,
  listing: FileText,
  viewing: Calendar,
  automation: Zap,
  payment: CreditCard,
  message: MessageSquare,
  system: AlertTriangle,
};

const COLOR_MAP: Record<string, string> = {
  lead: 'text-blue-500',
  listing: 'text-purple-500',
  viewing: 'text-orange-500',
  automation: 'text-yellow-500',
  payment: 'text-emerald-500',
  message: 'text-cyan-500',
  system: 'text-red-500',
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  // Demo notifications — in production these come from Supabase Realtime
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2">
      {/* Backdrop (mobile) */}
      <div className="fixed inset-0 bg-black/50 md:hidden" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-xl md:absolute md:h-auto md:max-h-[500px] md:rounded-xl md:border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-8rem)] md:h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;ll see updates about leads, listings, and automations here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map(notif => {
                const Icon = ICON_MAP[notif.type] || Bell;
                const color = COLOR_MAP[notif.type] || 'text-muted-foreground';
                return (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors flex gap-3 ${!notif.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`mt-0.5 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notif.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{notif.timestamp}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <a href="/dashboard/settings/notifications">
              <Settings className="h-3 w-3 mr-1" />
              Notification preferences
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
