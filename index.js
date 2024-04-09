import fs from 'fs';
import fetch from 'node-fetch';
import extractProducts from './extract-products.js';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-GPC': '1',
    'Connection': 'keep-alive',
    'TE': 'trailers'
}

function getCategoryId(url) {
    // Updated regex to capture digits following either _c or directly after - that comes after /b/
    const categoryIdRegex = /\/b\/.*?(?:_c|-)(\d+)/;
    const match = url.match(categoryIdRegex);

    if (match && match[1]) {
        const categoryId = match[1];
        return categoryId;
    } else {
        throw new Error("Category ID not found in the URL.");
    }
}

async function fetchProducts(url) {
    try {
        const categoryId = getCategoryId(url);
        const MAX_PAGES = 5 || 278;
        const PRODUCTS_PER_PAGE = 36;

        const allProducts = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
            console.log(`Fetching page ${page}...`)
            const nextProducts = (1 - page) * PRODUCTS_PER_PAGE;
            const response = await fetch(`https://www.chewy.com/plp/api/search?groupResults=true&count=36&include=items&fields%5B0%5D=PRODUCT_CARD_DETAILS&omitNullEntries=true&catalogId=1004&from=${nextProducts}&sort=byRelevance&groupId=${categoryId}`, {
                headers
            });
            const jsonObject = await response.json();
            const products = extractProducts(jsonObject);

            if (products.length === 0 || products.length < PRODUCTS_PER_PAGE) {
                break;
            }
            allProducts.push(...products);
        }
        return allProducts;
    } catch (error) {
        throw new Error(`Failed to fetch products: ${error}`);
    }
}

// console.log(getCategoryId("https://www.chewy.com/b/dry-food-388"));

// await fetchProducts("https://www.chewy.com/b/dog-288");

const url = "https://www.chewy.com/b/dry-food-388"
await fetchProducts(url).then(products => {
    const categoryId = getCategoryId(url);
    fs.writeFileSync(`Data/${categoryId}-products-${new Date().toLocaleDateString("en-US").replaceAll("/", "-")}.json`, JSON.stringify(products, null, 2));
});







