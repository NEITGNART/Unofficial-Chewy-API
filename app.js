import fs from "fs";
import { promotional_information } from "./MyConstant.js";
import {
    saveProductDetails,
    saveProductList
} from "./Utils.js";
import fetchProductDetails, { extractIdFromProductUrl } from "./fetching-product-details.js";
import { getCategoryId, getProductList } from "./fetching-product-list.js";


// read categories from file

const categories = JSON.parse(fs.readFileSync("chewy-categories.json", "utf8"));
// console.log(categories.length)
console.time("Fetching products")
for (const category of categories) {
    // Fetching product list
    console.log("Fetching product list for", category)
    const products = await getProductList(category.url);
    const categoryId = getCategoryId(category.url);
    saveProductList(products, category, categoryId);
    console.log("Done fetching product list for", category)
    // Start fetching product details
    console.log("Fetching product details for", category)
    for (const product of products) {
        const productDetails = await fetchProductDetails(product.url, promotional_information)
        const productDetailsId = extractIdFromProductUrl(product.url);
        saveProductDetails(productDetails, productDetailsId, category)
    }
}
console.timeEnd("Fetching products")


