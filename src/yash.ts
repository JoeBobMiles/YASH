/// @file yash.ts
/// @author Joseph R Miles <me@josephrmiles.com>
/// @date 2019-10-16
///
/// This is the core file for YASH (Yet Another SVG Helper).

namespace YASH {

    /** @type {boolean} ABSOLUTE = SVG draws with absolute coordinates. */
    export const ABSOLUTE: boolean = false;

    /** @type {boolean} RELATIVE = SVG draws with relative coordinates. */
    export const RELATIVE: boolean = true;


    /// This class represents a SVG canvas in the DOM.
    export class SVG {

        /** @type {string} The selector used to find the SVG canvas in the DOM */
        private selector: string = "";

        /** @type {SVGElement[]} The elements to put inside the SVG canvas. */
        private elements: SVGElement[] = [];


        /**
         * Creates a new SVG instance that uses the given [selector] and
         * [elements]. By default, the [selector] targets any <svg>s present in
         * the document, and the [elements] array starts as empty.
         *
         * @param  {string       = ""}          selector A DOM selector
         * @param  {SVGElement[] = []}          elements An array of SVGElements.
         *
         * @return {SVG}               A new SVG instance.
         */
        constructor (selector: string = "", elements: SVGElement[] = []) {
            this.selector = selector;
            this.elements = elements;
        }

        /**
         * Adds the given [element] to the SVG's elements array.
         *
         * @param  {SVGElement} element An SVGElement.
         *
         * @return {SVG}                The modified SVG instance.
         */
        add (element: SVGElement): SVG {
            this.elements.push(element);
            return this;
        }

        /**
         * Publishes the elements containd in the SVG instance to the first
         * element matching the SVG instance's selector. BE WARNED, THIS DOES
         * NOT VALIDATE THAT svg IS A SVG DOM ELEMENT!
         */
        render (): void {
            const svg = document.querySelectorAll(this.selector)[0];

            this.elements.forEach((elem: SVGElement) => svg.appendChild(elem.toXML()));
        }
    }

    /// This is the interface that defines the common functionality required
    /// from all SVG elements.
    interface SVGElement {

        /**
         * Generates an XML Element based on the information stored in the
         * SVGElement instance.
         *
         * @return {Element} A XML Element instance.
         */
        toXML (): Element;

    }

    /// This class represents a Path element in the SVG document.
    export class Path implements SVGElement {

        /**
         * The string that contains the insructions for drawing the Path.
         * @type {string}
         */
        private pathString: string = "";

        /**
         * The default coordinate mode for the Path. The Path defaults to
         * ABSOLUTE, but can have this overridden by:
         *  - Passing RELATIVE to the constructor,
         *  - Passing RELATIVE to the drawing functions (if they accept
         *    coordinate mode as a parameter), or
         *  - Using the short-hand functions, which specify coordinate mode.
         *
         * @type {boolean}
         */
        private relative: boolean = ABSOLUTE;

        /** @type {string} The fill color for the Path. */
        private fillColor: string = "black";

        /** @type {string} The stroke color for the Path. */
        private strokeColor: string = "none";

        /** @type {number} The stroke width for the Path. */
        private strokeWidth: number = 1;


        /**
         * Creates a Path instance that has the specified [pathString] and
         * coordinate mode. If both are not specified, the Path will have an
         * empty [pathString] and will use the ABSOLUTE coordinate mode.
         *
         * @param  {string  = ""}          pathString SVG draw command string.
         * @param  {boolean = ABSOLUTE}    relative   The coordinate mode of the Path.
         *
         * @return {Path}         A newly created path instance.
         */
        constructor (pathString: string = "", relative: boolean = ABSOLUTE) {
            this.pathString = pathString;
            this.relative = relative;
        }

