import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 1 });
const errors=[];
page.on('pageerror', error => errors.push(error.message));
for (const screen of ['browse','entry','intro','tour','detail','back','conversation','rerouted']) {
 await page.goto(`http://127.0.0.1:8083/?screen=${screen}`);
 await page.getByText('9:41',{exact:true}).waitFor();
 await page.waitForFunction(() => [...document.images].every(i => i.complete));
 await page.evaluate(() => document.fonts.ready);
 await page.screenshot({path:`verification/${screen}.png`});
 console.log(screen,await page.locator('img').count());
}
console.log('Runtime errors:',JSON.stringify(errors));
await browser.close();
if(errors.length)process.exit(1);
