/** Shared types for API toast feedback (no runtime deps on chrome strings). */

export type ApiFeatureId =
  | 'perfectCopy'
  | 'leadManager'
  | 'listingsLibrary'
  | 'refineListing'
  | 'translateListing'
  | 'titleGenerator'
  | 'emotionalListing'
  | 'socialPosts'
  | 'hashtagGenerator'
  | 'followupEmails'
  | 'videoScripts'
  | 'agentBio'
  | 'pdfSheets'
  | 'leadScoring'
  | 'leadPipeline'
  | 'leadDetail'
  | 'workflowAutomations'
  | 'crmAutomationRules'
  | 'linkAnalysis'
  | 'listingScraper'
  | 'listingAuditor'
  | 'prospectingCommand'
  | 'predatorMap'
  | 'opportunityRadar'
  | 'mandateAutopilot'
  | 'billingSubscription'
  | 'premiumPackages'
  | 'referralProgram'
  | 'agencyAssistantChat'
  | 'crmLeadCapture'
  | 'workspaceModules'
  | 'morningIntelNotifications'
  | 'agencyBrandingWhiteLabel';

export type ApiFailureInput = {
  status?: number;
  error?: string;
  message?: string;
};