        /**
         * Takes the information from the Path and generates an Element that can
         * be added to the SVG and rendered by the browser.
         *
         * @return {Element} A newly created Element.
         */
        toXML (): Element {
            // note(jrm): We use createElementNS() here with the "http://www.w3.org/2000/svg"
            // namespace due to SVG being an XML format separate from HTML. This
            // caused a great deal of confusion for me initially when I used
            // createElement and nothing rendered on the screen. The reason why
            // it didn't work was because we were adding HTML elements to an XML
            // area, and despite the fact that they render the same in the DOM,
            // the browser's rendering engine disallows this. In true web-
            // technology fashion, the error was not reported to the user, so I
            // had resort to the good-old Internet to figure this one out:
            // https://stackoverflow.com/questions/17520337/dynamically-rendered-svg-is-not-displaying
            // https://stackoverflow.com/questions/8173217/createelement-vs-createelementns
            let element: Element = document.createElementNS("http://www.w3.org/2000/svg",
                                                            "path");

            element.setAttribute("d", this.pathString);
            element.setAttribute("fill", this.fillColor);
            element.setAttribute("stroke", this.strokeColor);
            element.setAttribute("stroke-width", this.strokeWidth.toString());

            return element;
        }

        /**
         * Adds the given [cmd], with it's argument string ([args]), to the list
         * of commands that compose the Path. The relative flag controls the
         * casing of the command letter.
         *
         * @param {string}  cmd      The command letter to add.
         * @param {string}  args     The arguments to add.
         * @param {boolean} relative Whether or not the command is relative.
         */
        private addCommand (cmd: string, args: string, relative: boolean): void {
            if (!relative)
                cmd = cmd.toUpperCase();

            if (args != null)
                this.pathString += `${cmd} ${args} `;
            else
                this.pathString += cmd;
        }

        /**
         * Adds a move command to the list of commands that compose the Path.
         *
         * @param  {number}     x The x (or dx) to move to.
         * @param  {number}     y The y (or dy) to move to.
         * @param  {boolean = this.relative} relative Controls ABSOLUTE or RELATIVE mode.
         *
         * @return {Path}         The modified Path.
         */
        moveTo (
            x: number, y: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("m", `${x},${y}`, relative);

            return this;
        }

        /**
         * A short command for "moveTo([dx], [dy], RELATIVE)".
         *
         * @param  {number} dx How far to move on the x-axis.
         * @param  {number} dy How far to move on the y-axis.
         *
         * @return {Path}      The modified Path.
         */
        m (dx: number, dy: number): Path {
            return this.moveTo(dx, dy, RELATIVE);
        }

        /**
         * A short command for "moveTo([x], [y], ABSOLUTE)".
         *
         * @param  {number} x The x position to move to.
         * @param  {number} y The y position to move to.
         *
         * @return {Path}     The modified Path.
         */
        M (x: number, y: number): Path {
            return this.moveTo(x, y, ABSOLUTE);
        }

        /**
         * Draws a line from current position to ([x], [y]). If relative is true
         * (RELATIVE), draws a line from current position to the current position
         * offset by [x] and [y].
         *
         * @param  {number}     x The x (or dx) to move to.
         * @param  {number}     y The y (or dy) to move to.
         * @param  {boolean = this.relative} relative Controls ABSOLUTE or RELATIVE mode.
         *
         * @return {Path}         The modified Path.
         */
        lineTo (
            x: number, y: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("l", `${x},${y}`, relative);

            return this;
        }

        /**
         * A short command for "lineTo([dx], [dy], RELATIVE)".
         *
         * @param  {number} dx How far to move on the x-axis.
         * @param  {number} dy How far to move on the y-axis.
         *
         * @return {Path}      The modified Path.
         */
        l (dx: number, dy: number): Path {
            return this.lineTo(dx, dy, RELATIVE);
        }

        /**
         * A short command for "lineTo([x], [y], ABSOLUTE)".
         *
         * @param  {number} x The x coordinate to draw to.
         * @param  {number} y The y coordinate to draw to.
         *
         * @return {Path}     The modified Path.
         */
        L (x: number, y: number): Path {
            return this.lineTo(x, y, ABSOLUTE);
        }

