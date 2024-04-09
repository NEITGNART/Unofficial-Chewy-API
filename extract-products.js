import fs from 'fs';

export default function extractProducts(jsonObject) {
    const products = jsonObject.products.map(product => {
        const imageDetails = product.image.split(",");
        return {
            name: product.name,
            url: product.href,
            catalogEntryId: product.catalogEntryId,
            imageUrl: product.imageUrl,
            image: `https:${imageDetails[0]}._AC_SS348_V${imageDetails[1]}_.jpg`,
            rating: product.rating,
            ratingCount: product.ratingCount,
            groupId: jsonObject.group.groupId,
            groupName: jsonObject.group.shortDescription
        }
    });
    return products;
}

// const jsonObject = JSON.parse(fs.readFileSync('cat-products.json'));

// const products = extractProducts(jsonObject);

// fs.writeFileSync('cat-products-cleaned.json', JSON.stringify(products, null, 2));

