require("dotenv").config();

const plantService = require("./services/plant_service");
const imageService = require("./services/image_service");
const { v4: uuidv4 } = require("uuid");

// Step 1: Read each plant name from the processed json file -- CHECK
// Step 2: Perform a Google image search and get the URL for one of the images returned -- CHECK
// Step 3: Pass the image URL to the color analyzer library to get the primary colors -- CHECK
// Step 4: Create the Plant object -- CHECK
// Step 5: Write the list of plants to a json file -- CHECK

let plants = [];
let failed = [];

const inputFile = "./assets/raw_plants.txt";

async function mainAsync() {
    let rawPlants = await plantService.readRawPlantsAsync(inputFile);
    let plantNames = plantService.processRawPlants(rawPlants);

    const dateString = new Date().toLocaleString().replace("/", "-").replace("/", "-");
    const folderName = `./runs/${dateString}`;
    const processedPlantsFile = `${folderName}/processed_plants.json`;

    await plantService.createFolderAsync(folderName);
    await plantService.writePlantsAsync(processedPlantsFile, plantNames);

    for (let i = 0; i < plantNames.length; i++) {
        const plantName = plantNames[i];

        let imageResults;

        try {
            imageResults = await imageService.getImageResultsAsync(plantName);
        } catch (e) {
            const message = `ERROR | ${plantName} | Error retrieving image results | ${JSON.stringify(e)}`;

            console.log(message);
            handleFailure(plantName, message);

            continue;
        }

        if (!imageResults || imageResults.length === 0) {
            const message = `ERROR | ${plantName} | imageResults is either undefined/null or empty | ${imageResults}`;

            console.log(message);
            handleFailure(plantName, message);

            continue;
        }

        let colorResult;

        try {
            for (let i = 0; i < imageResults.length; i++) {
                const imageResult = imageResults[i];
                colorResult = await imageService.getColorInfoFromImageAsync(imageResult.url);

                if (colorResult.status === "success") {
                    break;
                } else if (colorResult.status === "failure") {
                    const message = `WARN | ${plantName} | Error retrieving color results | ${JSON.stringify(colorResult.error)}`;

                    console.log(message);
                } else {
                    const message = `WARN | ${plantName} | Not a success or a failure`;

                    console.log(message);
                }
            }
        } catch (e) {
            const message = `ERROR | ${plantName} | Error retrieving color results | ${JSON.stringify(e)}`;

            console.log(message);
            handleFailure(plantName, message);

            continue;
        }

        if (!colorResult || colorResult.status === "failure") {
            const message = `ERROR | ${plantName} | colorResult is undefined/null or the result is marked as 'failure' | ${colorResult}`;

            console.log(message);
            handleFailure(plantName);

            continue;
        }

        let red;
        let green;
        let blue;
        const alpha = 1.0;

        const accentColors = colorResult.colors.accent;

        if (Array.isArray(accentColors) && accentColors.length > 0) {
            red = accentColors[0].r;
            green = accentColors[0].g;
            blue = accentColors[0].b;
        } else {
            red = colorResult.colors.dominant.r;
            green = colorResult.colors.dominant.g;
            blue = colorResult.colors.dominant.b;
        }

        plants.push({
            id: uuidv4(),
            name: plantName,
            abbreviation: plantService.getPlantAbbreviation(plantName),
            color: {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
            },
            shadowColor: {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
            }
        });

        await persistDataAsync(folderName);

        console.log(`SUCCESS | ${plantName}`);

        // Sleep for 1 second for every 10 plants processed.
        if (i % 10 == 0) {
            await sleepAsync(1000);
        }

        // Sleep for 1 second to avoid overloading the services
        // await sleepAsync(1000);
    }
}

/**
 * 
 * @param {String} plantName 
 * @param {String} errorMessage 
 */
function handleFailure(plantName, errorMessage) {
    failed.push({
        plant: plantName,
        error: errorMessage
    });
}

function sleepAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param {String} folderName 
 */
async function persistDataAsync(folderName) {
    try {
        await plantService.writePlantsAsync(`${folderName}/plants.json`, plants);
    } catch (e) {
        console.log("Error when persisting the plant infos: ", e);
    }

    try {
        await plantService.writeFailedPlantsAsync(`${folderName}/failure.json`, failed);
    } catch (e) {
        console.log("Error when persisting the failed plants: ", e);
    }
}

mainAsync().then(() => {
    console.log("DONE");
}).catch(e => {
    console.log("ERROR CAUGHT: ", e);
});
