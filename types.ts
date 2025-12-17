export interface ScanResult {
  isPhishing: boolean;
  riskScore: number;
  confidence: string; // "High", "Medium", "Low"
  verdict: string;
  reasons: string[];
  features: {
    urlLength: number;
    hasIpAddress: boolean;
    hasAtSymbol: boolean;
    hasSuspiciousKeywords: boolean;
    domainAge?: string;
    sslStatus?: string;
  };
}

export interface PythonFile {
  name: string;
  language: 'python' | 'text' | 'markdown' | 'json';
  content: string;
}

export enum AppTab {
  SCANNER = 'SCANNER',
  PROJECT_CODE = 'PROJECT_CODE',
}