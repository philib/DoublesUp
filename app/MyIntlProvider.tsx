'use client';
import React, { ReactNode } from 'react';
import { IntlProvider, PrimitiveType, useIntl } from 'react-intl';
import de from '../public/translations/de.json';
import en from '../public/translations/en.json';

export const MyIntlProvider: React.FC<{ children: ReactNode | ReactNode[] }> = (
  props
) => {
  const language = navigator.language.split(/[-_]/)[0];
  return (
    <IntlProvider
      locale={navigator.language}
      defaultLocale="en"
      messages={messages[language] ?? en}
      {...props}
    >
      {props.children}
    </IntlProvider>
  );
};
export function useFormatMessage(): (
  id: LocaleKey, // only accepts valid keys, not any string
  values?: Record<string, PrimitiveType>
) => string {
  const intl = useIntl();
  return (id, values) => intl.formatMessage({ id }, values);
}
type SourceOfTruth = typeof en;
type LocaleMessages = SourceOfTruth;
type SupportedLanguage = typeof en | typeof de;
type LocaleKey = keyof LocaleMessages;
const messages: { [language: string]: SupportedLanguage } = {
  en: en,
  de: de,
};
