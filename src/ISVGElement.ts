// @file ISVGElement.ts
// @author Joseph R Miles <me@josephrmiles.com>
// @date 2019-10-19
//
// This is our definition of our ISVGElement interface, shared by all elements
// that can be rendered in an SVG image.

export interface ISVGElement {

    /**
     * Generates an XML Element based on the information stored in the
     * SVGElement instance.
     *
     * @return {Element} A XML Element instance.
     */
    toXML (): Element;

}