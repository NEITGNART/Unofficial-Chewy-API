import { getCategoryId, getProductList } from "./fetching-product-list.js";


function getFilePath(categoryId, categoryName, FOLDER = "Data/ProductList") {
    return `${FOLDER}/${categoryId}-${categoryName.replaceAll(" ", "")}-products-${new Date().toLocaleDateString("en-US").replaceAll("/", "-")}.json`
}

function saveProductList(products, categoryId, categoryName) {
    const path = getFilePath(categoryId, categoryName);
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
}


const categories = [
    {
        url: "https://www.chewy.com/b/dry-food-388",
        name: "Dry Food",
    }
]

for (const category of categories) {
    // Fetching product list
    const products = await getProductList(category.url);
    const categoryId = getCategoryId(category.url);
    const categoryName = category.name;
    saveProductList(products, categoryId, categoryName);
    // From the product list, we can extract the product details
    // and save them to a file
    // for (const product of products) {
    // }

}


