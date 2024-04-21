import fs from "fs";
import fetch from "node-fetch";
import { headers } from "./MyConstant.js";
import extractProductDetails from "./extract-product-details.js";
import getLastedProductApi from "./getLastedProductDetailsAPI.js";

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

export function extractIdFromProductUrl(url) {
    const idRegex = /\/dp\/(\d+)/;
    const match = url.match(idRegex);
    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error("ID not found in the URL.");
    }
}


function getRelevanceEntriesId(itemId, jsonObject, isIncludeHiddenProduct) {
    const itemRef = jsonObject?.pageProps["__APOLLO_STATE__"]?.["ROOT_QUERY"]?.[`item({"id":"${itemId}"})`]?.["__ref"]
    const item = jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef];
    const productRef = item.product["__ref"]
    return jsonObject?.pageProps["__APOLLO_STATE__"][productRef][`items({"includeEnsemble":true})`]?.filter((itemRef) => {
        if (isIncludeHiddenProduct) {
            return true;
        }
        const item = jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef["__ref"]];
        return item.isPublished;
    }).map((itemRef) => {
        return jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef["__ref"]].entryID
    })
        .filter((entryId) => (entryId !== undefined && entryId !== ("" + itemId))) ?? [];
}


export default async function getProductDetails(url, promotional_information, isIncludeHiddenProduct = false) {

    const MAX_RETRIES = 10;
    const RETRY_DELAY = 5000;
    let resourceId = fs.readFileSync("resource.txt", "utf-8");

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const allProducts = []
            const productPath = extractPathFromUrl(url);
            const id = extractIdFromProductUrl(url);
            const jsonObject = await fetchProductDetails(resourceId, productPath, id);
            // const products = extractProductDetails(id, jsonObject, promotional_information); 
            // allProducts.push(...products);
            await new Promise((resolve) => setTimeout(resolve, (Math.random() * 300) + 500));
            const entriesId = getRelevanceEntriesId(id, jsonObject, isIncludeHiddenProduct);
            for (let i = 0; i < entriesId.length; i++) {
                console.log(`Fetching details for product ${i + 1} out of ${entriesId.length} total products...`);
                const entryId = entriesId[i];
                const entryJsonObject = await fetchProductDetails(resourceId, productPath, entryId)
                const entryProducts = extractProductDetails(entryId, entryJsonObject, promotional_information, `https://www.chewy.com/${productPath}${entryId}`);
                allProducts.push(...entryProducts);
                // add random delay to avoid being blocked
                await new Promise((resolve) => setTimeout(resolve, (Math.random() * 300) + 500));
            }
            return allProducts;
        } catch (error) {
            console.log("Retrying...", url)
            console.error(`Attempt ${attempt + 1} failed: ${error}`);
            if (error.message.includes("is not valid JSON")) {
                await getLastedProductApi().then((data) => {
                    resourceId = data.resourceId;
                    fs.writeFileSync("resource.txt", resourceId);
                }).catch((error) => {
                    console.error(`Failed to fetch resource id: ${error}`);
                });
            }
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
    }
    return [];
}
async function fetchProductDetails(resourceId, productPath, id) {
    const api = `https://www.chewy.com/_next/data/chewy-pdp-ui-${resourceId}/en-US/${productPath}${id}.json`;
    const response = await fetch(api, {
        headers
    });
    const jsonObject = await response.json();
    return jsonObject;
}

