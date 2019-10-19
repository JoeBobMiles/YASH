// @file Text.ts
// @author Joseph R Miles <me@josephrmiles.com>
// @date 2019-10-19
//
// This file declares our Text class, used to represent the text SVG element.

import { ISVGElement } from "./ISVGELement";
import { TextFontProperties } from "./TextFontProperties";

export class Text implements ISVGElement {

    /** @type {string} The body of the text element. */
    private body: string = "";

    /** @type {number} The x position of the text element. */
    private x: number = 0;

    /** @type {number} The y position of the text element. */
    private y: number = 0;

    /**
     * The position of the text anchor w/r to the text body and the baseline.
     * This cannot control the y position of the text anchor, only the x
     * position.
     *
     * @type {string}
     */
    private textAnchor: string = "";

    /** @type {TextFontProperties} The font properites of the text object. */
    private fontProperties: TextFontProperties = new TextFontProperties();

    /**
     * Creates a Text instance that has the given [body], [x], [y], and
     * [fonts] families.
     *
     * @param  {string}      body The body of the Text object.
     * @param  {number}      x    The x of the Text object.
     * @param  {number}      y    The y of the Text object.
     * @param  {string[] =    null}        fonts The font families to use.
     *
     * @return {Text}             A newly created Text.
     */
    constructor (
        body: string,
        x: number,
        y: number,
        fonts: string[] = null
    ) {
        this.body = body;
        this.x = x;
        this.y = y;

        this.fontProperties.family = fonts;
    }

    /**
     * Takes the information from the Text object and generates an Element
     * that can be added to the SVG and rendered by the browser.
     *
     * @return {Element} A newly created Element.
     */
    public toXML (): Element {
        const element: Element = document.createElementNS("http://www.w3.org/2000/svg",
                                                          "text");

        element.innerHTML = this.body;
        element.setAttribute("x", this.x.toString());
        element.setAttribute("y", this.y.toString());

        if (this.fontProperties.family)
            element.setAttribute("font-family",
                                 this.fontProperties.family.join(","));

        element.setAttribute("font-size", this.fontProperties.size);
        element.setAttribute("fill", this.fontProperties.color);
        element.setAttribute("font-weight", this.fontProperties.weight);
        element.setAttribute("text-anchor", this.textAnchor);

        return element;
    }

    /**
     * Sets the [body] text of the Text object to the given [body] text.
     *
     * @param  {string} body The new body of the Text object.
     *
     * @return {Text}        The modified Text object.
     */
    public setBody (body: string): Text {
        this.body = body;

        return this;
    }

    /**
     * Sets the position of the text object to the [x] and [y] positions
     * given.
     *
     * @param  {number} x The x position to move to.
     * @param  {number} y The y position to move to.
     *
     * @return {Text}     The modified Text object.
     */
    public setPosition (x: number, y: number): Text {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Set's the font families of the Text object to that of the families
     * given in [fonts].
     *
     * @param  {string[]} fonts A list of font family names.
     *
     * @return {Text}           The modified Text object.
     */
    public setFonts (fonts: string[]): Text {
        this.fontProperties.family = fonts;

        return this;
    }

    /**
     * Sets the [color] attribute of the Text object's font.
     *
     * @param  {string} color The color to set the Text to.
     *
     * @return {Text}         The modified Text object.
     */
    public setColor (color: string): Text {
        this.fontProperties.color = color;

        return this;
    }

    /**
     * Sets the [size] attribute of the Text object's font.
     *
     * @param  {(string | number)}     size The size to set the Text to.
     *
     * @return {Text}         The modified Text object.
     */
    public setSize (size: (string | number)): Text {
        if (typeof size === "number")
            this.fontProperties.size = size.toString();
        else
            this.fontProperties.size = size;

        return this;
    }

    /**
     * Sets the font [weight] attribute of the Text object's font.
     *
     * @param  {(string | number)}     weight The weight to set the Text to.
     *
     * @return {Text}         The modified Text object.
     */
    public setWeight (weight: (string | number)): Text {
        if (typeof weight === "number")
            this.fontProperties.weight = weight.toString();
        else
            this.fontProperties.weight = weight;

        return this;
    }

    /**
     * Sets the text anchor [position] of the Text object.
     *
     * @param  {string} position A text anchor position enum value.
     *
     * @return {Text}            The modified Text object.
     */
    public setAnchor (position: string): Text {
        this.textAnchor = position;

        return this;
    }
}
