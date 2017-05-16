import Color from "./Color.js";

class ColorFactory {
    /**
     * Factory method for returning a color object
     */
    static create(color) {
        var format = Color.detectFormat(color);
        switch (format) {
            case "hex":
                return new Color(Color.normaliseHex(color));
            case "rgb":
                return new Color(Color.RgbToHex(color));
            default:
                throw new Error("Unknown color format");
        }
    }
}

export default ColorFactory;
