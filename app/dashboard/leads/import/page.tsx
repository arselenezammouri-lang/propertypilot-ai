'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Upload, FileSpreadsheet, AlertCircle, CheckCircle2,
  ArrowLeft, Download, Users, Loader2, X, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ImportPreview {
  fileName: string;
  totalRows: number;
  columns: string[];
  preview: Record<string, string>[];
  duplicates: number;
  errors: string[];
}

export default function ImportLeadsPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: number } | null>(null);

  const isIT = locale === 'it';

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setParsing(true);
    setPreview(null);
    setImportResult(null);

    // Simulate CSV parsing — in production, use Papa Parse or server-side parsing
    await new Promise(r => setTimeout(r, 1500));

    // Demo preview
    setPreview({
      fileName: selectedFile.name,
      totalRows: 47,
      columns: ['Name', 'Email', 'Phone', 'Source', 'Budget', 'Property Type', 'City'],
      preview: [
        { Name: 'Marco Bianchi', Email: 'marco.b@email.com', Phone: '+39 333 1234567', Source: 'Idealista', Budget: '€250,000', 'Property Type': 'Apartment', City: 'Milano' },
        { Name: 'Anna Verdi', Email: 'anna.verdi@gmail.com', Phone: '+39 348 7654321', Source: 'Website', Budget: '€180,000', 'Property Type': 'Studio', City: 'Roma' },
        { Name: 'Luigi Rossi', Email: 'l.rossi@outlook.it', Phone: '+39 320 5551234', Source: 'Referral', Budget: '€450,000', 'Property Type': 'Villa', City: 'Firenze' },
      ],
      duplicates: 3,
      errors: [],
    });
    setParsing(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      processFile(droppedFile);
    } else {
      toast({ title: isIT ? 'Formato non supportato' : 'Unsupported format', description: isIT ? 'Carica un file CSV o Excel (.xlsx)' : 'Upload a CSV or Excel (.xlsx) file', variant: 'destructive' });
    }
  }, [isIT, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    // In production: POST to /api/leads/import with parsed data
    await new Promise(r => setTimeout(r, 2000));
    setImporting(false);
    setImportResult({ imported: 44, skipped: 3, errors: 0 });
    toast({ title: isIT ? 'Importazione completata!' : 'Import complete!', description: isIT ? '44 lead importati con successo.' : '44 leads imported successfully.' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/leads" className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Importa Lead' : 'Import Leads'}</h1>
          <p className="text-muted-foreground">{isIT ? 'Carica un file CSV o Excel per importare i tuoi lead' : 'Upload a CSV or Excel file to import your leads'}</p>
        </div>
      </div>

      {/* Upload Area */}
      {!preview && !importResult && (
        <Card
          className={`border-2 border-dashed transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-12 text-center">
            {parsing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-foreground font-medium">{isIT ? 'Analisi del file in corso...' : 'Analyzing file...'}</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isIT ? 'Trascina il file qui o clicca per caricare' : 'Drag & drop file here or click to upload'}
                </h3>
                <p className="text-muted-foreground mb-6">{isIT ? 'CSV, Excel (.xlsx, .xls) — max 10MB' : 'CSV, Excel (.xlsx, .xls) — max 10MB'}</p>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      {isIT ? 'Scegli File' : 'Choose File'}
                    </span>
                  </Button>
                </label>
                <input id="file-upload" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileSelect} />

                {/* Template downloads */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    {isIT ? 'Scarica un template di esempio:' : 'Download a sample template:'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['CSV Template', 'Zoho Export', 'HubSpot Export', 'Pipedrive Export'].map(name => (
                      <Badge key={name} variant="outline" className="cursor-pointer hover:bg-muted">
                        <Download className="h-3 w-3 mr-1" />
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {preview && !importResult && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {preview.fileName}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setPreview(null); setFile(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {preview.totalRows} {isIT ? 'righe trovate' : 'rows found'}
                </Badge>
                <Badge variant="secondary">
                  {preview.columns.length} {isIT ? 'colonne' : 'columns'}
                </Badge>
                {preview.duplicates > 0 && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-500/30">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {preview.duplicates} {isIT ? 'possibili duplicati' : 'possible duplicates'}
                  </Badge>
                )}
              </div>

              {/* Preview table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {preview.columns.map(col => (
                        <th key={col} className="text-left py-2 px-3 font-medium text-foreground whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.preview.map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {preview.columns.map(col => (
                          <td key={col} className="py-2 px-3 text-muted-foreground whitespace-nowrap">{row[col] || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isIT ? `Mostrando 3 di ${preview.totalRows} righe` : `Showing 3 of ${preview.totalRows} rows`}
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setPreview(null); setFile(null); }}>
              {isIT ? 'Annulla' : 'Cancel'}
            </Button>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isIT ? 'Importazione...' : 'Importing...'}</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" />{isIT ? `Importa ${preview.totalRows} lead` : `Import ${preview.totalRows} leads`}</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isIT ? 'Importazione completata!' : 'Import Complete!'}
            </h3>
            <div className="flex gap-4 justify-center mb-6">
              <Badge className="bg-emerald-500/20 text-emerald-400">
                {importResult.imported} {isIT ? 'importati' : 'imported'}
              </Badge>
              {importResult.skipped > 0 && (
                <Badge variant="outline" className="text-yellow-600">
                  {importResult.skipped} {isIT ? 'saltati (duplicati)' : 'skipped (duplicates)'}
                </Badge>
              )}
              {importResult.errors > 0 && (
                <Badge variant="destructive">
                  {importResult.errors} {isIT ? 'errori' : 'errors'}
                </Badge>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/dashboard/leads">
                  <Users className="h-4 w-4 mr-2" />
                  {isIT ? 'Vedi Lead' : 'View Leads'}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => { setPreview(null); setFile(null); setImportResult(null); }}>
                {isIT ? 'Importa altri' : 'Import more'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
