import DeltaE from 'delta-e';

class Color {
    constructor(hex) {
        if (Color.isHex(hex)) {
            this.hexVal = hex;
            this.rgbVal = Color.hexToRgb(this.hexVal);
            this.rgbVals = Color.getRGBVals(this.rgbVal);
        } else {
            throw new Error('Color should be in Hexidecimal format. Try using ColorFactory.create() instead.');
        }
    }

    hex() {
        return this.hexVal;
    }

    rgb() {
        return this.rgbVal;
    }

    rgbArray() {
        return this.rgbVals;
    }

    static xyz(rgb) {
        // let rgb = this.rgbVals;

        let R = (rgb[0] / 255)
        let G = (rgb[1] / 255)
        let B = (rgb[2] / 255)

        R = (R > 0.04045) ? Math.pow(((R + 0.055) / 1.055), 2.4) : R / 12.92
        G = (G > 0.04045) ? Math.pow(((G + 0.055) / 1.055), 2.4) : G / 12.92;
        B = (B > 0.04045) ? Math.pow(((B + 0.055) / 1.055), 2.4) : B / 12.92

        R = R * 100
        G = G * 100
        B = B * 100

        let X = 0.436052025 * R + 0.385081593 * G + 0.143087414 * B;
        let Y = 0.222491598 * R + 0.71688606 * G + 0.060621486 * B;
        let Z = 0.013929122 * R + 0.097097002 * G + 0.71418547 * B;

        return { X: X, Y: Y, Z: Z }
    }

    static lab(rgb) {
        let { X, Y, Z } = Color.xyz(rgb);

        let Xr = 0.964221; // reference white D50
        let Yr = 1.0;
        let Zr = 0.825211;

        let xr = X / Xr;
        let yr = Y / Yr;
        let zr = Z / Zr;
        let k = 24389 / 27;
        let eps = 216 / 24389;

        let fx = (xr > eps) ? Math.pow(xr, 1 / 3) : ((k * xr + 16) / 116);
        let fy = (yr > eps) ? Math.pow(yr, 1 / 3) : ((k * yr + 16) / 116);
        let fz = (zr > eps) ? Math.pow(zr, 1 / 3) : ((k * zr + 16) / 116);

        let Ls = (116 * fy) - 16;
        let as = 500 * (fx - fy);
        let bs = 200 * (fy - fz);

        let lab = [];
        lab[0] = (2.55 * Ls + 0.5);
        lab[1] = (as + 0.5);
        lab[2] = (bs + 0.5);

        return { L: lab[0], A: lab[1], B: lab[2] };
    }

    static compare(color1, color2, formula) {
        if (formula === "E76") {
            return DeltaE.getDeltaE76(color1, color2);
        } else if (formula === "E94") {
            return DeltaE.getDeltaE94(color1, color2);
        }

        return DeltaE.getDeltaE00(color1, color2);
    }

    /**
     * Returns the distance between two colors. If calling multiple times it will be faster to use the static compare method.
     * @param Color color - The color to compare to.
     * @param String forumla - the DeltaE formula (either "E76", "E94") defaults to E00.
     */
    compareTo(color, formula) {

        return Color.compare(Color.lab(this.color.rgbVals), Color.lab(color.rgbVals), formula);
    }

    brightness() {
        let rgb = this.rgbVals;
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // per ITU-R BT.709
    }

    darken(amount) {

    }

    static lighten(rgb, amount) {
      let [R,G,B] = rgb;

      R =  Math.min(255, R + amount),
      G =  Math.min(255, G + amount),
      B =  Math.min(255, B + amount);

      return [R,G,B];

    }

    format() {
        return Color.detectFormat();
    }

    /**
     * Static methods required for factory function
     */

    static isHex(color) {
        return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
    }

    static hexToRgb(hex) {
        if (Color.isHex(hex)) {
            let color = hex.substring(1).split('');
            color = (color.length === 3) ? [color[0], color[0], color[1], color[1], color[2], color[2]] : color;
            color = '0x' + color.join('');
            return 'rgba(' + [(color >> 16) & 255, (color >> 8) & 255, color & 255].join(',') + ',1)';
        }
        throw new Error('Invalid Hex Value');
    }

    static isRGB(color) {
        return /^rgba/.test(color);
    }

    static isRGBArray(color) {
        if (Array.isArray(color)) {
            let [R, G, B] = color;
            return Color.inRGBRange(R) && Color.inRGBRange(G) && Color.inRGBRange(B)
        }
        return false;
    }

    static inRGBRange(val) {
        return val >= 0 && val <= 255;
    }

    static detectFormat(color) {
        if (Color.isHex(color)) {
            return 'hex';
        } else if (Color.isRGB(color)) {
            return 'rgb';
        } else if (Color.isRGBArray(color)) {
            return 'rgb';
        }
    }

    static getRGBVals(color) {
        let rgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
    }

    static RgbToHex(color) {
        let rgb = (Array.isArray(color)) ? color : Color.getRGBVals(color);
        return "#" +
            ("0" + rgb[0].toString(16)).slice(-2) +
            ("0" + rgb[1].toString(16)).slice(-2) +
            ("0" + rgb[2].toString(16)).slice(-2);
    }

    static normaliseHex(hex) {
        let color = hex.substring(1).split('');
        return (color.length === 3) ? "#" + [color[0], color[0], color[1], color[1], color[2], color[2]].join('') : hex;
    }
}

export default Color;
