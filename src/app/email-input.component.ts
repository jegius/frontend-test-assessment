import { createElement, ElementConfig, Elements } from './utils/utils';
import { Locale, LocalizationService } from './services/localization/localization.service.api';
import { EmailsFooterComponent } from './child-components/footer/emails-footer.component';
import { EmailModel, EmailService } from './services/email/email.service.api';
import { EmailBoardComponent } from './child-components/email-board/email-board.component';
import { ComponentApi, DeepCallbackType } from './services/common-api';
import { LocalizationServiceImplementation } from './services/localization/localization.service';
import { EmailServiceImplementation } from './services/email/email.service';

export class EmailInputComponent {

    private selfElement: HTMLElement;
    private readonly CLASS: string = 'emails-input';
    private readonly ELEMENT_TYPE: Elements = Elements.DIV;
    private readonly selfWrapper: HTMLElement;
    private readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE,
        classList: [
            this.CLASS
        ]
    };
    private readonly notification: HTMLElement;
    private boardName: string = '<b>Board name</b>';
    private boardComponent: EmailBoardComponent;

    constructor(
        private readonly host: HTMLElement,
        private readonly document: Document = window.document,
        private readonly localizationService: LocalizationService = new LocalizationServiceImplementation(),
        private readonly emailService: EmailService = new EmailServiceImplementation(),
    ) {
        this.notification = createElement(
            this.document, {
                type: Elements.SPAN,
                classList: [`${this.CLASS}__notification`]
            }
        );
        this.selfWrapper = createElement(
            this.document, {
                type: Elements.DIV,
                classList: [`${this.CLASS}__wrapper`]
            }
        );
        this.rewriteApp();
        window.addEventListener('paste', this.onEmailsPaste.bind(this));
    }

    /**
     * Function for render component on host page. Component will provide component api
     * after call of this method. See: {@link ComponentApi}. With using this api you can:
     * - getEnteredEmails() => string[]: Get all entered emails from component.
     * - setEmails(args: string[]) => void: Set you email and replace all emails in component to your emails
     * - subscribeOnChanges(callback) => subscription: Subscription on all email changes.
     *
     * @return ComponentApi Object with component API.
     **/
    render(): ComponentApi {
        this.host.appendChild(this.selfWrapper);
        this.selfWrapper.appendChild(this.selfElement);

        return {
            getEnteredEmails: this.emailService.getEnteredEmails.bind(this.emailService),
            setEmails: this.emailService.setEmails.bind(this.emailService, this.rewriteApp.bind(this)),
            subscribeOnChanges: this.emailService.subscribeOnChanges.bind(this.emailService),
        };
    }

    private onEmailsPaste({clipboardData}: ClipboardEvent): void {
        const callback: (model: EmailModel) => void =
            this.boardComponent.createAndPasteItem.bind(this.boardComponent);

        clipboardData
            .getData('text')
            .split(',')
            .forEach((email: string) => this
                .emailService
                .addEmail(email.trim(), callback)
            );
        this.boardComponent.checkEmails();
    }

    private addRandomEmail(): void {
        const callback: (model: EmailModel) => void =
            this.boardComponent.createAndPasteItem.bind(this.boardComponent);
        this.emailService.addRandomEmail(callback);
    }

    private addNewEmail(email: string, callback?: (model: EmailModel) => void): void {
        this.emailService.addEmail(email, callback);
    }

    private removeEmail(emailId: string): void {
        this.emailService.remove(emailId);
    }

    private removeLastEmail(): void {
        this.emailService.removeLast();
        this.rewriteApp();
    }

    private updateEmail(newEmail: EmailModel): void {
        this.emailService.update(newEmail);
    }

    private getCount(): void {
        alert(this.emailService.getEmailCount());
    }

    private changeLocale(): void {
        this.localizationService.getCurrentLocale() === Locale.EN ?
            this.localizationService.changeLocale(Locale.RU) :
            this.localizationService.changeLocale(Locale.EN);

        this.rewriteApp();
    }

    private setNotification(message: string): void {
        this.notification.innerText = message;
        const boardWrapper: HTMLElement = this
            .selfElement
            .querySelector(`.${this.CLASS}__board-wrapper`);

            boardWrapper.className = message ?
                `${this.CLASS}__board-wrapper ${this.CLASS}__board-wrapper_invalid` :
                `${this.CLASS}__board-wrapper`;
    }

    private rewriteApp(): void {
        if (this.selfElement) {
            this.selfWrapper.removeChild(this.selfElement);
        }

        this.selfElement = createElement(document, this.config);
        this.selfWrapper.appendChild(this.selfElement);
        this.boardComponent = new EmailBoardComponent(
            this.document,
            this.localizationService,
            this.emailService,
            {
                [DeepCallbackType.ADD_NEW_EMAIL]: this.addNewEmail.bind(this),
                [DeepCallbackType.REMOVE_EMAIL]: this.removeEmail.bind(this),
                [DeepCallbackType.UPDATE_EMAIL]: this.updateEmail.bind(this),
                [DeepCallbackType.SET_NOTIFICATION]: this.setNotification.bind(this),
                [DeepCallbackType.REWRITE_COMPONENT]: this.rewriteApp.bind(this),
                [DeepCallbackType.REMOVE_LAST_EMAIL]: this.removeLastEmail.bind(this),
            }
        );

        [
            createElement(
                this.document, {
                    type: Elements.DIV,
                    classList: [`${this.CLASS}__body`],
                    innerComponent: [
                        createElement(
                            this.document, {
                                type: Elements.SPAN,
                                classList: [`${this.CLASS}__title`],
                                content: this.localizationService
                                    .translate('emailInput.header', {name: this.boardName})
                            }
                        ),
                        this.notification,
                        createElement(
                            this.document, {
                                type: Elements.DIV,
                                classList: [`${this.CLASS}__board-wrapper`],
                                innerComponent: [this.boardComponent.selfElement]
                            }
                        ),

                    ]
                },
            ),
            createElement(
                this.document, {
                    type: Elements.DIV,
                    classList: [`${this.CLASS}__footer`],
                    innerComponent: [new EmailsFooterComponent(
                        this.document,
                        this.localizationService,
                        {
                            addRandomEmail: this.addRandomEmail.bind(this),
                            getCount: this.getCount.bind(this),
                            changeLocale: this.changeLocale.bind(this)
                        }
                    ).selfElement]
                }
            )
        ].forEach((element: HTMLElement) => this.selfElement.appendChild(element));
    }
}