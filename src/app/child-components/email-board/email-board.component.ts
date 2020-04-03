import { LocalizationService } from '../../services/localization/localization.service.api';
import { createElement, ElementConfig, Elements } from '../../utils/utils';

export class EmailBoardComponent {
    selfElement: HTMLElement;
    readonly CLASS: string = 'emails-board';
    readonly ELEMENT_TYPE: Elements = Elements.DIV;
    readonly buttons: string[] = ['addNewEmail'];

    readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE,
        classList: [
            this.CLASS
        ]
    };

    constructor(
        private readonly document: Document,
        private readonly localizationService: LocalizationService,
        private readonly emails: string[],
        private readonly callbacks: { [key: string]: () => any }
    ) {
        this.selfElement = createElement(document, this.config);
        this.initComponent();
    }

    private initComponent(): void {

        [...this.emails, ...this.buttons]
            .map((element: string) => this.createButton(element))
            .forEach((element: HTMLElement) => this.selfElement.appendChild(element))

    }


    private createItem(value: string = '') {

    }

    private createButton(buttonType: string): HTMLElement {
        return createElement(document, {
            type: Elements.INPUT,
            classList: [`${this.CLASS}__button`, `${this.CLASS}__button-${buttonType}`],
            attributes: {
                type: 'button',
                value: this.localizationService.translate(`board.button.${buttonType}`)
            },
            eventListeners: {
                click: this.callbacks[buttonType]
            }
        })
    }
}
