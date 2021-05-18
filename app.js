const plantService = require("./plant_service");
const imageService = require("./image_service");
const { v4: uuidv4 } = require("uuid");

// Step 1: Read each plant name from the processed json file -- CHECK
// Step 2: Perform a Google image search and get the URL for one of the images returned -- CHECK
// Step 3: Pass the image URL to the color analyzer library to get the primary colors -- CHECK
// Step 4: Create the Plant object -- CHECK
// Step 5: Write the list of plants to a json file -- CHECK

let plants = [];
let failed = [];
let successful = [];

const inputFile = "./assets/runs/failure_1.json";
const outputPlantsFile = "./assets/runs/plants_2.json";
const outputFailureFile = "./assets/runs/failure_2.json";
const outputSuccessFile = "./assets/runs/success_2.json";

async function mainAsync() {
    let plantNames = await plantService.readPlantsAsync(inputFile);

    for (let i = 0; i < plantNames.length; i++) {
        const plantName = plantNames[i];

        let imageResults;

        try {
            imageResults = await imageService.getImageResultsAsync(plantName);
        } catch (e) {
            console.log(`ERROR | ${plantName} | Error retrieving image results | ${JSON.stringify(e)}`);
            handleFailure(plantName);

            continue;
        }

        if (!imageResults || imageResults.length === 0) {
            console.log(`ERROR | ${plantName} | imageResults is either undefined/null or empty | ${imageResults}`);
            handleFailure(plantName);

            continue;
        }

        let colorResult;

        try {
            for (let i = 0; i < imageResults.length; i++) {
                const imageResult = imageResults[i];
                colorResult = await imageService.getColorInfoFromImageAsync(imageResult.url);

                if (colorResult.status === "success") {
                    break;
                }
            }
        } catch (e) {
            console.log(`ERROR | ${plantName} | Error retrieving color results | ${JSON.stringify(e)}`);
            handleFailure(plantName);

            continue;
        }

        if (!colorResult || colorResult.status === "failure") {
            console.log(`ERROR | ${plantName} | colorResult is undefined/null or the result is marked as 'failure' | ${colorResult}`);
            handleFailure(plantName);

            continue;
        }

        plants.push({
            id: uuidv4(),
            name: plantName,
            abbreviation: plantService.getPlantAbbreviation(plantName),
            color: {
                red: colorResult.colors.dominant.r,
                green: colorResult.colors.dominant.g,
                blue: colorResult.colors.dominant.b,
                alpha: 1.0
            },
            shadowColor: {
                red: colorResult.colors.dominant.r,
                green: colorResult.colors.dominant.g,
                blue: colorResult.colors.dominant.b,
                alpha: 1.0
            }
        });

        successful.push(plantName);

        console.log(`SUCCESS | ${plantName}`);

        await sleepAsync(1000);
    }

    try {
        await plantService.writePlantsAsync(outputPlantsFile, plants);
    } catch (e) {
        console.log("Error when persisting the plant infos: ", e);
    }

    try {
        await plantService.writeFailedPlantsAsync(outputFailureFile, failed);
    } catch (e) {
        console.log("Error when persisting the failed plants: ", e);
    }

    try {
        await plantService.writeSuccessfulPlantsAsync(outputSuccessFile, successful);
    } catch (e) {
        console.log("Error when persisting the successful plants: ", e);
    }
}

function handleFailure(plantName) {
    failed.push(plantName);
}

function sleepAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

mainAsync().then(() => {
    console.log("DONE");
}).catch(e => {
    console.log("ERROR CAUGHT: ", e);
});
