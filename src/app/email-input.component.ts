import { createElement, ElementConfig, Elements } from './utils/utils';
import { Locale, LocalizationService } from './services/localization/localization.service.api';
import { EmailsFooterComponent } from './child-components/footer/emails-footer.component';
import { EmailService } from './services/email/email.service.api';
import { EmailBoardComponent } from './child-components/email-board/email-board.component';

export class EmailInputComponent {

    selfElement: HTMLElement;
    readonly CLASS: string = 'emails-input';
    readonly ELEMENT_TYPE: Elements = Elements.DIV;

    readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE,
        classList: [
            this.CLASS
        ]
    };
    private boardName: string = '<b>Board name</b>';

    constructor(
        private readonly document: Document,
        private readonly host: HTMLElement,
        private readonly localizationService: LocalizationService,
        private readonly emailService: EmailService
    ) {
        this.rewriteApp();
    }

    render(): void {
        this.host.appendChild(this.selfElement);
    }

    private addRandomEmail(): void {
        console.log('Add new')
    }

    private addNewEmail(email: string): void {
        console.log(email);
    }

    private removeEmail(email: string): void {

    }

    private updateEmail(oldValue: string, newValue: string): void {

    }

    private getCount(): void {
        console.log('getCount')
    }

    private changeLocale(): void {
        this.localizationService.getCurrentLocale() === Locale.EN ?
            this.localizationService.changeLocale(Locale.RU) :
            this.localizationService.changeLocale(Locale.EN);

        this.rewriteApp();
    }

    private rewriteApp(): void {
        if (this.selfElement) {
            this.host.removeChild(this.selfElement);
        }

        this.selfElement = createElement(document, this.config);
        this.host.appendChild(this.selfElement);

        [
            createElement(
                this.document, {
                    type: Elements.DIV,
                    classList: [`${this.CLASS}__body`],
                    innerComponent: [createElement(
                        this.document, {
                            type: Elements.SPAN,
                            classList: [`${this.CLASS}__title`],
                            content: this.localizationService
                                .translate('emailInput.header', {name: this.boardName})
                        }
                    ), new EmailBoardComponent(
                        this.document,
                        this.localizationService,
                        this.emailService.getEmails(),
                        {
                            addNewEmail: this.addNewEmail.bind(this),
                            removeEmail: this.removeEmail.bind(this),
                            updateEmail: this.updateEmail.bind(this)
                        }
                    ).selfElement]
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