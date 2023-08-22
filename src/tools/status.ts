import fs from 'fs';
import path from 'path';

interface Status {
    date: number;
    done: boolean;
    failed: boolean;
}

const file = path.join(__dirname, '../../out/.status.json');

export function resetStatus() {
    if (fs.existsSync(file)) fs.writeFileSync(file, '{}');
}

export function getStatus() {
    if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}));
    const raw = fs.readFileSync(file).toString();
    return JSON.parse(raw) as Record<string, Status>;
}

export function setStart(name: string, day: number) {
    const current = getStatus();
    current[name] = { date: day, done: false, failed: false };
    fs.writeFileSync(file, JSON.stringify(current));
}

export function setDone(name: string) {
    const current = getStatus();
    current[name].done = true;
    fs.writeFileSync(file, JSON.stringify(current));
}

export function setFailed(name: string) {
    const current = getStatus();
    current[name].failed = true;
    fs.writeFileSync(file, JSON.stringify(current));
}
