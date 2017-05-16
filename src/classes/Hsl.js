class Hsl {
    constructor(hsl) {
        if (hsl instanceof Object) {
            this.hsl = hsl;
        } else {
            throw new Error("Hsl should be an object");
        }
    }

    getHsl() {
        return this.hsl;
    }

    getHslValues() {
        const { h, s, l } = this.hsl;
        return [h, s, l];
    }

    toString() {
        const hsl = this.getHslValues().map((item, index) => {
            return (index > 0) ? item + "%" : item;
        });

        return "hsla(" + hsl.join(",") + ",1)";
    }
}

export default Hsl;
