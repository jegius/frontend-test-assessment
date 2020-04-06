import { getTranslation, Locale, LocalizationService, localizationStore } from '../localization.service.api';
import { LocalizationServiceImplementation } from '../localization.service';

describe('LocalizationService', () => {
    let localizationService: LocalizationService;

    beforeEach(() => {
        localizationService = new LocalizationServiceImplementation();
    });

    it('should be created.', () => {
        expect(localizationService).toBeTruthy();
    });

    it('changeLocale: should change locale.', () => {
        let expectedLocale: Locale = Locale.EN;
        const currentLocale: Locale = localizationService.getCurrentLocale();

        expect(expectedLocale).toEqual(currentLocale);

        expectedLocale = Locale.RU;
        localizationService.changeLocale(expectedLocale);

        expect(localizationService.getCurrentLocale()).toEqual(expectedLocale);

        expectedLocale = Locale.EN;
        localizationService.changeLocale(expectedLocale);

        expect(localizationService.getCurrentLocale()).toEqual(expectedLocale);
    });

    it('getCurrentLocale: should provide current locale.', () => {
        let expectedLocale: Locale = Locale.EN;
        const currentLocale: Locale = localizationService.getCurrentLocale();

        expect(expectedLocale).toEqual(currentLocale);
    });

    it('translate: should provide text by provided localization key.', () => {
        const startLocale: Locale = localizationService.getCurrentLocale();
        const localizationKey: string = 'emailInput.header';
        const expectedResult: string = localizationStore.get(startLocale)[localizationKey];

        expect(localizationService.translate(localizationKey)).toEqual(expectedResult);
    });

    it('translate: should correct work with interpolation parameters.', () => {
        const startLocale: Locale = localizationService.getCurrentLocale();
        const localizationKey: string = 'emailInput.header';
        const name: string = 'test';
        const expectedResult: string = localizationStore
            .get(startLocale)[localizationKey]
            .replace(`{name}`, name);

        expect(localizationService.translate(localizationKey, {name})).toEqual(expectedResult);
    });

    it('translate: should return localization key if provided key ' +
        'isn`t present in localization files.', () => {
        const localizationKey: string = 'emailInput.header.not';

        expect(localizationService.translate(localizationKey)).toEqual(localizationKey);
    });

    it('getTranslation: should return localization key by provided locale and key', () => {
        let startLocale: Locale = localizationService.getCurrentLocale();
        let localizationKey: string = 'emailInput.header';
        let expectedResult: string = localizationStore
            .get(startLocale)[localizationKey];

        expect(getTranslation(startLocale, localizationKey)).toEqual(expectedResult);

        localizationService.changeLocale(Locale.RU);
        startLocale = localizationService.getCurrentLocale();
        localizationKey = 'emailInput.header';
        expectedResult = localizationStore
            .get(startLocale)[localizationKey];

        expect(getTranslation(startLocale, localizationKey)).toEqual(expectedResult);

        localizationKey = 'emailInput.header';
        const name: string = 'test';
        expectedResult = localizationStore
            .get(startLocale)[localizationKey]
            .replace(`{name}`, name);

        expect(getTranslation(startLocale, localizationKey, {name})).toEqual(expectedResult);
    });
});