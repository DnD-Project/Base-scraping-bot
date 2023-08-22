import express from 'express';
import puppeteer from 'puppeteer';
import routes from './routes';
import { resetStatus } from './tools/status';
import { PORT, PUPPETEER_EXECUTABLE_PATH } from './config';

(async function () {
    const browser = await puppeteer.launch({
        executablePath: PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disabled-setupid-sandbox'],
        headless: 'new',
    });
    resetStatus();
    const server = express();
    server.use(express.json());

    server.get('/update/:which', (req, res) => {
        const data = req.params.which;
        if (data.includes('.status'))
            return res.status(400).send({ status: 'error' });
        console.log(`[INFO] Received update request for class "${data}"`);
        const result = routes.update(browser, data);
        res.status(200).send(result);
    });

    server.get('/retrieve/:which', (req, res) => {
        const data = req.params.which;
        if (data.includes('.status'))
            return res.status(400).send({ status: 'error' });
        console.log(`[INFO] Received retrieve request for class "${data}"`);
        const result = routes.retrieve(browser, data);
        if (result.status === 'error') return res.status(400).send(result);
        res.status(200).send(result);
    });

    server.listen(PORT, () => {
        console.log(`[INFO] Now running!, listening on localhost:${PORT}/`);
    });
})();
