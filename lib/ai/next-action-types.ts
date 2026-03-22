export type NextActionIconKey =
  | 'barChart'
  | 'smartphone'
  | 'palette'
  | 'phone'
  | 'fileText'
  | 'mail'
  | 'search'
  | 'eye';

export interface NextActionSuggestion {
  action: string;
  iconKey: NextActionIconKey;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedTime: string;
}
