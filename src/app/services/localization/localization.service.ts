import { getTranslation, Locale, LocalizationParams, LocalizationService } from './localization.service.api';

export class LocalizationServiceImplementation extends LocalizationService {
    private currentLocale: Locale = Locale.EN;

    translate(key: string, params?: LocalizationParams): string {
        return getTranslation(this.currentLocale, key, params);
    }

    changeLocale(newLocale: Locale): void {
        this.currentLocale = newLocale;
    }

    getCurrentLocale(): Locale {
        return this.currentLocale;
    }

}