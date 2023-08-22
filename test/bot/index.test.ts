import task from '../../src/bot';
import { Page, ElementHandle } from 'puppeteer';

const secondSpy = new ElementHandle<Element>();
secondSpy.$eval = jest.fn().mockReturnValue('name');

const firstSpy = new ElementHandle<Element>();
firstSpy.$ = jest.fn().mockReturnValue(secondSpy);

const pageSpy = (empty: boolean) => {
    const pageSpy = new Page();
    pageSpy.goto = jest.fn();
    pageSpy.$ = jest.fn().mockReturnValue(empty ? null : firstSpy);
    return pageSpy;
};

describe('bot', () => {
    it('should return a name', async () => {
        const page = pageSpy(false);
        const result = await task(page, 'name');
        expect(result).toEqual({ name: 'name' });
    });

    it('should throw an error', async () => {
        const page = pageSpy(true);
        await expect(task(page, 'name')).rejects.toThrow('Article not found');
    });
});
