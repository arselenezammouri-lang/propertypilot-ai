'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Building2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center mb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">PropertyPilot</span>
          </Link>
        </div>
        <h1 className="text-7xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Page not found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 rounded-lg">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
