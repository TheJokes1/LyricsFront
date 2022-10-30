import * as auth from '../../auth.config.json';

let interm = auth;

export const environment = {
  production: false,
  auth: {domain: interm.domain, clientId: interm.clientId, redirectUri : window.location.origin}
};


