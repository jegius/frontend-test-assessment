import { createElement, ElementConfig, Elements } from '../../../utils/utils';

export class EmailItemComponent {
    selfElement: HTMLElement;
    readonly CLASS: string = 'emails-item';
    readonly ELEMENT_TYPE: Elements = Elements.DIV;

    readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE,
        classList: [
            this.CLASS
        ]
    };

    constructor(
        private readonly document: Document,
        private readonly emails: string,
        private readonly callbacks: { [key: string]: () => any }
    ) {
        this.selfElement = createElement(document, this.config);
    }
}
