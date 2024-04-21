import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export default async function getLastedProductApi() {
    // Launch the browser with Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    // Create a new page
    const page = await browser.newPage();
    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);

    // Variable to store the API URL
    let apiUrl = null;

    // Attach an event listener to capture requests
    page.on('request', request => {
        const url = request.url();
        // Check if the URL matches the expected API pattern
        if (url.includes('https://www.chewy.com/_next/data/chewy-pdp-ui-')) {
            apiUrl = url;
        }
    });

    // Navigate to the specified URL
    await page.goto('https://www.chewy.com/blue-buffalo-life-protection-formula/dp/32040', {
    });

    // click on this button "div.fresnel-container:nth-child(4) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(1) > div:nth-child(1)"
    const selectorButton = 'div.fresnel-container:nth-child(4) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(1)';

    await page.waitForSelector(selectorButton);
    // Wait for until we have the API URL
    while (!apiUrl) {
        await page.click(selectorButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await browser.close();
    // Define a regular expression to match the pattern
    const regex = /chewy-pdp-ui-(.*?)(?=\/en-)/;
    const match = apiUrl.match(regex);
    // get the cookie 
    // const cookie = await page.cookies();
    // const validSameSiteValues = ['lax', 'strict', 'no_restriction', 'unspecified'];

    // const finalCookies = cookies.map(cookie => {
    //     if (!cookie.sameSite || !validSameSiteValues.includes(cookie.sameSite)) {
    //         // Set to 'no_restriction' if sameSite is invalid or missing
    //         cookie.sameSite = 'no_restriction';
    //     }
    //     return cookie;
    // });
    // let cookieHeader = null;
    // if (finalCookies && Array.isArray(finalCookies)) {
    //     const cookies = finalCookies.map(cookie => `${cookie.name}=${cookie.value}`);
    //     cookieHeader = cookies.join('; ');
    // }
    if (match) {
        return {resourceId: match[1]};
    } else {
        throw new Error('API URL not found');
    }
}
