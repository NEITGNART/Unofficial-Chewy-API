import fs from "fs";
import fetch from "node-fetch";
import { headers } from "./MyConstant.js";
import extractProductDetails from "./extract-product-details.js";
import getLastedProductApi from "./getLastedProductDetailsApi.js";



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

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000;
    let resourceId = fs.readFileSync("resource.txt", "utf-8");
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const allProducts = []
            const productPath = extractPathFromUrl(url);
            const id = extractIdFromUrl(url);
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
            fs.writeFileSync(`Data/Product-Details/product-details-${id}-${new Date().toLocaleDateString("en-US").replaceAll("/", "-") }.json`, JSON.stringify(allProducts, null, 2));
            break;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed: ${error}`);
            await getLastedProductApi().then((newResourceId) => {
                resourceId = newResourceId;
                fs.writeFileSync("resource.txt", newResourceId);
                console.log(`New resource id: ${newResourceId}`);
            }).catch((error) => {
                console.error(`Failed to fetch resource id: ${error}`);
            });
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
    }

}

// console.time("fetchProductDetails");
// await fetchProductDetails("https://www.chewy.com/purina-pro-plan-high-protein-shredded/dp/52445", promotional_information)
// console.timeEnd("fetchProductDetails");
// // const productPath = extractPathFromUrl("");

// // console.log(productPath)