        /**
         * Draws a curve from the current position to (endX, endY), using (x1, y1)
         * and (x2, y2) as control points for the Bezier equation. In RELATIVE
         * mode, the x's and y's become dx's and dy's from the current position.
         *
         * @param  {number}     x1   The x of the 1st control point.
         * @param  {number}     y1   The y of the 1st control point.
         * @param  {number}     x2   The x of the 2nd control point.
         * @param  {number}     y2   The y of the 2nd control point.
         * @param  {number}     endX The x of the end position.
         * @param  {number}     endY The y of the end position.
         * @param  {boolean =    this.relative} relative Controls RELATIVE or ABSOLUTE mode.
         *
         * @return {Path}            The modified Path.
         */
        curveTo (
            x1: number, y1: number,
            x2: number, y2: number,
            endX: number, endY: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("c", `${x1},${y1} ${x2},${y2} ${endX},${endY}`, relative);

            return this;
        }

        /**
         * A short command for "curveTo([dx1], [dy1], [dx2], [dy2], [endDX],
         * [endDY], RELATIVE)".
         *
         * @param  {number} dx1   How far to move on the x-axis.
         * @param  {number} dy1   How far to move on the y-axis.
         * @param  {number} dx2   How far to move on the x-axis.
         * @param  {number} dy2   How far to move on the y-axis.
         * @param  {number} endDX How far to move on the x-axis.
         * @param  {number} endDY How far to move on the y-axis.
         *
         * @return {Path}         The modified Path.
         */
        c (
            dx1: number, dy1: number,
            dx2: number, dy2: number,
            endDX: number, endDY: number
        ): Path {
            return this.curveTo(dx1, dy1, dx2, dy2, endDX, endDY, RELATIVE);
        }

        /**
         * A short command for "curveTo([x1], [y1], [x2], [y2], [endX], [endY],
         * ABSOLUTE)".
         *
         * @param  {number} x1   The x position to move to.
         * @param  {number} y1   The y position to move to.
         * @param  {number} x2   The x position to move to.
         * @param  {number} y2   The y position to move to.
         * @param  {number} endX The x position to move to.
         * @param  {number} endY The y position to move to.
         *
         * @return {Path}        The modified Path.
         */
        C (
            x1: number, y1: number,
            x2: number, y2: number,
            endX: number, endY: number
        ): Path {
            return this.curveTo(x1, y1, x2, y2, endX, endY, ABSOLUTE);
        }

        /**
         * Draws a quadratic curve from current position to ([endX], [endY]),
         * using ([x1], [y1]) as the control point for the Bezier equation.
         *
         * @param  {number}     x1   The x position to move to.
         * @param  {number}     y1   The y position to move to.
         * @param  {number}     endX The x position to move to.
         * @param  {number}     endY The y position to move to.
         * @param  {boolean =    this.relative} relative Controls RELATIVE or ABSOLUTE mode.
         *
         * @return {Path}            The modified Path.
         */
        quadCurveTo (
            x1: number, y1: number,
            endX: number, endY: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("q", `${x1},${y1} ${endX},${endY}`, relative);

            return this;
        }

        /**
         * A short command for "quadCurveTo([dx1], [dy1], [endDX], [endDY],
         * RELATIVE)".
         *
         * @param  {number} dx1   How far to move on the x-axis.
         * @param  {number} dy2   How far to move on the y-axis.
         * @param  {number} endDX How far to move on the x-axis.
         * @param  {number} endDY How far to move on the y-axis.
         *
         * @return {Path}         The modified Path.
         */
        q (
            dx1: number, dy2: number,
            endDX: number, endDY: number
        ): Path {
            return this.quadCurveTo(dx1, dy2, endDX, endDY, RELATIVE);
        }

        /**
         * A short command for "quadCurveTo([x1], [x2], [endX], [endY], ABSOLUTE)".
         *
         * @param  {number} x1   The x position to move to.
         * @param  {number} y1   The y position to move to.
         * @param  {number} endX The x position to move to.
         * @param  {number} endY The y position to move to.
         *
         * @return {Path}        The modified Path.
         */
        Q (
            x1: number, y1: number,
            endX: number, endY: number
        ): Path {
            return this.quadCurveTo(x1, y1, endX, endY, ABSOLUTE)
        }

        /**
         * Draws a cubic curve from the current position to ([x], [y]). If
         * relative is true (RELATIVE), [x] and [y] become offsets from the
         * currnet position instead of absolute positions.
         *
         * @param  {number}     x The x position to move to.
         * @param  {number}     y The y position to move to.
         * @param  {boolean = this.relative} relative Controls RELATIVE or ABSOLUTE mode.
         *
         * @return {Path}         The modified Path.
         */
        cubicCurveTo (
            x: number, y: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("t", `${x},${y}`, relative);

            return this;
        }

