import task from '../bot';
import fs from 'fs';
import path from 'path';
import { getStatus, setStart, setDone, setFailed } from '../tools/status';
import { getDayNumber } from '../tools/utils';
import { Browser } from 'puppeteer';

async function makeCache(browser: Browser, name: string) {
    const page = await browser.newPage();
    try {
        const json = JSON.stringify(await task(page, name));
        const file = path.join(__dirname, `../../out/${name}.json`);
        fs.writeFileSync(file, json);
        setDone(name);
        console.log(`[INFO] Successfully updated ${name}`);
    } catch (error) {
        setFailed(name);
        console.log(`[ERROR] Failed to update ${name}...\n${error}`);
    }
    await page.close();
}

export default function (browser: Browser, name: string) {
    const status = getStatus();
    const now = getDayNumber(new Date());
    if (status[name] && status[name].date >= now) {
        if (status[name].done) return { status: 'updated' };
        if (!status[name].failed) return { status: 'running' };
    }
    setStart(name, now);
    makeCache(browser, name);
    return { status: 'pending' };
}
