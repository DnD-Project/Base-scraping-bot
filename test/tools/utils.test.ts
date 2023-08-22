import {
    getTextValue,
    getEveryTextValue,
    getDayNumber,
} from '../../src/tools/utils';

describe('getTextValue', () => {
    it('should return the text content of an element', () => {
        const node = { textContent: 'foo' } as Element;
        expect(getTextValue(node)).toBe('foo');
    });

    it('should return an empty string if the element has no text content', () => {
        const node = { textContent: '' } as Element;
        expect(getTextValue(node)).toBe('');
    });
});

describe('getEveryTextValue', () => {
    it('should return an array of text content of elements', () => {
        const foo = { textContent: 'foo' } as Element;
        const bar = { textContent: 'bar' } as Element;
        expect(getEveryTextValue([foo, bar])).toEqual(['foo', 'bar']);
    });

    it('should return an empty array if there is no element', () => {
        expect(getEveryTextValue(Array<Element>())).toEqual([]);
    });
});

describe('getDayNumber', () => {
    it('should return a numbre from a date', () => {
        const date = new Date('2020-01-01');
        expect(getDayNumber(date)).toBe(20200101);
    });
});
