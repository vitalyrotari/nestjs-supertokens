import type { Request } from 'express';
import type { SessionContainer } from 'supertokens-node/recipe/session';

// Would ideally move this into a parent folder to share with associated front-end
export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export interface AccessTokenPayload {
  roles: string[];
}

export interface SessionRequest extends Request {
  session?: SessionContainer;
}
