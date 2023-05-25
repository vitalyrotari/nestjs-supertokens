import type { AppInfo, TypeInput } from 'supertokens-node/types';

export const ConfigInjectionToken = 'ConfigInjectionToken';

export interface AuthModuleConfig
  extends Omit<TypeInput, 'supertokens' | 'framework'> {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey?: string;
}
