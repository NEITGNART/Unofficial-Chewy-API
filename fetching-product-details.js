import fs from 'fs';
import fetch from 'node-fetch';
import extractProductDetails from './extract-product-details';
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
    const resourceId = 'wBL4UU2Ohi0t'
    const api = `https://www.chewy.com/_next/data/chewy-pdp-ui-${resourceId}/en-US/${productPath}.json`;
    const response = await fetch(api, {
        headers
    });
    const jsonObject = await response.json();
    const id = extractIdFromUrl(url);
    const products = extractProductDetails(id, jsonObject, promotional_information);
    allProducts.push(...products);
    // get relevance entries id
    const relevanceEntriesId = getRelevanceEntriesId(id, jsonObject);

    
    fs.writeFileSync(`product-details-${id}.json`, JSON.stringify(jsonObject, null, 2));
}

await fetchProductDetails("https://www.chewy.com/purina-pro-plan-adult-sensitive-skin/dp/129070", promotional_information)




// const productPath = extractPathFromUrl("");

// console.log(productPath)