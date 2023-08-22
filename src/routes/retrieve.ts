import create from './update';
import fs from 'fs';
import path from 'path';
import { getStatus } from '../tools/status';
import { getDayNumber } from '../tools/utils';
import { Browser } from 'puppeteer';

function readFromFile(name: string) {
    const file = path.join(__dirname, `../../out/${name}.json`);
    return JSON.parse(fs.readFileSync(file).toString());
}

export default function (browser: Browser, name: string) {
    const status = getStatus();
    const now = getDayNumber(new Date());
    if (status[name] && status[name].failed) return { status: 'error' };
    if (status[name] && status[name].done) {
        if (status[name].date >= now)
            return { status: 'updated', result: readFromFile(name) };
        return { status: 'outdated', result: readFromFile(name) };
    }
    return create(browser, name);
}
