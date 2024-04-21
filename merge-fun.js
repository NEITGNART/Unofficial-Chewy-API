import fs from "fs";
import path from "path";
const folderName = "Data/ProductDetails";

// Read all json files in the folder

const readAllJsonFiles = async () => {
    try {
        const files = await fs.promises.readdir(folderName);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        return jsonFiles;
    } catch (error) {
        console.error('Error reading files:', error);
    }
}
const jsonFiles = await readAllJsonFiles();
// Merge all json files into one file
let count = 0;
for (const file of jsonFiles) {
    const filePath = path.join(folderName, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    count += data.length;
    // const newData = data.map((item) => {
    //     if (item.gtin !== null) {
    //         item.gtin = item.gtin.replaceAll("-", "");
    //     }
    //     // add item.update_time at the end of the object
    //     return { ...item, update_time: new Date().toLocaleDateString("en-US") };
    // });

    // // Save the new data to the same file
    // fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
}
console.log("done", count)