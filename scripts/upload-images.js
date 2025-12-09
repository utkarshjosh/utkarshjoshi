const ImageKit = require("imagekit");
const { glob } = require("glob");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const IMAGE_DIR = "static/images";
const MAP_FILE = "data/image_map.json";

// Ensure data directory exists
if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

let imageMap = {};
if (fs.existsSync(MAP_FILE)) {
    imageMap = JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
}

(async () => {
    try {
        const files = await glob(`${IMAGE_DIR}/**/*`, {
            nodir: true,
            ignore: "**/*.ico"
        });

        for (const file of files) {
            const relativePath = path.relative("static", file);
            // Normalize path for map key (e.g., "images/utkarshjoshi.png")
            const mapKey = relativePath.split(path.sep).join("/");

            if (imageMap[mapKey]) {
                console.log(`Skipping ${mapKey}, already mapped.`);
                continue;
            }

            console.log(`Uploading ${mapKey}...`);
            const fileName = path.basename(file);
            const folder = path.dirname(relativePath); // e.g., "images" or "images/projects"

            try {
                const fileContent = fs.readFileSync(file);
                const response = await imagekit.upload({
                    file: fileContent,
                    fileName: fileName,
                    folder: folder,
                    useUniqueFileName: false,
                });

                imageMap[mapKey] = response.url;
                console.log(`Uploaded ${mapKey} -> ${response.url}`);

                // Save progress incrementally
                fs.writeFileSync(MAP_FILE, JSON.stringify(imageMap, null, 2));

            } catch (error) {
                console.error(`Failed to upload ${mapKey}:`, error.message);
            }
        }

        console.log("Upload process complete.");
    } catch (err) {
        console.error("Error finding files:", err);
    }
})();