        /**
         * A short command for "cubicCurveTo([dx], [dy], RELATIVE)".
         *
         * @param  {number} dx How far on the x-axis to move.
         * @param  {number} dy How far on the y-axis to move.
         *
         * @return {Path}      The modifed Path.
         */
        t (dx: number, dy: number): Path {
            return this.cubicCurveTo(dx, dy, RELATIVE);
        }

        /**
         * A short command for "cubicCurveTo([x], [y], ABOSLUTE)".
         *
         * @param  {number} x The x coordinate to draw to.
         * @param  {number} y The x coordinate to draw to.
         *
         * @return {Path}     The modified Path.
         */
        T (x: number, y: number): Path {
            return this.cubicCurveTo(x, y, ABSOLUTE);
        }

        /**
         * Adds the close path command to the end of the command list.
         *
         * @return {Path} The modified Path.
         */
        close (): Path {
            this.addCommand("Z", null, false);

            return this;
        }

        /**
         * A short command for "close()".
         *
         * @return {Path} The modified Path.
         */
        Z (): Path { return this.close(); }

        fill (fillColor: string): Path {
            this.fillColor = fillColor;

            return this;
        }

        /**
         * Set's the [strokeColor] and [strokeWidth] of the Path to those
         * specified.
         *
         * @param  {string}    strokeColor The color string for the stroke.
         * @param  {number = this.strokeWidth} strokeWidth The widht of the stroke.
         *
         * @return {Path}                  This modified Path.
         */
        stroke (strokeColor: string, strokeWidth: number = this.strokeWidth): Path {
            this.strokeColor = strokeColor;
            this.strokeWidth = strokeWidth;

            return this;
        }

        /**
         * Set's the [strokeWidth] to the value given.
         *
         * @param  {number} strokeWidth The stroke width value.
         *
         * @return {Path}               The modified Path.
         */
        public setStrokeWidth (strokeWidth: number): Path {
            this.strokeWidth = strokeWidth;

            return this;
        }
    }

    class Font {
        public family: string[] = [];
        public color: string = "";
        public size: string = "";
        public weight: string = "normal";
    }

    /// This class represents a Text element in the SVG document.
    export class Text implements SVGElement {

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

        /** @type {Font} The font properites of the text object. */
        private font: Font = new Font();

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

            this.font.family = fonts;
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

            if (this.font.family)
                element.setAttribute("font-family", this.font.family.join(","));

            element.setAttribute("font-size", this.font.size);
            element.setAttribute("fill", this.font.color);
            element.setAttribute("font-weight", this.font.weight);
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
        position (x: number, y: number): Text {
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
        public fonts (fonts: string[]): Text {
            this.font.family = fonts;

            return this;
        }

        /**
         * Sets the [color] attribute of the Text object's font.
         *
         * @param  {string} color The color to set the Text to.
         *
         * @return {Text}         The modified Text object.
         */
        color (color: string): Text {
            this.font.color = color;

            return this;
        }

        /**
         * Sets the [size] attribute of the Text object's font.
         *
         * @param  {(string | number)}     size The size to set the Text to.
         *
         * @return {Text}         The modified Text object.
         */
        public size (size: (string | number)): Text {
            if (typeof size === "number")
                this.font.size = size.toString();
            else
                this.font.size = size;

            return this;
        }

        /**
         * Sets the font [weight] attribute of the Text object's font.
         *
         * @param  {(string | number)}     weight The weight to set the Text to.
         *
         * @return {Text}         The modified Text object.
         */
        public weight (weight: (string | number)): Text {
            if (typeof weight === "number")
                this.font.weight = weight.toString();
            else
                this.font.weight = weight;

            return this;
        }

        /**
         * Sets the text anchor [position] of the Text object.
         *
         * @param  {string} position A text anchor position enum value.
         *
         * @return {Text}            The modified Text object.
         */
        public anchor (position: string): Text {
            this.textAnchor = position;

            return this;
        }
    }
}