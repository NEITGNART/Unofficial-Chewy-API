# Project Setup and Execution Guide

## Installation

To install the necessary library, run the following command in your terminal:

```bash
npm install
```

## Testing

You can perform tests using `test.js`. This script allows you to fetch data for a specific category or based on a product URL. To run this test, use the command:

```bash
node test.js
```

## Running the Application

In `app.js`, the category has already been set up for you. This includes more than 100 categories sourced from the Chewy website. You can view the complete list of categories in the `Chewy categories.xlsx` file.

To run the program, execute the following command:

```bash
node app.js
```

### Note: Please update the promotion_information as needed (MyConstant.js)

### Merge all product details from the 'Data/ProductDetails' directory into a single file

```bash
node merge-product-details.js
```
