import fs from "fs";

function createPathFromCategory(categoryJson) {
    const categoryName = categoryJson.category;
    const superCategory = categoryJson.superCategory;
   return `${ superCategory.replace(" ", "") }-${ categoryName.replaceAll(" ", "").replaceAll("&", "-").replaceAll(",", "-")}`;
}

function getFilePath(categoryId, categoryJson, FOLDER = "Data/ProductList") {
    return `${FOLDER}/${createPathFromCategory(categoryJson)}-${categoryId}-${new Date().toLocaleDateString("en-US").replaceAll("/", "-")}.json`
}

export function saveProductList(products, categoryJson, categoryId) {
    const path = getFilePath(categoryId, categoryJson);
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
    console.log("Product list saved to", path);
}

function getProductDetailsFilePath(productId, categoryJson, FOLDER = "Data/ProductDetails") {
    return `${FOLDER}/${createPathFromCategory(categoryJson)}-${productId}-${new Date().toLocaleDateString("en-US").replaceAll("/", "-")}.json`
}

export function saveProductDetails(products, productId, categoryJson, FOLDER = "Data/ProductDetails") {
    const path = getProductDetailsFilePath(productId, categoryJson, FOLDER);
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
    console.log("Product details saved to", path);
}
