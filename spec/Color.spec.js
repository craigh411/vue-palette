import Color from "../src/classes/Color.js";
import Rgb from "../src/classes/Rgb.js";
import Hsv from "../src/classes/Hsv.js";
import Hsl from "../src/classes/Hsl.js";
import DeltaE from 'delta-e';

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

    it('should return the hex value', () => {
        let color = new Color("#fff");
        expect(color.hex()).toBe("#fff");
    });

    it('should return an Rgb object', () => {
        let color = new Color("#fff");
        expect(color.rgb() instanceof Rgb).toBeTruthy();
    });

    it('should return an Hsv object', () => {
        let color = new Color("#fff");
        expect(color.hsv() instanceof Hsv).toBeTruthy();
    });

    it('should return an Hsl object', () => {
        let color = new Color("#fff");
        expect(color.hsl() instanceof Hsl).toBeTruthy();
    });

    it('should return the universal perceptual lab color as an object', () => {
        let color = new Color("#123456");
        expect(color.upLab()).toEqual({ L: 393, A: -10, B: -113 });
    });

    it('should return the xyz color as an object', () => {
        // XYZ color space is tweaked slightly
        let color = new Color("#123456");
        expect(color.xyz()).toEqual({ X: 2.917679974095785, Y: 3.1604915942912957, Z: 6.987990634188924 });
    });

    it('should return the xyz color as an object when called statically', () => {
        // XYZ color space is tweaked slightly
        let color = Color.xyz([10, 10, 10]);
        expect(color).toEqual({ X: 0.2926671013173071, Y: 0.30352672372973954, Z: 0.25047398591634795 });
    });

    it('should return the lab color as an object when called statically', () => {
        let color = Color.upLab([0, 0, 0]);
        expect(color).toEqual({ L: 0, A: 0, B: 0 });
    });

    it('should convert the hex value to the rgb value', () => {
        // XYZ color space is tweaked slightly
        let color = Color.hexToRgb("#123456");
        expect(color).toEqual({ r: 18, g: 52, b: 86 });
    });

    it('should throw an error when the hex value is incorrect', () => {
        // XYZ color space is tweaked slightly
        expect(() => {
            Color.hexToRgb("#1");
        }).toThrowError(Error, 'Invalid Hex Value');

    });

    it('should return true when an rgb string is passed', () => {
        let color = Color.isRGB('rgb(0,0,0,1)');
    });

    it('should compare a color and return the perceptual difference', () => {
        let color = new Color('#ff0000');
        let color2 = new Color('#ff0000');
        expect(color.compareTo(color2)).toEqual(0);
    });

    it('should compare a color with the E76 forumula', () => {
        spyOn(DeltaE, 'getDeltaE76');
        let color = new Color('#ff0000');
        let color2 = new Color('#ff0000');
        color.compareTo(color2, "E76");
        expect(DeltaE.getDeltaE76).toHaveBeenCalled();
    });

    it('should compare a color with the E94 forumula', () => {
        spyOn(DeltaE, 'getDeltaE94');
        let color = new Color('#ff0000');
        let color2 = new Color('#ff0000');
        color.compareTo(color2, "E94");
        expect(DeltaE.getDeltaE94).toHaveBeenCalled();
    });

    it('should compreturn the brightness of the color', () => {
        let color = new Color('#fff');
        expect(Math.round(color.brightness())).toEqual(255);
    });

   it('shoule call the static format function', () => {
/*     spyOn(Color, 'detectFormat');
     let color = new Color('#fff');
     color.format();
     expect(Color.detectFormat).toHaveBeenCalledWith("#fff");*/
   });

});
