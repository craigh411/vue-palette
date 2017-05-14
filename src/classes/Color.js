import DeltaE from "delta-e";

class Color {
    constructor(hex) {
        if (Color.isHex(hex)) {
            this.hexVal = hex;
            this.rgbVal = Color.hexToRgb(this.hexVal);
            this.rgbVals = Color.getRGBVals(this.rgbVal);
            this.hsvVal = Color.rgbToHsv(this.rgbVals);
            this.upLabVal = Color.upLab(this.rgbVals);
            this.xyzVal = Color.xyz(this.rgbVals);
            this.hslVal = Color.rgbToHsl(this.rgbVals);
        } else {
            throw new Error("Color should be in Hexidecimal format. Try using ColorFactory.create() instead.");
        }
    }

    hex() {
        return this.hexVal;
    }

    rgbString() {
        return this.rgbVal;
    }

    rgbArray() {
        return this.rgbVals;
    }

    rgb() {
        return { r: this.rgbVals[0], g: this.rgbVals[1], b: this.rgbVals[2] };
    }

    hsv() {
        return this.hsvVal;
    }

    upLab() {
        return this.upLabVal;
    }

    xyz() {
        return this.xyzVal;
    }

    hsl() {
        return this.hslVal;
    }

    static xyz(rgb) {
        // let rgb = this.rgbVals;

        let R = (rgb[0] / 255);
        let G = (rgb[1] / 255);
        let B = (rgb[2] / 255);

        R = (R > 0.04045) ? Math.pow(((R + 0.055) / 1.055), 2.4) : R / 12.92;
        G = (G > 0.04045) ? Math.pow(((G + 0.055) / 1.055), 2.4) : G / 12.92;
        B = (B > 0.04045) ? Math.pow(((B + 0.055) / 1.055), 2.4) : B / 12.92;

        R = R * 100;
        G = G * 100;
        B = B * 100;

        const X = 0.436052025 * R + 0.385081593 * G + 0.143087414 * B;
        const Y = 0.222491598 * R + 0.71688606 * G + 0.060621486 * B;
        const Z = 0.013929122 * R + 0.097097002 * G + 0.71418547 * B;

        return { X: X, Y: Y, Z: Z };
    }

    static upLab(rgb) {
        // Universal perceptual Lab, converted from
        // http://www.brucelindbloom.com
        const { X, Y, Z } = Color.xyz(rgb);
        const Xr = 0.964221; // reference white D50
        const Yr = 1.0;
        const Zr = 0.825211;
        const k = 24389 / 27;
        const eps = 216 / 24389;

        // XYZ to Lab
        const xr = X / Xr;
        const yr = Y / Yr;
        const zr = Z / Zr;

        const fx = (xr > eps) ? Math.pow(xr, 1 / 3) : ((k * xr + 16) / 116);
        const fy = (yr > eps) ? Math.pow(yr, 1 / 3) : ((k * yr + 16) / 116);
        const fz = (zr > eps) ? Math.pow(zr, 1 / 3) : ((k * zr + 16) / 116);

        const Ls = (116 * fy) - 16;
        const as = 500 * (fx - fy);
        const bs = 200 * (fy - fz);

        const lab = [];
        lab[0] = parseInt((2.55 * Ls + 0.5));
        lab[1] = parseInt((as + 0.5));
        lab[2] = parseInt((bs + 0.5));

        return { L: lab[0], A: lab[1], B: lab[2] };
    }

    static getClosestMatch(color, matchList, method = "lab") {
        if (method === "lab") {
            // Use Universal perceptual Lab
        } else {
            // Use HSV
        }
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
        return Color.compare(Color.upLab(this.color.rgbVals), Color.upLab(color.rgbVals), formula);
    }

    brightness() {
        const rgb = this.rgbVals;
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // per ITU-R BT.709
    }

    static lighten(rgb, amount) {
        let [R, G, B] = rgb;

        R = Math.min(255, R + amount);
        G = Math.min(255, G + amount);
        B = Math.min(255, B + amount);

        return [R, G, B];
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
            let color = hex.substring(1).split("");
            color = (color.length === 3) ? [color[0], color[0], color[1], color[1], color[2], color[2]] : color;
            color = "0x" + color.join("");
            return "rgba(" + [(color >> 16) & 255, (color >> 8) & 255, color & 255].join(",") + ",1)";
        }
        throw new Error("Invalid Hex Value");
    }

    static isRGB(color) {
        return /^rgba/.test(color);
    }

    static isRGBArray(color) {
        if (Array.isArray(color)) {
            const [R, G, B] = color;
            return Color.inRGBRange(R) && Color.inRGBRange(G) && Color.inRGBRange(B);
        }
        return false;
    }

    static inRGBRange(val) {
        return val >= 0 && val <= 255;
    }

    static detectFormat(color) {
        if (Color.isHex(color)) {
            return "hex";
        } else if (Color.isRGB(color)) {
            return "rgb";
        } else if (Color.isRGBArray(color)) {
            return "rgb";
        }
    }

    static getRGBVals(color) {
        const rgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
    }

    static RgbToHex(color) {
        const rgb = (Array.isArray(color)) ? color : Color.getRGBVals(color);
        return "#" +
            ("0" + rgb[0].toString(16)).slice(-2) +
            ("0" + rgb[1].toString(16)).slice(-2) +
            ("0" + rgb[2].toString(16)).slice(-2);
    }

    static normaliseHex(hex) {
        const color = hex.substring(1).split("");
        return (color.length === 3) ? "#" + [color[0], color[0], color[1], color[1], color[2], color[2]].join("") : hex;
    }

    static rgbToHsv(rgb) {
        let [r, g, b] = rgb;

        r /= 255;
        g /= 255;
        b /= 255;

        let rr, gg, bb,
            h, s;

        const v = Math.max(r, g, b);
        const diff = v - Math.min(r, g, b);
        const diffc = c => {
            return (v - c) / 6 / diff + 1 / 2;
        };

        if (diff === 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            } else if (g === v) {
                h = (1 / 3) + rr - bb;
            } else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    static rgbToHsl(rgb) {
        let [r, g, b] = rgb;

        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        let s;
        const l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
    }

    static HSVtoRGB(hsv) {
        let { h, s, v } = hsv;

        h /= 360;
        s /= 100;
        v /= 100;

        let r, g, b;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}

export default Color;
