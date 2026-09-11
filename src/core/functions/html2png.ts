/*
 * NMDBot
 *
 * This file is part of an adaptation of the iHorizon Discord Bot.
 * Original project: https://github.com/ihrz/ihrz
 *
 * License: CC BY-NC-SA 4.0
 * This version contains modifications.
 */

import { Browser, launch } from "puppeteer";
import { axios } from "./axios.ts";
import * as apiUrlParser from "./apiUrlParser.js";

let browser: Browser | null = null;
let browserUnavailable = false;

export interface Html2PngOptions {
	width?: number;
	height?: number;
	scaleSize?: number;
	elementSelector?: string;
	omitBackground: boolean;
	selectElement: boolean;
}

export default async function html2Png(
	code: string,
	options: Html2PngOptions
): Promise<Buffer> {
	/*
	 * If the image-generation gateway is configured, use it instead
	 * of launching a local Chrome instance.
	 */
	if (client.config.api.HorizonGateway) {
		const res = await axios.post(
			apiUrlParser.HorizonGateway(
				apiUrlParser.GatewayMethod.ImageGeneration
			),
			{
				code,
				options,
				adminKey: client.config.api.apiToken
			},
			{
				headers: {
					"Content-Type": "application/json"
				},
				responseType: "arraybuffer"
			}
		);

		if (res.status !== 200) {
			const message =
				typeof res.data === "string"
					? res.data
					: JSON.stringify(res.data);

			throw new Error(
				`Image generation gateway failed (HTTP ${res.status}): ${message}`
			);
		}

		const contentType: string =
			res.headers?.get?.("content-type") ??
			res.headers?.["content-type"] ??
			"";

		if (contentType && !contentType.includes("image/png")) {
			throw new Error(
				`Image generation returned an unexpected content type: ${contentType}`
			);
		}

		const buffer = Buffer.isBuffer(res.data)
			? res.data
			: Buffer.from(res.data);

		if (buffer.length === 0) {
			throw new Error(
				"Image generation returned an empty image."
			);
		}

		return buffer;
	}

	/*
	 * Render environments such as Render may not have Chrome installed.
	 * Do not repeatedly try to launch it every minute.
	 */
	if (browserUnavailable) {
		throw new Error(
			"Local Chrome is unavailable. HTML-to-PNG generation is disabled."
		);
	}

	try {
		if (!browser) {
			browser = await launch({
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu"
				]
			});
		}

		return await localRender(code, options);
	} catch (error) {
		/*
		 * Chrome/Puppeteer errors should not continuously crash
		 * monitoring systems on servers where Chrome is unavailable.
		 */
		const message =
			error instanceof Error ? error.message : String(error);

		if (
			message.includes("Could not find Chrome") ||
			message.includes("Could not find Chromium") ||
			message.includes("Executable doesn't exist") ||
			message.includes("No executable was found")
		) {
			browserUnavailable = true;

			console.warn(
				"[NMDBot] Local Chrome is unavailable. " +
				"HTML-to-PNG generation has been disabled."
			);
		}

		throw error;
	}
}

async function localRender(
	code: string,
	options: Html2PngOptions = {
		width: 1280,
		height: 800,
		scaleSize: 1,
		elementSelector: ".container",
		omitBackground: false,
		selectElement: false
	}
): Promise<Buffer> {
	if (!browser) {
		throw new Error("Browser is not available.");
	}

	const page = await browser.newPage();

	try {
		await page.setViewport({
			width: options.width ?? 1280,
			height: options.height ?? 800,
			deviceScaleFactor: options.scaleSize ?? 1
		});

		await page.setContent(code);

		let imageBuffer: Uint8Array;

		if (options.selectElement && options.elementSelector) {
			await page.evaluate(() => {
				document.body.style.background = "transparent";
			});

			await page.evaluate((selector) => {
				const element: HTMLElement | null =
					document.querySelector(selector);

				if (element) {
					element.style.margin = "0";
					element.style.padding = "0";
				}
			}, options.elementSelector);

			const element = await page.$(options.elementSelector);

			if (!element) {
				throw new Error("Element not found");
			}

			const boundingBox = await element.boundingBox();

			if (!boundingBox) {
				throw new Error(
					"Unable to get bounding box for the element"
				);
			}

			imageBuffer = await page.screenshot({
				clip: {
					x: boundingBox.x,
					y: boundingBox.y,
					width: boundingBox.width,
					height: boundingBox.height
				},
				type: "png",
				omitBackground: options.omitBackground
			});
		} else {
			imageBuffer = await page.screenshot({
				fullPage: true,
				omitBackground: options.omitBackground,
				type: "png",
				fromSurface: true
			});
		}

		return Buffer.from(imageBuffer);
	} finally {
		await page.close();
	}
}
