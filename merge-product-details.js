import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

// Directory containing JSON files
const folderName = "Data/ProductDetails";

// Function to create a transform stream that processes JSON data
function createJsonTransformStream() {
    let isFirstChunk = true;
    return new Transform({
        writableObjectMode: true,
        readableObjectMode: false,
        transform(chunk, encoding, callback) {
            const data = JSON.parse(chunk);
            const jsonStr = JSON.stringify(data, null, 2);
            if (isFirstChunk) {
                this.push('[' + jsonStr);
                isFirstChunk = false;
            } else {
                this.push(',' + jsonStr);
            }
            callback();
        },
        flush(callback) {
            this.push(']');
            callback();
        }
    });
}

// Asynchronously process and write JSON files
async function processJsonFiles() {
    try {
        const files = await fs.promises.readdir(folderName);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        const now = new Date();
        const dateTimeForFilename = now.toLocaleDateString('en-US') + ' ' + now.toLocaleTimeString('en-US');
        const safeDateTimeForFilename = dateTimeForFilename.replace(/[\/,:]+/g, '-').replace(/\s+/g, '_');
        const outputFilePath = `Data/merge-product-details-${safeDateTimeForFilename}.json`;
        const outputStream = fs.createWriteStream(outputFilePath);

        await pipeline(
            // Read and transform each JSON file in sequence
            (async function* () {
                for (const file of jsonFiles) {
                    const filePath = path.join(folderName, file);
                    yield fs.promises.readFile(filePath, 'utf8');
                }
            })(),
            createJsonTransformStream(),
            outputStream
        );

        console.log('All files have been processed and output to:', outputFilePath);
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

processJsonFiles();
