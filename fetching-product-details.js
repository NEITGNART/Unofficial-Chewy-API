import fs from 'fs';
import fetch from 'node-fetch';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'x-nextjs-data': '1',
    'DNT': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-GPC': '1',
    'Connection': 'keep-alive',
    'TE': 'trailers'
}

function extractPathFromUrl(fullUrl) {
    const baseUrl = "https://www.chewy.com/";
    return fullUrl.replace(baseUrl, "");
}

function extractIdFromUrl(url) {
    const idRegex = /\/dp\/(\d+)/;
    const match = url.match(idRegex);
    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error("ID not found in the URL.");
    }
}

async function fetchProductDetails(url) {
    const productPath = extractPathFromUrl(url);
    const resourceId = 'NNM9SqzQRD--'
    const api = `https://www.chewy.com/_next/data/chewy-pdp-ui-${resourceId}/en-US/${productPath}.json`;
    const response = await fetch(api, {
        headers
    });
    const jsonObject = await response.json();
    const id = extractIdFromUrl(url);
    fs.writeFileSync(`product-details-${id}.json`, JSON.stringify(jsonObject, null, 2));
}

await fetchProductDetails("https://www.chewy.com/greenies-teenie-dental-dog-treats/dp/35512")