import { hasClassName } from '@ng-bootstrap/ng-bootstrap/util/util';
import { matchesClasses } from '@progress/kendo-angular-common';

export interface userLoginResp {
  token: string;
  userdetails: Userdetails;
}

export interface Userdetails {
  sub: string;
  iss: string;
  active: boolean;
  typ: string;
  preferred_username: string;
  given_name: string;
  client_id: string;
  sid: string;
  acr: string;
  upn: string;
  realm_access: RealmAccess;
  azp: string;
  scope: string;
  name: string;
  exp: number;
  session_state: string;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
  username: string;
}

export interface RealmAccess {
  roles: string[];
}
