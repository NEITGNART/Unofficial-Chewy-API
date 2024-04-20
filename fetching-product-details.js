import fs from "fs";
import fetch from "node-fetch";
import extractProductDetails from "./extract-product-details.js";

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

const promotional_information = `
*New Customers Offer Terms and Conditions
Offer valid for new Chewy customers only. Must add $49.00 worth of eligible items to cart and enter code WELCOME to receive $20 e-Gift card. Limit 1 use per order, limit 1 order per customer. Free e-Gift card added at checkout with qualifying purchase and automatically added to your Chewy account after your order ships. Customer must be logged into account to view all applicable promotions. Excludes, gift cards, Purina Pro Plan, Diamond, Taste of the Wild, Castor & Pollux, and Vet Diet brands as well as select Beggin', DentaLife, Dog Chow, Fancy Feast, Friskies, Purina Beneful, Purina Beyond, Purina ONE, Tidy Cats, Tidy Max, and other select items. Subject to Chewy Gift Card terms and conditions found here: https://chewy.com/app/content/gift-cards-terms. Gift cards cannot be returned, refunded, or redeemed for cash as required by law. Valid through 4/15/24 6:29AM ET, while supplies last, subject to Terms.
`


function extractPathFromUrl(fullUrl) {
    const baseUrl = "https://www.chewy.com/";
    // Remove the base URL part
    let path = fullUrl.replace(baseUrl, "");

    // Find the index of "/dp/"
    const dpIndex = path.indexOf("/dp/");

    // If "/dp/" is found, adjust the string to end right after "/dp/"
    if (dpIndex !== -1) {
        path = path.substring(0, dpIndex + 4); // "+ 4" to include "/dp/" in the output
    }

    return path;
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


function getRelevanceEntriesId(itemId, jsonObject) {
    const itemRef = jsonObject?.pageProps["__APOLLO_STATE__"]?.["ROOT_QUERY"]?.[`item({"id":"${itemId}"})`]?.["__ref"]
    const item = jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef];
    const productRef = item.product["__ref"]
    return jsonObject?.pageProps["__APOLLO_STATE__"][productRef][`items({"includeEnsemble":true})`]?.map((itemRef) => {
        return jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef["__ref"]].entryID;
    }).filter((entryId) => (entryId !== undefined && entryId !== ("" + itemId))) ?? [];
}


async function fetchProductDetails(url, promotional_information) {

    const allProducts = []
    const productPath = extractPathFromUrl(url);
    const id = extractIdFromUrl(url);
    const resourceId = 'RHOCOHq4YoiX'
    const api = `https://www.chewy.com/_next/data/chewy-pdp-ui-${resourceId}/en-US/${productPath}${id}.json`;
    const response = await fetch(api, {
        headers
    });
    const jsonObject = await response.json();
    const products = extractProductDetails(id, jsonObject, promotional_information);
    allProducts.push(...products);

    await new Promise((resolve) => setTimeout(resolve, (Math.random() * 300) + 500));

    const entriesId = getRelevanceEntriesId(id, jsonObject);
    for (let i = 0; i < entriesId.length; i++) {
        const entryId = entriesId[i];
        // if (entryId.length >= 10) {
        //     console.log("Fetching + ", entryId)
        //     break;
        // }
        const entryApi = `https://www.chewy.com/_next/data/chewy-pdp-ui-${resourceId}/en-US/${productPath}${entryId}.json`;
        console.log(entryApi)
        const entryResponse = await fetch(entryApi, {
            headers
        });
        const entryJsonObject = await entryResponse.json();
        const entryProducts = extractProductDetails(entryId, entryJsonObject, promotional_information, `https://www.chewy.com/${productPath}${entryId}`);
        allProducts.push(...entryProducts);
        // await 300 ms before fetching the next entry 
        // add random delay to avoid being blocked
        await new Promise((resolve) => setTimeout(resolve, (Math.random() * 300) + 500));
    }
    fs.writeFileSync(`product-details-${id}.json`, JSON.stringify(allProducts, null, 2));
}
console.time("fetchProductDetails");
await fetchProductDetails("https://www.chewy.com/purina-pro-plan-high-protein-shredded/dp/52445", promotional_information)
console.timeEnd("fetchProductDetails");


// const productPath = extractPathFromUrl("");

// console.log(productPath)