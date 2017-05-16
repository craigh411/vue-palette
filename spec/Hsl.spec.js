import Hsl from '../src/classes/Hsl.js';

describe('Hsl', () => {
    it('should create an Hsl object', () => {
        let hsl = new Hsl({ h: 0, s: 100, v: 100 });
        expect(hsl instanceof Hsl).toBeTruthy();
    });

    it('should return an Hsl string', () => {
        let hsl = new Hsl({ h: 0, s: 50, l: 50 });
        expect(hsl.toString()).toBe('hsla(0,50%,50%,1)');
    });

    it('should throw an error when an object is not passed', () => {
        expect(() => {
            new Hsl("foo");
        }).toThrowError(Error, "Hsl should be an object");
    });

    it('should return an array of Hsl Values', () => {
        let vals = { h: 0, s: 100, l: 100 };
        let hsl = new Hsl(vals);
        expect(hsl.getHslValues()).toEqual([0,100,100]);
    });

    it('should return an object of hsl values', () => {
        let vals = { h: 0, s: 100, v: 100 };
        let hsl = new Hsl(vals);
        expect(hsl.getHsl()).toBe(vals);
    });
});
