/// @file yash.js
/// @author Joseph R Miles <me@josephrmiles.com>
/// @date 2019-10-16
///
/// This is the core file for YASH (Yet Another SVG Helper).

namespace YASH {
    export const ABSOLUTE: boolean = false;
    export const RELATIVE: boolean = true;

    export class Canvas {
        private selector: string = "";
        private elements: Path[] = [];

        constructor (
            selector: string = "",
            paths: Path[] = []
        ): Canvas {
            this.selector = selector;
            this.paths = paths;
        }

        add (element: SVGElement): Canvas {
            this.paths.push(element);
            return this;
        }

        render (): void {
            const canvas = document.querySelectorAll(this.selector)[0];

            this.paths.forEach((path: SVGElement) => canvas.appendChild(path.toXML()));
        }
    }

    interface SVGElement {
        toXML (): Element;
    }

    export class Path implements SVGElement {
        private pathString: string = "";
        private relative: boolean = ABSOLUTE;

        private fillColor: string = "black";

        private strokeColor: string = "none";
        private strokeWidth: number = 1;

        constructor (relative: boolean = ABSOLUTE): Path {
            this.pathString = "";
            this.relative = relative;
        }

        constructor (
            pathString: string = "",
            relative: boolean = ABSOLUTE
        ): Path {
            this.pathString = pathString;
            this.relative = relative;
        }

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
            element.setAttribute("stroke-width", this.strokeWidth);

            return element;
        }

        private addCommand (cmd: string, args: string, relative: boolean): void {
            if (!relative)
                cmd = cmd.toUpperCase();

            if (args != null)
                this.pathString += `${cmd} ${args} `;
            else
                this.pathString += cmd;
        }

        moveTo (
            x: number, y: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("m", `${x},${y}`, relative);

            return this;
        }

        m (dx: number, dy: number): Path {
            return this.moveTo(dx, dy, RELATIVE);
        }

        M (x: number, y: number): Path {
            return this.moveTo(x, y, ABSOLUTE);
        }

        lineTo (
            x: number, y: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("l", `${x},${y}`, relative);

            return this;
        }

        l (dx: number, dy: number): Path {
            return this.lineTo(dx, dy, RELATIVE);
        }

        L (x: number, y: number): Path {
            return this.lineTo(x, y, ABSOLUTE);
        }

        curveTo (
            x1: number, y1: number,
            x2: number, y2: number,
            endX: number, endY: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("c", `${x1},${y1} ${x2},${y2} ${endX},${endY}`, relative);

            return this;
        }

        c (
            dx1: number, dy1: number,
            dx2: number, dy2: number,
            endDX: number, endDY: number
        ): Path {
            return this.curveTo(dx1, dy1, dx2, dy2, endDX, endDY, RELATIVE);
        }

        C (
            x1: number, y1: number,
            x2: number, y2: number,
            endX: number, endY: number
        ): Path {
            return this.curveTo(x1, y1, x2, y2, endX, endY, ABSOLUTE);
        }

        quadCurveTo (
            x1: number, y1: number,
            endX: number, endY: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("q", `${x1},${y1} ${endX},${endY}`, relative);

            return this;
        }

        q (
            dx1: number, dy2: number,
            endDX: number, endDY: number
        ): Path {
            return this.quadCurveTo(dx1, dy2, endDX, endDY, RELATIVE);
        }

        Q (
            x1: number, y1: number,
            endX: number, endY: number
        ): Path {
            return this.quadCurveTo(x1, y1, endX, endY, ABSOLUTE)
        }

        cubicCurveTo (
            x: number, y: number,
            relative: boolean = this.relative
        ): Path {
            this.addCommand("t", `${x},${y}`, relative);

            return this;
        }

        t (dx: number, dy: number): Path {
            return this.cubicCurveTo(dx, dy, RELATIVE);
        }

        T (x: number, y: number): Path {
            return this.cubicCurveTo(x, y, ABSOLUTE);
        }

        close (): Path {
            this.addCommand("Z", null, false);

            return this;
        }

        Z (): Path { return this.close(); }

        fill (fillColor: string): Path {
            this.fillColor = fillColor;

            return this;
        }

        stroke (strokeColor: string, strokeWidth: number = this.strokeWidth): Path {
            this.strokeColor = strokeColor;
            this.strokeWidth = strokeWidth;

            return this;
        }

        strokeWidth (strokeWidth: number): Path {
            this.strokeWidth = strokeWidth;

            return this;
        }
    }

    export class Text implements XMLRenderable {
        private body: string = "";
        private x: number = 0;
        private y: number = 0;
        private text_anchor: string = "";

        private font: object = {
            'family': null,
            'color': "",
            'size': null,
            'weight': "normal",
            'spacing': 0
        };

        constructor (
            body: string,
            x: number,
            y: number,
            fonts: string[] = null
        ): Text {
            this.body = body;
            this.x = x;
            this.y = y;

            this.font.family = fonts;
        }

        toXML (): Element {
            let element: Element = document.createElementNS("http://www.w3.org/2000/svg",
                                                                                                            "text");

            element.innerHTML = this.body;
            element.setAttribute("x", this.x);
            element.setAttribute("y", this.y);

            if (this.font.family)
                element.setAttribute("font-family", this.font.family.join(","));

            element.setAttribute("font-size", this.font.size);
            element.setAttribute("fill", this.font.color);
            element.setAttribute("font-weight", this.font.weight);
            element.setAttribute("text-anchor", this.text_anchor);
            element.setAttribute("letter-spacing", this.font.spacing)

            return element;
        }

        body (body: string): Text {
            this.body = body;

            return this;
        }

        position (x: number, y: number): Text {
            this.x = x;
            this.y = y;

            return this;
        }

        fonts (...args: string[]): Text {
            this.font.family = args;

            return this;
        }

        fonts (fonts: string[]): Text {
            this.font.family = fonts;

            return this;
        }

        color (color: string): Text {
            this.font.color = color;

            return this;
        }

        size (size: (string | number)): Text {
            this.font.size = size;

            return this;
        }

        weight (weight: (string | number)): Text {
            this.font.weight = weight;

            return this;
        }

        spacing (letter_spacing: number): Text {
            this.font.spacing = letter_spacing;

            return this;
        }

        anchor (position: string): Text {
            this.text_anchor = position;

            return this;
        }
    }
}