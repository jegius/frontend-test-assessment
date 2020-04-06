import { LocalizationService } from '../../services/localization/localization.service.api';
import { createElement, ElementConfig, Elements } from '../../utils/utils';
import { EmailItemComponent } from './item/email-item.component';
import { DeepCallbackType, EMAIL_VALIDATION, ButtonKey } from '../../services/common-api';
import { EmailModel, EmailService, } from '../../services/email/email.service.api';

export class EmailBoardComponent {
    readonly selfElement: HTMLElement;
    readonly CLASS: string = 'emails-board';
    private readonly ELEMENT_TYPE: Elements = Elements.DIV;
    private readonly buttons: string[] = ['addNewEmail'];
    private readonly controlElements: HTMLElement[] = [];

    readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE,
        classList: [
            this.CLASS
        ]
    };

    constructor(
        private readonly document: Document,
        private readonly localizationService: LocalizationService,
        private readonly emailService: EmailService,
        private readonly callbacks: { [key: string]: () => any }
    ) {
        this.callbacks[DeepCallbackType.CHECK_EMAILS] = this.checkEmails.bind(this);
        this.callbacks[DeepCallbackType.CREATE_NEW_EMAIL_FIELD] = this.createEmptyEmailField.bind(this);

        this.selfElement = createElement(document, this.config);
        this.document.onkeydown = this.onKeyDown.bind(this);
        this.initComponent();
    }

    /**
     * Method for create new email item component by provided
     * model. This method add new item in board component automatically.
     * @params
     * @param model EmailModel Provided email model.
     * @return void.
     **/
    createAndPasteItem(model: EmailModel): void {
        const item: HTMLElement = this.createItem(model);
        this.selfElement.insertBefore(item, this.controlElements[0]);
    }

    /**
     * Function for email validation. You can use it for check board component. After
     * this method calling will added class and display validation message.
     * @return void.
     **/
    checkEmails(): void {
        const isEmailsValid: boolean = this
            .emailService
            .getEmails()
            .every(({email}: EmailModel) => EMAIL_VALIDATION.test(email));

        setTimeout(() => this
            .setNotification(isEmailsValid, 'board.error.message'), 0);
    }

    /**
     * @internal Function get provided event from keydown event listener. Need for
     * create empty field for new email creation or removing last email after press on
     * backspace key.
     * @params
     * @param event KeyboardEvent Keyboard event provided by keydown event listener.
     * @return void.
     **/
    onKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();

        if (event.key === ButtonKey.ENTER || event.key === ButtonKey.COMMA) {
            event.preventDefault();
            this.createEmptyEmailField();
        } else if (event.key === ButtonKey.BACKSPACE) {
            event.preventDefault();
            this.callbacks[DeepCallbackType.REMOVE_LAST_EMAIL]();
        }
    }

    private initComponent(): void {
        [
            ...this.emailService.getEmails()
                .map((element: EmailModel) => this.createItem(element)),
            ...this.buttons
                .map((element: string) => this.createButton(element))
        ].forEach((element: HTMLElement) => this.selfElement.appendChild(element));
        this.checkEmails();
    }

    private setNotification(isValid: boolean, errorMessageKey?: string): void {
        if (isValid) {
            this.callbacks[DeepCallbackType.SET_NOTIFICATION].call(null, '');
        } else {
            this.callbacks[DeepCallbackType.SET_NOTIFICATION]
                .call(null, this.localizationService.translate(errorMessageKey));
        }
    }

    private createItem(value: EmailModel = {id: '', email: ''}): HTMLElement {
        return new EmailItemComponent(
            this.document,
            this.selfElement,
            value,
            this.callbacks,
        ).selfElement;
    }

    private createEmptyEmailField(): void {
        const newItem: HTMLElement = this.createItem();
        this.selfElement.insertBefore(newItem, this.controlElements[0]);
    }

    private createButton(buttonType: string): HTMLElement {
        const createdElement: HTMLElement = createElement(document, {
            type: Elements.INPUT,
            classList: [`${this.CLASS}__button`, `${this.CLASS}__button-${buttonType}`],
            attributes: {
                type: 'button',
                value: this.localizationService.translate(`board.button.${buttonType}`)
            },
            eventListeners: {
                click: this.createEmptyEmailField.bind(this)
            }
        });

        this.controlElements.push(createdElement);
        return createdElement;
    }
}
