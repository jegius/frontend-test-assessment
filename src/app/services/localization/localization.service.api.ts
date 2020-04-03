import { enUS } from './translations/en-US';
import { ruRU } from './translations/ru-RU';

export enum Locale {
    RU = 'ru-RU',
    EN = 'en-US'
}

const localizationStore: Map<Locale, {[key: string]: string}> = new Map();
localizationStore.set(Locale.EN, enUS);
localizationStore.set(Locale.RU, ruRU);

export interface LocalizationParams {
    [key: string]: string
}

export abstract class LocalizationService {

    constructor() {}

    abstract translate(key: string, params?: LocalizationParams): string;

    abstract changeLocale(newLocale: Locale): void;

    abstract getCurrentLocale(): Locale;
}

export function getTranslation(locale: Locale, key: string, localizationParams: LocalizationParams = null): string {
    const currentLocalization: {[key: string]: string} = localizationStore.get(locale);
    let text: string = currentLocalization[key];

    if (localizationParams) {
        Object
            .keys(localizationParams)
            .forEach((element: string) => text = text
                .replace(`{${element}}`, localizationParams[element]))
    }

    return text;
}