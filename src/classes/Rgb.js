class Rgb {
    constructor(rgb) {
        if (rgb instanceof Object) {
            this.rgb = rgb;
        } else {
            throw new Error("Rgb should be an object");
        }
    }

    getRgb() {
        return this.rgb;
    }

    getRgbValues() {
        const { r, g, b } = this.rgb;
        return [r, g, b];
    }

    toString() {
        const rgb = this.getRgbValues();
        return "rgba(" + rgb.join(",") + ",1)";
    }
}

export default Rgb;
