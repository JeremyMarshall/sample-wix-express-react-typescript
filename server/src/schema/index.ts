
export interface WixToken {
  access_token: string;
  refresh_token: string;
}

export interface Billing {
  billingCycle: string;
  packageName: string;
}

export interface Instance {
  appName: string;
  appVersion: string;
  billing: Billing;
  instanceId: string;
  isFree: boolean;
  permissions: string[];
}

export interface Multilingual {
  isMultiLingual: boolean;
  supportedLanguages: any[];
}

export interface Site {
  locale: string;
  multilingual: Multilingual;
  paymentCurrency: string;
  siteDisplayName: string;
  url: string;
  description: string;
}

export interface AppInstance {
  instance: Instance;
  site: Site;
}



