/**
 * DocuSign eSignature API
 * Docs: https://developers.docusign.com/docs/esign-rest-api/
 */
import { logger } from '@/lib/utils/safe-logger';

const getConfig = () => ({
  integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
  userId: process.env.DOCUSIGN_USER_ID || '',
  accountId: process.env.DOCUSIGN_ACCOUNT_ID || '',
  baseUrl: process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi',
});

export interface EnvelopeRecipient {
  email: string;
  name: string;
  recipientId: string;
  routingOrder?: string;
}

/** Create and send an envelope for signing */
export async function sendEnvelope(
  accessToken: string,
  documentBase64: string,
  documentName: string,
  recipients: EnvelopeRecipient[],
  emailSubject: string
): Promise<{ envelopeId: string } | null> {
  const config = getConfig();
  if (!config.accountId) { logger.warn('DocuSign not configured'); return null; }
  try {
    const body = {
      emailSubject,
      documents: [{ documentBase64, name: documentName, fileExtension: 'pdf', documentId: '1' }],
      recipients: { signers: recipients.map(r => ({ ...r, tabs: { signHereTabs: [{ anchorString: '/sn1/', anchorUnits: 'pixels' }] } })) },
      status: 'sent',
    };
    const res = await fetch(`${config.baseUrl}/v2.1/accounts/${config.accountId}/envelopes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`DocuSign ${res.status}`);
    const data = await res.json();
    return { envelopeId: data.envelopeId };
  } catch (err) { logger.error('DocuSign send', err); return null; }
}

/** Get envelope status */
export async function getEnvelopeStatus(accessToken: string, envelopeId: string): Promise<{ status: string } | null> {
  const config = getConfig();
  if (!config.accountId) return null;
  try {
    const res = await fetch(`${config.baseUrl}/v2.1/accounts/${config.accountId}/envelopes/${envelopeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`DocuSign status ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('DocuSign status', err); return null; }
}
