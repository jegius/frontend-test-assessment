export const EMAIL_VALIDATION: RegExp = /^\w+@\w+\.\w+$/;

export enum DeepCallbackType {
    ADD_NEW_EMAIL = 'addNewEmail',
    REMOVE_EMAIL = 'removeEmail',
    REMOVE_LAST_EMAIL = 'removeLastEmail',
    UPDATE_EMAIL = 'updateEmail',
    CHECK_EMAILS = 'checkEmails',
    SET_NOTIFICATION = 'setNotification',
    REWRITE_COMPONENT = 'rewriteComponent',
    CREATE_NEW_EMAIL_FIELD = 'createNewEmailField'
}


export interface ComponentApi {
    getEnteredEmails(): string[];

    setEmails(emails: string[]): void;

    subscribeOnChanges(callback: (emails: string[]) => void): Subscription;
}

export class Subscription {
    private subscriptionNumber: number;

    constructor(
        private readonly subscriptions: Subscription[],
        public readonly callback: (emails: string[]) => void,
    ) {
        this.subscriptionNumber = subscriptions.length;
    }

    unsubscribe(): void {
        this.subscriptions.splice(this.subscriptionNumber, 1);
    }
}

export enum ButtonKey {
    ENTER = 'Enter',
    COMMA = ',',
    BACKSPACE = 'Backspace'
}