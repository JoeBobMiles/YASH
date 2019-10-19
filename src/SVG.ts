// @file SVG.ts
// @author Joseph R Miles <me@josephrmiles.com>
// @date 2019-10-19
//
// This declares our SVG class that represents an SVG image renderable on the
// DOM.

import { ISVGElement } from "./ISVGElement";

export class SVG {

    /** @type {string} The selector used to find the SVG canvas in the DOM */
    private selector: string = "";

    /** @type {ISVGElement[]} The elements to put inside the SVG canvas. */
    private elements: ISVGElement[] = [];


    /**
     * Creates a new SVG instance that uses the given [selector] and
     * [elements]. By default, the [selector] targets any <svg>s present in
     * the document, and the [elements] array starts as empty.
     *
     * @param  {string       = ""}          selector A DOM selector
     * @param  {ISVGElement[] = []}         elements An array of ISVGElements.
     *
     * @return {SVG}               A new SVG instance.
     */
    constructor (selector: string = "", elements: ISVGElement[] = []) {
        this.selector = selector;
        this.elements = elements;
    }

    /**
     * Adds the given [element] to the SVG's elements array.
     *
     * @param  {ISVGElement} element An SVGElement.
     *
     * @return {SVG}                The modified SVG instance.
     */
    public add (element: ISVGElement): SVG {
        this.elements.push(element);
        return this;
    }

    /**
     * Publishes the elements containd in the SVG instance to the first
     * element matching the SVG instance's selector. BE WARNED, THIS DOES
     * NOT VALIDATE THAT svg IS A SVG DOM ELEMENT!
     */
    public render (): void {
        const svg = document.querySelectorAll(this.selector)[0];

        this.elements.forEach((elem: ISVGElement) => svg.appendChild(elem.toXML()));
    }
}