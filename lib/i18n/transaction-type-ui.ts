/** Shared labels for listing transaction type (sale / rent / short-term). */

export type TransactionTypeUi = {
  vendita: string;
  affitto: string;
  affitto_breve: string;
};

export const transactionTypeUiIt: TransactionTypeUi = {
  vendita: 'Vendita',
  affitto: 'Affitto',
  affitto_breve: 'Affitto breve / turistico',
};

export const transactionTypeUiEn: TransactionTypeUi = {
  vendita: 'Sale',
  affitto: 'Rental',
  affitto_breve: 'Short-term / vacation rental',
};

export const transactionTypeUiEs: TransactionTypeUi = {
  vendita: 'Venta',
  affitto: 'Alquiler',
  affitto_breve: 'Alquiler turístico / corta estancia',
};

export const transactionTypeUiFr: TransactionTypeUi = {
  vendita: 'Vente',
  affitto: 'Location',
  affitto_breve: 'Location courte durée / saisonnière',
};

export const transactionTypeUiDe: TransactionTypeUi = {
  vendita: 'Verkauf',
  affitto: 'Miete',
  affitto_breve: 'Kurzzeitmiete / Ferienvermietung',
};

export const transactionTypeUiPt: TransactionTypeUi = {
  vendita: 'Venda',
  affitto: 'Arrendamento',
  affitto_breve: 'Arrendamento de curta duração / turístico',
};

export const transactionTypeUiAr: TransactionTypeUi = {
  vendita: 'بيع',
  affitto: 'إيجار',
  affitto_breve: 'إيجار قصير الأجل / سياحي',
};
