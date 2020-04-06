import { checkPressButton, EmailItemComponent } from '../email-item.component';
import { DeepCallbackType, ButtonKey } from '../../../../services/common-api';
import { EmailModel } from '../../../../services/email/email.service.api';

describe('EmailItemComponent', () => {
    let host: HTMLElement;
    let emailItemComponent: EmailItemComponent;
    let emailModel: EmailModel;
    let callback: { [key: string]: () => void };

    beforeEach(() => {
        host = window.document.createElement('div');
        emailModel = {id: '22', email: 'test@test.com'};
        callback = {};
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            emailModel,
            callback
        );
    });

    afterEach(() => {
        host = null;
        emailItemComponent = null;
        emailModel = null;
        callback = null;
    });

    it('should be created.', () => {
        expect(emailItemComponent).toBeTruthy('EmailItemComponent not found!');
    });

    it('should return link to HTML element of component', () => {
        const expected: HTMLElement = document.createElement('div');
        expect(typeof emailItemComponent.selfElement).toEqual(typeof expected);
    });

    it('Should add _valid  modifier for valid email', () => {
        expect(emailItemComponent.selfElement.className)
            .toEqual(`${emailItemComponent.CLASS} ${emailItemComponent.CLASS}_valid`);
    });

    it('should add _invalid  modifier for invalid email', () => {
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '22', email: 'est.com'},
            {}
        );

        expect(emailItemComponent.selfElement.className)
            .toEqual(`${emailItemComponent.CLASS} ${emailItemComponent.CLASS}_invalid`);
    });

    it('should call remove callback correctly', () => {
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.REMOVE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        const spyOnHost: jasmine.Spy = spyOn(host, 'removeChild');
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '22', email: 'est.com'},
            callbacks
        );

        emailItemComponent.removeEmail();

        expect(spyOnHost).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.REMOVE_EMAIL]).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.CHECK_EMAILS]).toHaveBeenCalled();
    });

    it('should call remove and check emails callbacks after click on remove button', () => {
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.REMOVE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        const spyOnHost: jasmine.Spy = spyOn(host, 'removeChild');
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '22', email: 'est.com'},
            callbacks
        );
        const removeEmail: string = `.${emailItemComponent.CLASS}__close-button`;
        const closeButton: HTMLElement = emailItemComponent
            .selfElement
            .querySelector(removeEmail) as HTMLElement;

        closeButton.click();

        expect(spyOnHost).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.REMOVE_EMAIL]).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.CHECK_EMAILS]).toHaveBeenCalled();
    });

    it('checkPressButton should call blur after press on any button', () => {
        const target: HTMLInputElement = window.document.createElement('input');
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;

        const spyBlur: jasmine.Spy = spyOn(target, 'blur');
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');

        checkPressButton(spyEvent);

        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyBlur).not.toHaveBeenCalled();
        expect(spyPreventDefault).not.toHaveBeenCalled();
    });

    it('checkPressButton should call blur after press on ENTER', () => {
        const target: HTMLInputElement = window.document.createElement('input');
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;

        const spyBlur: jasmine.Spy = spyOn(target, 'blur');
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');

        checkPressButton({...spyEvent, ...{key: ButtonKey.ENTER}});

        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyBlur).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();
    });

    it('checkPressButton should call blur after press on COMMA', () => {
        const target: HTMLInputElement = window.document.createElement('input');
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;

        const spyBlur: jasmine.Spy = spyOn(target, 'blur');
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');

        checkPressButton({...spyEvent, ...{key: ButtonKey.COMMA}});

        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyBlur).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();
    });

    it('should add correct class for email input if provided incorrect email', () => {
        const invalidValue: string = 'dff';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = invalidValue;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.REMOVE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        const emailItemComponent: EmailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '22', email: 'est.com'},
            callbacks
        );
        const invalidClass: string = `${emailItemComponent.CLASS}_invalid`;

        emailItemComponent.onEmailChange(spyEvent);

        const isInvalidClassAdded: boolean = emailItemComponent.selfElement.classList.contains(invalidClass);
        expect(isInvalidClassAdded).toBeTruthy();
        expect(spyStopPropagation).toHaveBeenCalled();
    });

    it('should add valid class if provided correct email address', () => {
        const validValue: string = 'test@test.com';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = validValue;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');

        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.REMOVE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '22', email: 'est.com'},
            callbacks
        );
        const validClass: string = `${emailItemComponent.CLASS}_valid`;

        emailItemComponent.onEmailChange(spyEvent);

        const isValidClassAdded: boolean = emailItemComponent.selfElement.classList.contains(validClass);
        expect(isValidClassAdded).toBeTruthy();
        expect(spyStopPropagation).toHaveBeenCalled();

    });

    it('should make blur for input if user press on ENTER or COMMA button', () => {
        const validValue: string = 'test@test.com';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = validValue;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const spyBlur: jasmine.Spy = spyOn(target, 'blur');
        const spyStopPropagation: jasmine.Spy = spyOn(spyEvent, 'stopPropagation');
        const spyPreventDefault: jasmine.Spy = spyOn(spyEvent, 'preventDefault');

        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.REMOVE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '22', email: 'est.com'},
            callbacks
        );
        emailItemComponent.onEmailChange({...spyEvent, ...{key: ButtonKey.COMMA}});

        expect(spyBlur).toHaveBeenCalled();
        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();

        spyBlur.calls.reset();
        spyStopPropagation.calls.reset();
        spyPreventDefault.calls.reset();

        emailItemComponent.onEmailChange({...spyEvent, ...{key: ButtonKey.ENTER}});

        expect(spyBlur).toHaveBeenCalled();
        expect(spyStopPropagation).toHaveBeenCalled();
        expect(spyPreventDefault).toHaveBeenCalled();
    });

    it('should call ADD_NEW_EMAIL callback if current input isn`t have em' +
        'ail with id and input value isn`t empty', () => {
        const validValue: string = 'test@test.com';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = validValue;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;

        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.ADD_NEW_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '', email: ''},
            callbacks
        );
        emailItemComponent.onBlur(spyEvent);

        expect(callbacks[DeepCallbackType.ADD_NEW_EMAIL]).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.CHECK_EMAILS]).toHaveBeenCalled();
        expect(emailItemComponent.emailModel.email).toEqual(validValue);
    });

    it('should remove email item if target value is empty and model ' +
        'isn`t contain email id', () => {
        const value: string = '';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = value;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;

        const callbacks: { [key: string]: () => void } = {};
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '', email: ''},
            callbacks
        );
        const spyOnHost: jasmine.Spy = spyOn(host, 'removeChild');

        emailItemComponent.onBlur(spyEvent);

        expect(spyOnHost).toHaveBeenCalled();
    });

    it('should remove email and call remove callback after blur event ' +
        'emit if target value is empty', () => {
        const value: string = '';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = value;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;

        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.REMOVE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '1', email: ''},
            callbacks
        );
        const spyOnHost: jasmine.Spy = spyOn(host, 'removeChild');

        emailItemComponent.onBlur(spyEvent);

        expect(spyOnHost).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.REMOVE_EMAIL]).toHaveBeenCalled();
        expect(callbacks[DeepCallbackType.CHECK_EMAILS]).toHaveBeenCalled();
    });

    it('should update email after blur for email model with corrected ID', () => {
        const email: string = 'test@test.com';
        const target: HTMLInputElement = window.document.createElement('input');
        target.value = email;
        const spyEvent: KeyboardEvent = {
            key: 'test',
            target: target as EventTarget,
            stopPropagation: null,
            preventDefault: null,
        } as KeyboardEvent;
        const callbacks: { [key: string]: () => void } = {
            [DeepCallbackType.UPDATE_EMAIL]: jasmine.createSpy(),
            [DeepCallbackType.CHECK_EMAILS]: jasmine.createSpy(),
        };
        emailItemComponent = new EmailItemComponent(
            document,
            host,
            {id: '1', email: ''},
            callbacks
        );

        const expectedValue: EmailModel = {id: '1', email};
        emailItemComponent.onBlur(spyEvent);

        const updateCallback: (model: EmailModel) => void = callbacks[DeepCallbackType.UPDATE_EMAIL];
        expect(updateCallback).toHaveBeenCalledWith(expectedValue);
        expect(callbacks[DeepCallbackType.CHECK_EMAILS]).toHaveBeenCalled();
    });
});