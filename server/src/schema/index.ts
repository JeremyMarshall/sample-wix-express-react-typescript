
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

export interface Token {
  instanceId: string;
  appDefId: string;
  signDate: Date;
  uid: string;
  permissions: string;
  demoMode: boolean;
  siteOwnerId: string;
  siteMemberId: string;
  expirationDate: Date;
  loginAccountId: string;
}

interface WixWebhookInstance {
  appId: string;
  operationTimeStamp: Date;
  vendorProductId: string;
  cycle: string;
  cancelReason: string;
  userReason: string;
  subscriptionCancellationType: string;
}

export interface WixWebhook {
  data: WixWebhookInstance;
  instanceId: string;
  eventType: string;
}

type NonMethodKeys<T> = ({ [P in keyof T]: T[P] extends Function ? never : P } & { [x: string]: never })[keyof T];
type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;

export class WixRequest {
  public instance?: Token
  public wixToken?: string
  public webHook?: WixWebhook | undefined

  constructor(data: RemoveMethods<WixRequest>) {
    Object.assign(this, data);
  }
}
