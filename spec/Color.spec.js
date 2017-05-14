import Color from "../src/classes/Color.js";

describe('Color', () => {
    it('Should create a Color object when passed a Hex 6 Value', () => {
        let color = new Color("#ffffff");
        expect(color instanceof Color).toBeTruthy();
    });

    it('Should create a Color object when passed a Hex 3 Value', () => {
        let color = new Color("#fff");
        expect(color instanceof Color).toBeTruthy();
    });

    it('Should throw an error when the hash is emitted', () => {
        expect(() => {
            new Color("fff")
        }).toThrowError("Color should be in Hexidecimal format. Try using ColorFactory.create() instead.");
    });

    it('Should throw an error when the hex is out of range', () => {
        expect(() => {
            new Color("#gggggg")
        }).toThrowError("Color should be in Hexidecimal format. Try using ColorFactory.create() instead.");
    });


    it('Should throw an error when the hex is an invalid length', () => {
        expect(() => {
            new Color("#f")
        }).toThrowError("Color should be in Hexidecimal format. Try using ColorFactory.create() instead.");

        expect(() => {
            new Color("#ffff")
        }).toThrowError("Color should be in Hexidecimal format. Try using ColorFactory.create() instead.");
    });

    it('should return the hex value from the Object', () => {
        let color = new Color("#fff");
        expect(color.hex()).toBe("#fff");
    });


    it('should return the rgb string value from the Object', () => {
        let color = new Color("#fff");
        expect(color.rgbString()).toBe("rgba(255,255,255,1)");
    });
});
