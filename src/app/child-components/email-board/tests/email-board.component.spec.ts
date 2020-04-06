import { EmailBoardComponent } from '../email-board.component';
import { LocalizationService } from '../../../services/localization/localization.service.api';
import { EmailModel, EmailService } from '../../../services/email/email.service.api';
import { DeepCallbackType, ButtonKey } from '../../../services/common-api';

describe('EmailBoardComponent', () => {
    let host: HTMLElement;
    let localizationService: LocalizationService;
    let emailService: EmailService;

    beforeEach(() => {
        host = window.document.createElement('div');
        localizationService = jasmine.createSpyObj<LocalizationService>('LocalizationService', ['translate']);
        emailService = jasmine.createSpyObj<EmailService>('EmailService', ['getEmails']);

        (localizationService.translate as jasmine.Spy).and.returnValue([]);
        (emailService.getEmails as jasmine.Spy).and.returnValue([]);
    });

    afterEach(() => {
        host = null;
        localizationService = null;
        emailService = null;
    });

    it('should be created.', () => {
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );

        expect(emailBoardComponent).toBeTruthy('EmailBoardComponent not found!');
    });

    it('should be created with provided emails models.', () => {
        const mockModels: EmailModel[] = [
            {id: '1', email: ''},
            {id: '2', email: ''},
        ];
        (emailService.getEmails as jasmine.Spy).and.returnValue(mockModels);

        const emailItemClass: string = '.emails-item';
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );

        const expectedResult: number = mockModels.length;
        const childElementQuantity: number = emailBoardComponent.selfElement.querySelectorAll(emailItemClass).length;

        expect(childElementQuantity).toEqual(expectedResult);
    });

    it('should create new email item element after call of createAndPasteItem method.', () => {
        const emailItemClass: string = '.emails-item';
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );
        const expectedResult: number = 1;

        emailBoardComponent.createAndPasteItem({id: '1', email: ''});
        const childElementQuantity: number = emailBoardComponent
            .selfElement
            .querySelectorAll(emailItemClass)
            .length;

        expect(childElementQuantity).toEqual(expectedResult);
    });

    it('should create new email after click on addNewEmail button.', () => {
        const emailItemClass: string = '.emails-item';
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );
        const expectedResult: number = 1;
        const createButtonClass: string = `.${emailBoardComponent.CLASS}__button-addNewEmail`;

        const emailItem: HTMLElement = emailBoardComponent
            .selfElement
            .querySelector(createButtonClass) as HTMLElement;

        emailItem.click();

        let childElementQuantity: number = emailBoardComponent
            .selfElement
            .querySelectorAll(emailItemClass)
            .length;

        expect(childElementQuantity).toEqual(expectedResult);
    });

    it('should call set notification callback with empty notification if all emails in ' +
        'email service is valid.', () => {
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );

        emailBoardComponent.checkEmails();
        const notificationCallback: (message: string) => void = callbacks[DeepCallbackType.SET_NOTIFICATION];
        setTimeout(() => expect(notificationCallback).toHaveBeenCalledWith(''));
        (callbacks[DeepCallbackType.SET_NOTIFICATION] as jasmine.Spy).calls.reset();

        emailBoardComponent.checkEmails();
        (emailService.getEmails as jasmine.Spy).and.returnValue([{id: '1', email: 'correct@email.com'}]);
        setTimeout(() => expect(notificationCallback).toHaveBeenCalledWith(''));

    });

    it('should call notification callback with error notification if all emails in ' +
        'email service is valid.', () => {
        const expectedNotification: string = 'expected notification';
        (localizationService.translate as jasmine.Spy).and.returnValue(expectedNotification);
        (emailService.getEmails as jasmine.Spy).and.returnValue([{id: '1', email: 'incorrect'}]);

        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );
        emailBoardComponent.checkEmails();
        const notificationCallback: (message: string) => void = callbacks[DeepCallbackType.SET_NOTIFICATION];

        setTimeout(() => expect(notificationCallback).toHaveBeenCalledWith(expectedNotification));
    });

    it('should correctly work with keydown events: CREATE empty field after ' +
        'press on ENTER button', () => {
        const emailItemClass: string = '.emails-item';
        let expectedResult: number = 1;
        const spyEvent: KeyboardEvent = {
            key: ButtonKey.ENTER,
            target: null,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
            [DeepCallbackType.REMOVE_LAST_EMAIL]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');
        emailBoardComponent.onKeyDown(spyEvent);

        let childElementQuantity: number = emailBoardComponent
            .selfElement
            .querySelectorAll(emailItemClass)
            .length;

        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(childElementQuantity).toEqual(expectedResult);
    });

    it('should correctly work with keydown events: CREATE empty field after ' +
        'press on COMMA button', () => {
        const emailItemClass: string = '.emails-item';
        let expectedResult: number = 1;
        const spyEvent: KeyboardEvent = {
            key: ButtonKey.COMMA,
            target: null,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
            [DeepCallbackType.REMOVE_LAST_EMAIL]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');
        emailBoardComponent.onKeyDown(spyEvent);

        let childElementQuantity: number = emailBoardComponent
            .selfElement
            .querySelectorAll(emailItemClass)
            .length;

        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(childElementQuantity).toEqual(expectedResult);
    });

    it('should correctly work with keydown events: CREATE empty field after ' +
        'press on BACKSPACE button', () => {
        const spyEvent: KeyboardEvent = {
            key: ButtonKey.BACKSPACE,
            target: null,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.SET_NOTIFICATION]: jasmine.createSpy(),
            [DeepCallbackType.REMOVE_LAST_EMAIL]: jasmine.createSpy(),
        };
        const emailBoardComponent: EmailBoardComponent = new EmailBoardComponent(
            document,
            localizationService,
            emailService,
            callbacks
        );
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');
        emailBoardComponent.onKeyDown(spyEvent);


        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.REMOVE_LAST_EMAIL]).toHaveBeenCalled();
    });
});