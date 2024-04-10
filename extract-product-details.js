import fs from 'fs';
import removeMd from 'remove-markdown';

function convertCurrencyStringToNumber(currencyString) {
    if (!currencyString) return 0;
    return parseFloat(currencyString.replace("$", ""))
}

export default function extractProductDetails(itemId, jsonObject, promotional_information = "") {
    const itemRef = jsonObject?.pageProps["__APOLLO_STATE__"]?.["ROOT_QUERY"]?.[`item({"id":"${itemId}"})`]?.["__ref"]
    const item = jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef];







    // const products = [];
    // const productBase = {
    //     price: convertCurrencyStringToNumber(item.strikeThroughPrice),
    //     currency: "USD"
    // }

    console.log(getNonAutoShipProduct(item, jsonObject, promotional_information));


    // const price = convertCurrencyStringToNumber(item.strikeThroughPrice)


    // const price = convertCurrencyStringToNumber(item.advertisedPrice)


    // if (item.isAutoshipAllowed) {
    //     // split into 2 items
    //     // productname + " - Autosent"
    //     const autoshipProduct = {
    //         productName: `${item.name} - Autosent`,
    //         price: price,
    //         autoshipPrice: convertCurrencyStringToNumber(item.autoshipPrice),
    //         savePrice: convertCurrencyStringToNumber(item.strikeThroughSavings),
    //         inStock: item.inStock,
    //         maxQuantity: item.maxQuantity,
    //         categoryLevel: getBreadCum(product.breadcrumbs, jsonObject).join(" / "),
    //         brand: product.manufacturerName,
    //         shipping: price >= 49 ? 0 : 4.95,
    //         productCode: jsonObject.pageProps.pageData.pageId,
    //         gtin: item.gtin ? `00${item.gtin}` : null,
    //         imageUrl: item.images[0][`url({"autoCrop":true,"square":108})`],
    //         metadata: {
    //             generic_name: getMetadataValue(product.descriptionAttributes, "Generic Name"),
    //             product_form: getMetadataValue(product.descriptionAttributes, "Product Form"),
    //             drug_type: getMetadataValue(product.descriptionAttributes, "Drug Type"),
    //             prescription_item: item?.isPrescriptionItem ? "Yes" : "No",
    //             autoshipPrice: item?.autoshipPrice ? convertCurrencyStringToNumber(item.autoshipPrice) : null,
    //             shipping_info: item?.shippingMessage ?? null,
    //             product_description: item?.description ?? null,
    //             promotionalText: promotionalText,
    //             promotional_information: promotional_information,
    //             pack_size: getSizeAttributes,
    //             per_unit_price: item?.pricePerUnit ? convertCurrencyStringToNumber(item.pricePerUnit) : null,
    //             unit_of_measure: item?.unitOfMeasure ?? null,
    //             msrp: msrp,
    //         }
    //     };
    //     // console.log(autoshipProduct)

    // } else {
    //     const product = { ...productBase, 'productName': item.name };
    // Options also
}

function getNonAutoShipProduct(item, jsonObject, promotional_information) {
    const promotionRef = item.topPromotion["__ref"];
    const productRef = item.product["__ref"];
    const product = jsonObject?.pageProps["__APOLLO_STATE__"]?.[productRef];
    const attributes = item[`attributeValues({"includeEnsemble":true,"usage":["DEFINING"]})`];
    const msrp = convertCurrencyStringToNumber(item.strikeThroughPrice)
    const promotionalText = promotionRef ? jsonObject.pageProps["__APOLLO_STATE__"][promotionRef].shortDescription : ""
    return {
        productName: item.name,
        price: convertCurrencyStringToNumber(item.advertisedPrice),
        // savePrice: convertCurrencyStringToNumber(item.strikeThroughSavings),
        currency: "USD",
        inStock: item.inStock,
        maxQuantity: item.maxQuantity,
        categoryLevel: getBreadCum(product.breadcrumbs, jsonObject).join(" / "),
        brand: product.manufacturerName,
        shipping: item.advertisedPrice >= 49 ? 0 : 4.95,
        productCode: jsonObject.pageProps.pageData.pageId,
        gtin: item.gtin ? `00${item.gtin}` : null,
        imageUrl: item.images[0][`url({"autoCrop":true,"square":108})`],
        metadata: {
            generic_name: getMetadataValue(item.descriptionAttributes, "Generic Name"),
            product_form: getMetadataValue(item.descriptionAttributes, "Product Form"),
            drug_type: getMetadataValue(item.descriptionAttributes, "Drug Type"),
            prescription_item: item?.isPrescriptionItem ? "yes" : "no",
            autoshipPrice: item?.autoshipPrice ? convertCurrencyStringToNumber(item.autoshipPrice) : null,
            shipping_info: item.shippingMessage ? removeMd(item.shippingMessage) : null,
            product_description: item.description ? removeMd(item?.description) : null,
            promotionalText: promotionalText,
            promotional_information: promotional_information,
            pack_size: getSizeAttributes(attributes),
            msrp: msrp,
            per_unit_price: item?.perUnitPrice ? convertCurrencyStringToNumber(item.perUnitPrice) : null,
            unit_of_measure: item?.unitOfMeasure ?? null,
            item_number: jsonObject.pageProps.pageData.pageId,
            weight: item.weight,
            made_in: getMetadataValue(item.descriptionAttributes, "Made In"),
            package_type: getMetadataValue(item.descriptionAttributes, "Package Type"),
            season: getMetadataValue(item.descriptionAttributes, "Season"),
            sourced_from: getMetadataValue(item.descriptionAttributes, "Sourced From"),
            food_texture: getMetadataValue(item.descriptionAttributes, "Food Texture"),
            lifestage: getMetadataValue(item.descriptionAttributes, "Lifestage"),
            breed_size: getMetadataValue(item.descriptionAttributes, "Breed Size"),
            food_form: getMetadataValue(item.descriptionAttributes, "Food Form"),
            special_diet: getMetadataValue(item.descriptionAttributes, "Special Diet")
        }
    };
}

function getSizeAttributes(attributes) {
    if (attributes.length === 0) return null;
    const lastAttribute = attributes[attributes.length - 1]["__ref"];
    const sizeAttribute = lastAttribute.split("AttributeValue:")[1];
    return JSON.parse(sizeAttribute).value;
}

function getMetadataValue(descriptionAttributes, key) {
    const attributeObject = descriptionAttributes.find((attr) => attr.name === key);
    if (!attributeObject) return null; // Return null if no matching attribute is found
    // Extract and parse each value from the attribute's values array
    const values = attributeObject.values.map((valObj) => {
        // Extract the JSON part of the string
        const jsonPart = valObj.__ref.split("AttributeValue:")[1];
        // Parse the JSON to get the object, and then extract the value property
        return JSON.parse(jsonPart).value;
    });
    // Join all extracted values with ", " and return
    return values.join(", ");
}

function getBreadCum(breadcums, jsonObject) {
    const breadcumRefs = breadcums.map((crumb) => crumb["__ref"]);
    const breadcumObjects = breadcumRefs.map((ref) => jsonObject?.pageProps["__APOLLO_STATE__"]?.[ref]);
    return breadcumObjects.map((crumb) => crumb.name);
}


const jsonObject = JSON.parse(fs.readFileSync('/Users/lucky/projects/chewy/product-details-35512.json'), 'utf-8');

extractProductDetails("35512", jsonObject, "Promotional Information");




// const jsonObject = JSON.parse(fs.readFileSync('cat-products.json'));

// const products = extractProducts(jsonObject);

// fs.writeFileSync('cat-products-cleaned.json', JSON.stringify(products, null, 2));

