import fetch from 'node-fetch';
import { headers } from './MyConstant.js';
import extractProducts from './extract-products.js';

export function getCategoryId(url) {
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

async function fetchProducts(categoryUrl, maxPage) {
    try {
        const categoryId = getCategoryId(categoryUrl);
        const MAX_PAGES = maxPage || 278;
        const PRODUCTS_PER_PAGE = 36;

        const allProducts = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
            console.log(`Fetching page ${page}...`)
            const fromProducts = (page - 1) * PRODUCTS_PER_PAGE;
            const response = await fetch(`https://www.chewy.com/plp/api/search?groupResults=true&count=36&include=items&fields%5B0%5D=PRODUCT_CARD_DETAILS&omitNullEntries=true&catalogId=1004&from=${fromProducts}&sort=byRelevance&groupId=${categoryId}`, {
                headers
            });
            const jsonObject = await response.json();
            const products = extractProducts(jsonObject);
            if (products.length === 0) {
                break;
            }
            allProducts.push(...products);
            if (products.length < PRODUCTS_PER_PAGE) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
        }
        return allProducts;
    } catch (error) {
        throw new Error(`Failed to fetch products: ${error}`);
    }
}

// console.log(getCategoryId("https://www.chewy.com/b/dry-food-388"));

// await fetchProducts("https://www.chewy.com/b/dog-288");

// const url = "https://www.chewy.com/b/dry-food-388"

export async function getProductList(categoryUrl) {
    return await fetchProducts(categoryUrl, 2)
}



