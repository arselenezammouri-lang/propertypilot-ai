/**
 * Export Data System - CSV/Excel Export
 * Funzioni per esportare dati della dashboard in CSV e Excel
 */

import * as XLSX from 'xlsx';

export interface ExportableListing {
  title: string;
  location: string;
  price: number | null;
  platform: string;
  status: string;
  lead_score: number | null;
  market_gap?: number | null;
  owner_name?: string | null;
  phone?: string | null;
  url: string;
  created_at: string;
}

/**
 * Esporta dati in formato CSV
 */
export function exportToCSV(data: ExportableListing[], filename: string = 'prospecting-export'): void {
  const headers = [
    'Titolo',
    'Location',
    'Prezzo',
    'Piattaforma',
    'Status',
    'Lead Score',
    'Market Gap %',
    'Nome Proprietario',
    'Telefono',
    'URL',
    'Data Creazione',
  ];

  const rows = data.map((item) => [
    item.title,
    item.location,
    item.price || '',
    item.platform,
    item.status,
    item.lead_score || '',
    item.market_gap ? `${item.market_gap.toFixed(2)}%` : '',
    item.owner_name || '',
    item.phone || '',
    item.url,
    new Date(item.created_at).toLocaleDateString('it-IT'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Esporta dati in formato Excel
 */
export function exportToExcel(data: ExportableListing[], filename: string = 'prospecting-export'): void {
  const worksheetData = [
    [
      'Titolo',
      'Location',
      'Prezzo',
      'Piattaforma',
      'Status',
      'Lead Score',
      'Market Gap %',
      'Nome Proprietario',
      'Telefono',
      'URL',
      'Data Creazione',
    ],
    ...data.map((item) => [
      item.title,
      item.location,
      item.price || null,
      item.platform,
      item.status,
      item.lead_score || null,
      item.market_gap ? `${item.market_gap.toFixed(2)}%` : null,
      item.owner_name || null,
      item.phone || null,
      item.url,
      new Date(item.created_at).toLocaleDateString('it-IT'),
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Prospecting Data');

  // Auto-width columns
  const maxWidth = 50;
  const colWidths = worksheetData[0].map((_, colIndex) => {
    const maxLength = Math.max(
      ...worksheetData.map((row) => (row[colIndex] ? String(row[colIndex]).length : 0))
    );
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Invia dati a Webhook CRM (Zapier, Make.com, etc.)
 */
export async function sendToCRMWebhook(
  webhookUrl: string,
  data: ExportableListing[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'PropertyPilot AI',
        timestamp: new Date().toISOString(),
        count: data.length,
        listings: data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[CRM WEBHOOK] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

