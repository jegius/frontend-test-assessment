import { LocalizationService } from '../../../services/localization/localization.service.api';
import { EmailsFooterComponent } from '../emails-footer.component';

describe('EmailsFooterComponent', () => {
    let host: HTMLElement;
    let localizationService: LocalizationService;

    beforeEach(() => {
        localizationService = jasmine.createSpyObj<LocalizationService>('LocalizationService', ['translate']);
        (localizationService.translate as jasmine.Spy).and.returnValue('');
    });

    afterEach(() => {
        host = null;
        localizationService = null;
    });

    it('should be created.', () => {
        const mockButtonName: string = 'test';
        const callbacks: { [key: string]: () => void } = {
            [mockButtonName]: jasmine.createSpy(),
        };
        const emailsFooterComponent: EmailsFooterComponent = new EmailsFooterComponent(
            document,
            localizationService,
            callbacks
        );

        expect(emailsFooterComponent).toBeTruthy('EmailsFooterComponent not found!');
    });

    it('should created with provided button.', () => {
        const mockButtonNameOne: string = 'testOne';
        const mockButtonNameTwo: string = 'testTwo';
        const callbacks: { [key: string]: () => void } = {
            [mockButtonNameOne]: jasmine.createSpy(),
            [mockButtonNameTwo]: jasmine.createSpy(),
        };
        const emailsFooterComponent: EmailsFooterComponent = new EmailsFooterComponent(
            document,
            localizationService,
            callbacks
        );
        const expectedButtonQuantity: number = 2;
        const buttonClass: string = `.${emailsFooterComponent.CLASS}__button`;
        const buttonQuantity: number = emailsFooterComponent
            .selfElement
            .querySelectorAll(buttonClass)
            .length;

        expect(buttonQuantity).toEqual(expectedButtonQuantity);

        const firstButton: HTMLElement = emailsFooterComponent
            .selfElement
            .querySelector(`.${emailsFooterComponent.CLASS}__button-${mockButtonNameOne}`);
        const secondButton: HTMLElement = emailsFooterComponent
            .selfElement
            .querySelector(`.${emailsFooterComponent.CLASS}__button-${mockButtonNameTwo}`);

        firstButton.click();
        secondButton.click();

        expect(callbacks[mockButtonNameOne]).toHaveBeenCalled();
        expect(callbacks[mockButtonNameTwo]).toHaveBeenCalled();
    });

    it('should created with provided button.', () => {
        const callbacks: { [key: string]: () => void } = {
            ['1']: jasmine.createSpy(),
            ['2']: jasmine.createSpy(),
            ['3']: jasmine.createSpy(),
            ['4']: jasmine.createSpy(),
            ['5']: jasmine.createSpy(),
        };
        const emailsFooterComponent: EmailsFooterComponent = new EmailsFooterComponent(
            document,
            localizationService,
            callbacks
        );
        const expectedButtonQuantity: number = 5;
        const buttonClass: string = `.${emailsFooterComponent.CLASS}__button`;
        const buttonQuantity: number = emailsFooterComponent
            .selfElement
            .querySelectorAll(buttonClass)
            .length;

        expect(buttonQuantity).toEqual(expectedButtonQuantity);
    });
});