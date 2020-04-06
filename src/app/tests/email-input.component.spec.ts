import { EmailInputComponent } from '../email-input.component';
import { ComponentApi, EMAIL_VALIDATION, Subscription } from '../services/common-api';

describe('EmailInputComponent', () => {
    let host: HTMLElement;

    beforeEach(() => {
        host = window.document.createElement('div');
    });

    afterEach(() => {
        host = null;
    });

    it('should be created.', () => {
        const emailInputComponent: EmailInputComponent = new EmailInputComponent(
            host,
            document,
        );

        expect(emailInputComponent).toBeTruthy('EmailInputComponent not found!');
    });

    it('EMAIL_VALIDATION RegExp should return false for incorrect ' +
        'emails and true for valid.', () => {
        const valid: string = 'test@test.com';
        const invalid: string = 'test';

        expect(EMAIL_VALIDATION.test(valid)).toBeTrue();
        expect(EMAIL_VALIDATION.test(invalid)).toBeFalse();
    });

    it('should return component api', () => {
        const componentApi: ComponentApi = new EmailInputComponent(
            host,
            document,
        ).render();

        expect(componentApi).toBeTruthy();
    });

    it('should add emails to component after call method setEmail ' +
        'and return it after call getEnteredEmails method', () => {
        const mockEmails: string[] = ['test@test.com', 'testTwo@test.com'];
        const componentApi: ComponentApi = new EmailInputComponent(
            host,
            document,
        ).render();
        componentApi.setEmails(mockEmails);

        expect(componentApi.getEnteredEmails()).toEqual(mockEmails);
    });

    it('should return subscription on email changes', () => {
        const mockEmails: string[] = ['test@test.com', 'testTwo@test.com'];
        const componentApi: ComponentApi = new EmailInputComponent(
            host,
            document,
        ).render();
        const callback: jasmine.Spy = jasmine.createSpy();
        componentApi.subscribeOnChanges(callback);
        componentApi.setEmails(mockEmails);

        expect(callback).toHaveBeenCalledWith(mockEmails);
    });

    it('should opportunity for unsubscribe from changes', () => {
        const mockEmails: string[] = ['test@test.com', 'testTwo@test.com'];
        const componentApi: ComponentApi = new EmailInputComponent(
            host,
            document,
        ).render();
        const callback: jasmine.Spy = jasmine.createSpy();
        const subscription: Subscription = componentApi.subscribeOnChanges(callback);
        componentApi.setEmails(mockEmails);

        expect(callback).toHaveBeenCalledWith(mockEmails);

        callback.calls.reset();
        subscription.unsubscribe();
        componentApi.setEmails(mockEmails);

        expect(callback).not.toHaveBeenCalled();
    });
});