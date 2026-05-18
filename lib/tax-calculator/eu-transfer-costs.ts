/**
 * EU Property Tax & Transfer Cost Calculator
 * Covers: Italy (IMU, registro), France (droits de mutation), Spain (ITP/IBI),
 * Germany (Grunderwerbsteuer), UK (Stamp Duty), Portugal (IMT/IMI)
 */

export type TaxCountry = "IT" | "FR" | "ES" | "DE" | "UK" | "PT";

export interface TransferCostResult {
  country: TaxCountry;
  purchase_price: number;
  transfer_tax: number;
  transfer_tax_name: string;
  transfer_tax_rate: string;
  notary_fees: number;
  agency_fees: number;
  agency_fee_rate: string;
  registration_fees: number;
  annual_property_tax: number;
  annual_tax_name: string;
  total_acquisition_cost: number;
  total_percentage: string;
  breakdown: { label: string; amount: number; note?: string }[];
}

const CALCULATORS: Record<TaxCountry, (price: number, isFirstHome: boolean) => TransferCostResult> = {
  IT: (price, isFirstHome) => {
    const registroRate = isFirstHome ? 0.02 : 0.09;
    const registro = Math.max(price * registroRate, 1000);
    const notary = Math.min(Math.max(price * 0.015, 1500), 5000);
    const agency = price * 0.03;
    const imu = isFirstHome ? 0 : price * 0.0076; // prima casa exempt
    const catastale = 50;
    const ipotecaria = isFirstHome ? 50 : 200;
    const total = registro + notary + agency + catastale + ipotecaria;
    return {
      country: "IT", purchase_price: price,
      transfer_tax: registro, transfer_tax_name: "Imposta di Registro", transfer_tax_rate: `${(registroRate * 100).toFixed(0)}%`,
      notary_fees: notary, agency_fees: agency, agency_fee_rate: "3%",
      registration_fees: catastale + ipotecaria,
      annual_property_tax: imu, annual_tax_name: "IMU",
      total_acquisition_cost: total, total_percentage: `${((total / price) * 100).toFixed(1)}%`,
      breakdown: [
        { label: "Imposta di Registro", amount: registro, note: isFirstHome ? "Prima casa rate" : "Seconda casa rate" },
        { label: "Imposta Catastale", amount: catastale },
        { label: "Imposta Ipotecaria", amount: ipotecaria },
        { label: "Notary Fees", amount: notary },
        { label: "Agency Commission (3%)", amount: agency },
      ],
    };
  },
  FR: (price, _isFirstHome) => {
    const droits = price * 0.0715; // ~7.15% for existing (5.81% departmental + 1.34% commune)
    const notary = price * 0.01;
    const agency = price * 0.05;
    const taxeFonciere = price * 0.005;
    const total = droits + notary + agency;
    return {
      country: "FR", purchase_price: price,
      transfer_tax: droits, transfer_tax_name: "Droits de Mutation", transfer_tax_rate: "7.15%",
      notary_fees: notary, agency_fees: agency, agency_fee_rate: "5%",
      registration_fees: 0,
      annual_property_tax: taxeFonciere, annual_tax_name: "Taxe Foncière",
      total_acquisition_cost: total, total_percentage: `${((total / price) * 100).toFixed(1)}%`,
      breakdown: [
        { label: "Droits de Mutation", amount: droits, note: "Existing property rate" },
        { label: "Frais de Notaire", amount: notary },
        { label: "Honoraires Agence (5%)", amount: agency },
      ],
    };
  },
  ES: (price, _isFirstHome) => {
    const itp = price * 0.06; // 6-10% varies by region, using 6% base
    const notary = Math.min(Math.max(price * 0.005, 600), 3000);
    const agency = price * 0.05;
    const ibi = price * 0.004;
    const registro = price * 0.003;
    const total = itp + notary + agency + registro;
    return {
      country: "ES", purchase_price: price,
      transfer_tax: itp, transfer_tax_name: "ITP (Impuesto de Transmisiones)", transfer_tax_rate: "6%",
      notary_fees: notary, agency_fees: agency, agency_fee_rate: "5%",
      registration_fees: registro,
      annual_property_tax: ibi, annual_tax_name: "IBI (Impuesto sobre Bienes Inmuebles)",
      total_acquisition_cost: total, total_percentage: `${((total / price) * 100).toFixed(1)}%`,
      breakdown: [
        { label: "ITP", amount: itp, note: "Varies 6-10% by comunidad autónoma" },
        { label: "Notary", amount: notary },
        { label: "Land Registry", amount: registro },
        { label: "Agency (5%)", amount: agency },
      ],
    };
  },
  DE: (price, _isFirstHome) => {
    const grunderwerbsteuer = price * 0.05; // 3.5-6.5% by Bundesland, using 5% average
    const notary = price * 0.015;
    const agency = price * 0.0357; // ~3.57% + VAT split buyer/seller
    const grundbuch = price * 0.005;
    const grundsteuer = price * 0.0035;
    const total = grunderwerbsteuer + notary + agency + grundbuch;
    return {
      country: "DE", purchase_price: price,
      transfer_tax: grunderwerbsteuer, transfer_tax_name: "Grunderwerbsteuer", transfer_tax_rate: "5%",
      notary_fees: notary, agency_fees: agency, agency_fee_rate: "3.57%",
      registration_fees: grundbuch,
      annual_property_tax: grundsteuer, annual_tax_name: "Grundsteuer",
      total_acquisition_cost: total, total_percentage: `${((total / price) * 100).toFixed(1)}%`,
      breakdown: [
        { label: "Grunderwerbsteuer", amount: grunderwerbsteuer, note: "Varies 3.5-6.5% by Bundesland" },
        { label: "Notar", amount: notary },
        { label: "Grundbuch", amount: grundbuch },
        { label: "Maklergebühr (buyer share)", amount: agency },
      ],
    };
  },
  UK: (price, isFirstHome) => {
    // Stamp Duty Land Tax (simplified bands)
    let sdlt = 0;
    if (isFirstHome) {
      if (price > 425000) sdlt = (price - 425000) * 0.05;
    } else {
      if (price > 250000) sdlt = (Math.min(price, 925000) - 250000) * 0.05;
      if (price > 925000) sdlt += (price - 925000) * 0.10;
    }
    const solicitor = 1500;
    const agency = price * 0.015;
    const searches = 400;
    const councilTax = Math.round(price * 0.003);
    const total = sdlt + solicitor + agency + searches;
    return {
      country: "UK", purchase_price: price,
      transfer_tax: sdlt, transfer_tax_name: "Stamp Duty (SDLT)", transfer_tax_rate: `${((sdlt / price) * 100).toFixed(1)}%`,
      notary_fees: solicitor, agency_fees: agency, agency_fee_rate: "1.5%",
      registration_fees: searches,
      annual_property_tax: councilTax, annual_tax_name: "Council Tax",
      total_acquisition_cost: total, total_percentage: `${((total / price) * 100).toFixed(1)}%`,
      breakdown: [
        { label: "SDLT", amount: sdlt, note: isFirstHome ? "First-time buyer relief" : "Standard rates" },
        { label: "Solicitor Fees", amount: solicitor },
        { label: "Local Searches", amount: searches },
        { label: "Estate Agent (1.5%)", amount: agency },
      ],
    };
  },
  PT: (price, isFirstHome) => {
    // IMT (Imposto Municipal sobre Transmissões)
    let imt = 0;
    if (price <= 101917) imt = 0;
    else if (price <= 139412) imt = price * 0.02 - 2038.34;
    else if (price <= 190086) imt = price * 0.05 - 6220.70;
    else if (price <= 316772) imt = price * 0.07 - 10022.42;
    else if (price <= 633453) imt = price * 0.08 - 13190.14;
    else imt = price * 0.06;
    if (isFirstHome && price <= 101917) imt = 0;

    const impSelo = price * 0.008;
    const notary = 800;
    const agency = price * 0.05;
    const imi = price * 0.004;
    const total = imt + impSelo + notary + agency;
    return {
      country: "PT", purchase_price: price,
      transfer_tax: imt, transfer_tax_name: "IMT", transfer_tax_rate: `${((imt / price) * 100).toFixed(1)}%`,
      notary_fees: notary, agency_fees: agency, agency_fee_rate: "5%",
      registration_fees: impSelo,
      annual_property_tax: imi, annual_tax_name: "IMI",
      total_acquisition_cost: total, total_percentage: `${((total / price) * 100).toFixed(1)}%`,
      breakdown: [
        { label: "IMT", amount: imt },
        { label: "Imposto de Selo (0.8%)", amount: impSelo },
        { label: "Notário", amount: notary },
        { label: "Comissão Agência (5%)", amount: agency },
      ],
    };
  },
};

export function calculateTransferCosts(
  country: TaxCountry,
  price: number,
  isFirstHome: boolean = false
): TransferCostResult {
  const calculator = CALCULATORS[country];
  return calculator(price, isFirstHome);
}
