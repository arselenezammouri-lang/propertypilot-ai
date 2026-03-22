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
