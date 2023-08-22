import { Page } from 'puppeteer';
import { Example } from './types';
import { getTextValue } from '../tools/utils';

export default async function (page: Page, name: string) {
    const url = `https://www.5esrd.com/database/class/${name}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const space = await page.$('.page-center');
    const content = await space?.$('#article-content');
    if (!content) throw Error('Article not found');
    const result = await content.$eval('h1', getTextValue);
    return { name: result } as Example;
}
