import { createElement, ElementConfig, Elements } from './utils';

describe('Utils', () => {

    it('should created HTML element according provided element type.', () => {
        const document: Document = window.document;
        const config: ElementConfig = {
            type: Elements.DIV
        };
        let expectedElement: HTMLElement = document.createElement(Elements.DIV);
        let result: HTMLElement = createElement(document, config);
        expect(result).toEqual(expectedElement);

        config.type = Elements.SPAN;
        expectedElement = document.createElement(Elements.SPAN);
        result = createElement(document, config);
        expect(result).toEqual(expectedElement);

        config.type = Elements.INPUT;
        expectedElement = document.createElement(Elements.INPUT);
        result = createElement(document, config);
        expect(result).toEqual(expectedElement);
    });

    it('should add provided class to created Element.', () => {
        const document: Document = window.document;
        const classList: string[] = ['test', 'test2', 'test3'];
        const config: ElementConfig = {
            type: Elements.DIV,
            classList
        };

        const result: HTMLElement = createElement(document, config);
        const expectedResult: string = classList
            .reduce((accumulator: string, element: string) => `${accumulator} ${element}`, '')
            .trim();
        expect(result.className).toEqual(expectedResult);
    });

    it('should add provided content to created Element.', () => {
        const document: Document = window.document;
        const content: string = 'mock content';
        const config: ElementConfig = {
            type: Elements.DIV,
            content
        };

        const result: HTMLElement = createElement(document, config);
        expect(result.innerText).toEqual(content);
    });

    it('should add provided HTMLElement to created Element.', () => {
        const document: Document = window.document;
        const innerComponent: HTMLElement[] = [
            document.createElement(Elements.INPUT),
            document.createElement(Elements.SPAN),
            document.createElement(Elements.DIV),
        ];
        const config: ElementConfig = {
            type: Elements.DIV,
            innerComponent
        };
        const expectedResult: HTMLElement = document.createElement(Elements.DIV);
        expectedResult.appendChild(document.createElement(Elements.INPUT));
        expectedResult.appendChild(document.createElement(Elements.SPAN));
        expectedResult.appendChild(document.createElement(Elements.DIV));
        const result: HTMLElement = createElement(document, config);

        expect(result.innerHTML).toEqual(expectedResult.innerHTML);
    });

    it('should add provided attribute to created Element.', () => {
        const document: Document = window.document;
        const test: string = 'test';
        const attributes: { [key: string]: string } = {
            test
        };
        const config: ElementConfig = {
            type: Elements.DIV,
            attributes
        };

        const result: HTMLElement = createElement(document, config);

        expect(result.getAttribute(test)).toEqual(test);
    });

    it('should add provided event listener to created Element.', () => {
        const document: Document = window.document;
        const callback: () => any = jasmine.createSpy();
        const eventListeners: { [key: string]: () => any } = {
            click: callback
        };
        const config: ElementConfig = {
            type: Elements.DIV,
            eventListeners
        };

        const result: HTMLElement = createElement(document, config);
        result.click();

        expect(callback).toHaveBeenCalled();
    });
});