
// airship: Custom Elements Define Library, ES Module/es2017 Target

import { defineCustomElement } from './airship.core.js';
import { COMPONENTS } from './airship.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
