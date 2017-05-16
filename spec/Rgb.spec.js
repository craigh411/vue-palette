import Rgb from '../src/classes/Rgb.js';

describe('Rgb', () => {
    it('should create an Rgb object', () => {
        let rgb = new Rgb({ r: 255, g: 255, b: 255 });
        expect(rgb instanceof Rgb).toBeTruthy();
    });

    it('should throw an error when an object is not passed', () => {
        expect(() => {
        	new Rgb("foo");
        }).toThrowError(Error, "Rgb should be an object");
    });

    it('should return an Rgb string', () => {
        let rgb = new Rgb({ r: 255, g: 255, b: 255 });
        expect(rgb.toString()).toBe('rgba(255,255,255,1)');
    });

    it('should return an array of Rgb Values', () => {
    	let vals = { r: 255, g: 255, b: 255 };
        let rgb = new Rgb(vals);
        expect(rgb.getRgbValues()).toEqual([255,255,255]);
    });

    it('should return an object of rgb values', () => {
    	let vals = { r: 255, g: 255, b: 255 };
        let rgb = new Rgb(vals);
        expect(rgb.getRgb()).toBe(vals);
    });
});
