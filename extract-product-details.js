
function convertCurrencyStringToNumber(currencyString) {
    if (!currencyString) return 0;
    return parseFloat(currencyString.replace("$", ""))
}

function getAutoShipPrice(item, jsonObject, currentPrice) {
    const topPromotionRef = item?.['topHeadlinePromotion']?.["__ref"] ?? null;
    if (!topPromotionRef) return currentPrice;
    // const topPromotion = jsonObject.pageProps["__APOLLO_STATE__"][topPromotionRef];
    const featureToggles = jsonObject?.pageProps?.["__APOLLO_STATE__"]?.['ROOT_QUERY']?.['pdp']?.['featureToggles'] ?? null;
    if (!featureToggles) return currentPrice;
    const maxSavingDiscount = parseInt(featureToggles['autoshipFirstTimeDiscountMaxSavings']);
    const firstTimeDiscount = parseInt(featureToggles['autoshipFirstTimeDiscountPercent']);

    if (currentPrice * (firstTimeDiscount / 100) >= maxSavingDiscount) {
        return currentPrice - maxSavingDiscount;
    }
    return currentPrice - (currentPrice * (firstTimeDiscount / 100));
}

export default function extractProductDetails(itemId, jsonObject, promotional_information = "", url) {
    const itemRef = jsonObject?.pageProps["__APOLLO_STATE__"]?.["ROOT_QUERY"]?.[`item({"id":"${itemId}"})`]?.["__ref"]
    const item = jsonObject?.pageProps["__APOLLO_STATE__"]?.[itemRef];
    const product = getNonAutoShipProduct(item, jsonObject, promotional_information, url);
    if (!item.isAutoshipAllowed) {
        product.shippingPrice = product.price >= 49 ? 0 : 4.95;
        return [product];
    }
    // clone product and update autoship price
    const autoshipProduct = JSON.parse(JSON.stringify(product));
    autoshipProduct.productName = `${product.productName} - Autosent`;

    if (item['topHeadlinePromotion'] !== null) {
        autoshipProduct.price = parseFloat(getAutoShipPrice(item, jsonObject, product.price).toFixed(2));
    } else {
        autoshipProduct.price = parseFloat(convertCurrencyStringToNumber(item.autoshipPrice).toFixed(2));
    }
    product.shippingPrice = autoshipProduct.price >= 49 ? 0 : 4.95;
    autoshipProduct.is_available = autoshipProduct.price !== 0 ? true : false;
    autoshipProduct.is_autoship_option = true;
    return [product, autoshipProduct];
}

