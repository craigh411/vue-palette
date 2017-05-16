import Hsv from '../src/classes/Hsv.js';

describe('Hsv', () => {
    it('should create an Hsv object', () => {
        let hsv = new Hsv({ h: 0, s: 100, v: 100 });
        expect(hsv instanceof Hsv).toBeTruthy();
    });

    it('should throw an error when an object is not passed', () => {
        expect(() => {
            new Hsv("foo");
        }).toThrowError(Error, "Hsv should be an object");
    });

    it('should return an array of Hsv Values', () => {
        let vals = { h: 0, s: 100, v: 100 };
        let hsv = new Hsv(vals);
        expect(hsv.getHsvValues()).toEqual([0,100,100]);
    });

    it('should return an object of hsv values', () => {
        let vals = { h: 0, s: 100, v: 100 };
        let hsv = new Hsv(vals);
        expect(hsv.getHsv()).toBe(vals);
    });
});
