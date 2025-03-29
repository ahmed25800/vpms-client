import { t } from "i18next"; // Import translation function

/**
 * Translates an enum value using i18n translations.
 * @param {string} value - The enum value to translate.
 * @param {string} translationKey - The translation key prefix.
 * @returns {string} - The translated string.
 */
export const translateEnum = (value, translationKey) => {
  return t(`${translationKey}.${value}`) || t(`${translationKey}.unknown`);
};