function getNonAutoShipProduct(item, jsonObject, promotional_information, url ="") {
    const promotionRef = item?.topPromotion?.["__ref"] ?? null;
    const productRef = item.product["__ref"];
    const product = jsonObject?.pageProps["__APOLLO_STATE__"]?.[productRef];
    const attributes = item[`attributeValues({"includeEnsemble":true,"usage":["DEFINING"]})`];
    const msrp = convertCurrencyStringToNumber(item.strikeThroughPrice)
    const promotionalText = promotionRef ? jsonObject.pageProps["__APOLLO_STATE__"][promotionRef].shortDescription : ""
    const ATTRIBUTE_SIZE = "Attribute:400"
    const ATTRIBUTE_COLOR = "Attribute:399"
    const ATTRIBUTE_FLAVOR = "Attribute:777"
    const price = convertCurrencyStringToNumber(item.advertisedPrice)
    return {
        productName: item.name,
        price: price,
        currency: "USD",
        inStock: item.inStock,
        categoryLevel: getBreadCum(product.breadcrumbs, jsonObject).join(" / "),
        brand: product.manufacturerName,
        shippingPrice: 0,
        productCode: jsonObject.pageProps.pageData.pageId,
        gtin: item.gtin ? `00${item.gtin}` : null,
        imageUrl: item.images[0][`url({"autoCrop":true,"square":108})`],
        maxQuantity: item.maxQuantity,
        product_url: url,
        generic_name: getMetadataValue(item.descriptionAttributes, "Generic Name"),
        product_form: getMetadataValue(item.descriptionAttributes, "Product Form"),
        drug_type: getMetadataValue(item.descriptionAttributes, "Drug Type"),
        prescription_item: item?.isPrescriptionItem ? "yes" : "no",
        is_autoship_option: false,
        adversited_price: convertCurrencyStringToNumber(item.advertisedPrice),
        autoship_price: item?.autoshipPrice ? convertCurrencyStringToNumber(item.autoshipPrice) : null,
        save_price: getExtraSavingPrice(convertCurrencyStringToNumber(item.autoshipPrice), convertCurrencyStringToNumber(item.advertisedPrice)),
        shipping_info: item.shippingMessage ? item.shippingMessage : null,
        product_description: item.description ? item?.description : null,
        promotionalText: promotionalText,
        promotional_information: promotional_information,
        pack_size: getSizeAttributes(attributes),
        msrp: msrp,
        per_unit_price: item?.perUnitPrice ? convertCurrencyStringToNumber(item.perUnitPrice) : null,
        unit_of_measure: item?.unitOfMeasure ?? null,
        item_number: jsonObject.pageProps.pageData.pageId,
        product_weight: item.weight,
        origin_product_name: product.name,
        product_color: getValueByAttributeKey(jsonObject, attributes, ATTRIBUTE_COLOR),
        product_size: getValueByAttributeKey(jsonObject, attributes, ATTRIBUTE_SIZE),
        product_flavor: getValueByAttributeKey(jsonObject, attributes, ATTRIBUTE_FLAVOR),
        made_in: getMetadataValue(item.descriptionAttributes, "Made In"),
        package_type: getMetadataValue(item.descriptionAttributes, "Package Type"),
        product_season: getMetadataValue(item.descriptionAttributes, "Season"),
        sourced_from: getMetadataValue(item.descriptionAttributes, "Sourced From"),
        food_texture: getMetadataValue(item.descriptionAttributes, "Food Texture"),
        life_stage: getMetadataValue(item.descriptionAttributes, "Lifestage"),
        breed_size: getMetadataValue(item.descriptionAttributes, "Breed Size"),
        food_form: getMetadataValue(item.descriptionAttributes, "Food Form"),
        special_diet: getMetadataValue(item.descriptionAttributes, "Special Diet"),
        is_available: price !== 0 ? true : false
    };
}

function getExtraSavingPrice(autoshipPrice, price) {
    if (!autoshipPrice) return null;
    return parseFloat((price - autoshipPrice).toFixed(2));
}

function getValueByAttributeKey(jsonObj, attributes, AttributeKey) {
    // const ATTRIBUTE_SIZE = "Attribute:400"
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i]["__ref"];
        if (jsonObj?.pageProps["__APOLLO_STATE__"]?.[attribute]?.["attribute"]?.["__ref"] === AttributeKey) {
            return JSON.parse(attribute.split("AttributeValue:")[1]).value;
        }
    }
    return null;
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

// const promotional_information = `
// *New Customers Offer Terms and Conditions
// Offer valid for new Chewy customers only. Must add $49.00 worth of eligible items to cart and enter code WELCOME to receive $20 e-Gift card. Limit 1 use per order, limit 1 order per customer. Free e-Gift card added at checkout with qualifying purchase and automatically added to your Chewy account after your order ships. Customer must be logged into account to view all applicable promotions. Excludes, gift cards, Purina Pro Plan, Diamond, Taste of the Wild, Castor & Pollux, and Vet Diet brands as well as select Beggin', DentaLife, Dog Chow, Fancy Feast, Friskies, Purina Beneful, Purina Beyond, Purina ONE, Tidy Cats, Tidy Max, and other select items. Subject to Chewy Gift Card terms and conditions found here: https://chewy.com/app/content/gift-cards-terms. Gift cards cannot be returned, refunded, or redeemed for cash as required by law. Valid through 4/15/24 6:29AM ET, while supplies last, subject to Terms.
// `

// import fs from "fs";
// const jsonObject = JSON.parse(fs.readFileSync('/Users/lucky/projects/chewy/raw-data-123726.json'), 'utf-8');

// const products = extractProductDetails("123726", jsonObject, promotional_information);

// console.log(products)



// const jsonObject = JSON.parse(fs.readFileSync('cat-products.json'));

// const products = extractProducts(jsonObject);

// fs.writeFileSync('cat-products-cleaned.json', JSON.stringify(products, null, 2));

