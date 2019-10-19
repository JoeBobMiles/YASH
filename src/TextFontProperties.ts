// @file TextFontProperties.ts
// @author Joseph R Miles <me@josephrmiles.com>
// @date 2019-10-19
//
// This file declares our TextFontProperties class, which is used to encapsulate
// all the font settings we could possibly want in a Text object.

export class TextFontProperties {
    public family: string[] = [];
    public color: string = "";
    public size: string = "";
    public weight: string = "normal";
}
