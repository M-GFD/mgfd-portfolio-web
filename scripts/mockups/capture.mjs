// Captura las webs de Vertic y FEG en notebook, tablet y celular con el Chrome instalado
// (puppeteer-core + emulación de dispositivo a 2x), cierra banners/pop-ups y guarda WebP en
// public/images/mockups/<proyecto>/<device>-01.webp.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const SITES = [
  { project: 'vertic', url: 'https://vertictechnology.com/' },
  { project: 'feg', url: 'https://feg.ar/' },
];

const DEVICES = [
  { device: 'laptop', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { device: 'tablet', width: 834, height: 1194, isMobile: true, hasTouch: true },
  { device: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
];

// UA de Android: evita avisos específicos de iOS (p. ej. "agregar a inicio").
const MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Mobile Safari/537.36';
const TABLET_UA =
  'Mozilla/5.0 (Linux; Android 15; Pixel Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36';

/** Textos de botones que cierran banners de cookies, avisos y modales. */
const DISMISS = [
  'rechazar todas',
  'rechazar',
  'solo necesarias',
  'entendido',
  'cerrar',
  'aceptar',
  'ok',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dismissOverlays(page) {
  for (let pass = 0; pass < 3; pass++) {
    const clicked = await page.evaluate((labels) => {
      const els = [...document.querySelectorAll('button, [role="button"], a')];
      for (const label of labels) {
        const el = els.find((e) => {
          const r = e.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.height > 0 &&
            e.textContent?.trim().toLowerCase() === label
          );
        });
        if (el) {
          el.click();
          return label;
        }
      }
      return null;
    }, DISMISS);
    if (!clicked) break;
    await sleep(700);
  }
}

const only = process.argv[2]; // opcional: "vertic" | "feg"
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--mute-audio', '--no-first-run'],
});

try {
  for (const site of SITES) {
    if (only && site.project !== only) continue;
    const outDir = join('public/images/mockups', site.project);
    mkdirSync(outDir, { recursive: true });

    for (const d of DEVICES) {
      const page = await browser.newPage();
      if (d.device !== 'laptop') {
        await page.setUserAgent(d.device === 'phone' ? MOBILE_UA : TABLET_UA);
      }
      await page.setViewport({
        width: d.width,
        height: d.height,
        deviceScaleFactor: 2,
        isMobile: d.isMobile,
        hasTouch: d.hasTouch,
      });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60_000 });
      await sleep(1500);
      await dismissOverlays(page);
      // Deja terminar animaciones de entrada / reveal.
      await sleep(2500);
      await dismissOverlays(page);
      const png = await page.screenshot({ type: 'png' });
      const out = join(outDir, `${d.device}-01.webp`);
      const meta = await sharp(png).webp({ quality: 85 }).toFile(out);
      console.log(`${out}  ${meta.width}x${meta.height}  ${Math.round(meta.size / 1024)} KB`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
