import { enUS } from './translations/en-US';
import { ruRU } from './translations/ru-RU';

export enum Locale {
    RU = 'ru-RU',
    EN = 'en-US'
}

export const localizationStore: Map<Locale, {[key: string]: string}> = new Map();
localizationStore.set(Locale.EN, enUS);
localizationStore.set(Locale.RU, ruRU);

export interface LocalizationParams {
    [key: string]: string;
}

export abstract class LocalizationService {

    constructor() {}

    abstract translate(key: string, params?: LocalizationParams): string;

    abstract changeLocale(newLocale: Locale): void;

    abstract getCurrentLocale(): Locale;
}

/**
 * Function for get translation by localization key. You can use it from get translation
 * according current locale. You also can use params for set it in localization.
 * @params
 * @param locale Locale See {@link Locale} current locale. It need for get localization keys by locale from store.
 * @param key string Localization key. Need for test localization from translation file.
 * @param localizationParams any Params for interpolation. You use it for set params to localization.
 * @return string Localization from localization store.
 **/
export function getTranslation(locale: Locale, key: string, localizationParams: LocalizationParams = null): string {
    const currentLocalization: {[key: string]: string} = localizationStore.get(locale);
    let text: string = currentLocalization[key];

    if (localizationParams) {
        Object
            .keys(localizationParams)
            .forEach((element: string) => text = text
                .replace(`{${element}}`, localizationParams[element]));
    }

    return text ?
        text :
        key;
}