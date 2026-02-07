import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen diamond-force-black diamond-force-white-text p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-black diamond-text-gradient">404</h1>
        <h2 className="text-2xl font-bold text-white">Pagina non trovata</h2>
        <p className="text-gray-400 diamond-text-muted">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="diamond-button-primary">
              <Home className="h-4 w-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="diamond-button-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
