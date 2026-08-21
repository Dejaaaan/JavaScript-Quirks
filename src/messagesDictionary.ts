import srMessages from '../messages/sr.json';
import enMessages from '../messages/en.json';

export type MessageKey = keyof typeof srMessages;

export const dictionaries = {
  sr: srMessages,
  en: enMessages
};

export function formatMessage(template: string, params?: Record<string, any>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

export type MessageFunctions = {
  [K in MessageKey]: (params?: Record<string, any>) => string;
};

export function createMessagesProxy(getLocale: () => 'sr' | 'en'): MessageFunctions {
  return new Proxy({} as MessageFunctions, {
    get: (_, prop: string) => {
      return (params?: Record<string, any>) => {
        const locale = getLocale();
        const dict = dictionaries[locale] || dictionaries.sr;
        const fallbackDict = dictionaries.sr;
        const raw = (dict as any)[prop] || (fallbackDict as any)[prop] || prop;
        return formatMessage(raw, params);
      };
    }
  });
}
