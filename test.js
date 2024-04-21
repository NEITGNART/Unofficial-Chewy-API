import fs from "fs";
import { promotional_information } from "./MyConstant.js";
import {
    getFilePath,
    getProductDetailsFilePath,
    saveProductDetails,
    saveProductList
} from "./Utils.js";
import getProductDetails, { extractIdFromProductUrl } from "./fetching-product-details.js";
import { getCategoryId, getProductList } from "./fetching-product-list.js";

// Testing for one category
const categories = [
    {
        "category": "Horse Pharmacy",
        "superCategory": "Pharmacy",
        "url": "https://www.chewy.com/b/horse-pharmacy-11617"
    }
]


async function getProductsFromProductUrl(productUrl, category) {
    console.time("Fetching product details")
    const productDetails = await getProductDetails(productUrl, promotional_information)
    const productDetailsId = extractIdFromProductUrl(productUrl);
    saveProductDetails(productDetails, productDetailsId, category)
    console.timeEnd("Fetching product details")
}


async function getProductsFromCategory(categories) {
    console.time("Fetching products")
    for (const category of categories) {
        // TODO: Implement caching for product list
        console.log(`Fetching product list for ${category.category} in ${category.superCategory} - ${new Date().toLocaleDateString("en-US")}. URL: ${category.url} `)
        const categoryId = getCategoryId(category.url);
        // If getFIlePath is exist
        let products = [];
        if (fs.existsSync(getFilePath(categoryId, category))) {
            console.log("Product list already exists. Skipping...")
            products = JSON.parse(fs.readFileSync(getFilePath(categoryId, category), "utf8"));
        }
        else {
            products = await getProductList(category.url);
            saveProductList(products, category, categoryId);
            console.log(`Done fetching product list for ${category.category} in ${category.superCategory}`)
        }
        console.log(`Fetching product details for ${category.category} in ${category.superCategory}`)
        for (const product of products) {
            // TODO: Implement caching for product details
            const productDetailsId = extractIdFromProductUrl(product.url);
            if (fs.existsSync(getProductDetailsFilePath(productDetailsId, category))) {
                console.log("Product details already exists. Skipping...")
                continue;
            }
            const productDetails = await getProductDetails(product.url, promotional_information)
            saveProductDetails(productDetails, productDetailsId, category)
        }
    }
    console.timeEnd("Fetching products")
}
// You may want to use console.log = function () {}; to disable console logs


// await getProductsFromCategory(categories)

// Uncomment this to test fetching product details

await getProductsFromProductUrl("https://www.chewy.com/fancy-feast-grilled-seafood-feast/dp/103971", {
    "category": "Horse Pharmacy",
    "superCategory": "Pharmacy"
})



// 2h14m