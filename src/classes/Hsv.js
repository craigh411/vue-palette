class Hsv {
    constructor(hsv) {
        if (hsv instanceof Object) {
            this.hsv = hsv;
        } else {
            throw new Error("Hsv should be an object");
        }
    }

    getHsv() {
        return this.hsv;
    }
    
    getHsvValues() {
        const { h, s, v } = this.hsv;
        return [h, s, v];
    }

}

export default Hsv;
