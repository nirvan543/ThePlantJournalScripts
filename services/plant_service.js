const fs = require("fs").promises;

/**
 * 
 * @param {string} filePath - The relative path to the file to read from.
 * @returns {Array}
 */
async function readPlantsAsync(filePath) {
    const data = await fs.readFile(filePath);
    const plantNames = JSON.parse(data);

    return plantNames;
}

async function writePlantsAsync(filePath, plants) {
    await fs.writeFile(filePath, JSON.stringify(plants));
}

async function writeSuccessfulPlantsAsync(filePath, successfulPlants) {
    await fs.writeFile(filePath, JSON.stringify(successfulPlants));
}

async function writeFailedPlantsAsync(filePath, failedPlants) {
    await fs.writeFile(filePath, JSON.stringify(failedPlants));
}

/**
 * 
 * @param {string} plantName 
 * @returns {string}
 */
function getPlantAbbreviation(plantName) {
    const firstSpaceIndex = plantName.trim().indexOf(" ");

    var firstChar = plantName.substring(0, 1);

    if (firstSpaceIndex > 0) {
        var secondChar = plantName.substring(firstSpaceIndex + 1, firstSpaceIndex + 2);

        return firstChar.toUpperCase() + secondChar.toUpperCase();
    } else {
        return firstChar.toUpperCase();
    }
}

/**
 * 
 * @param {Array} rawPlants 
 * @returns {Array}
 */
function processRawPlants(rawPlants) {
    let processedPlants = [];

    rawPlants.forEach(plant => {
        if (plant == "") {
            return;
        }

        let parenIndex = plant.indexOf("(");

        if (parenIndex < 0) {
            let plantName = plant.trim();

            if (!processedPlants.includes(plantName)) {
                processedPlants.push(plantName);
            }
        } else {
            let plantName = plant.substring(0, parenIndex).trim();

            if (!processedPlants.includes(plantName)) {
                processedPlants.push(plantName);
            }
        }
    });

    processedPlants.sort();

    return processedPlants;
}

/**
 * 
 * @param {string} filePath 
 * @param {string} splitWith 
 * @returns {Array}
 */
async function readRawPlantsAsync(filePath, splitWith = "\n") {
    let rawPlants = await fs.readFile(filePath, "utf-8").split(splitWith);

    return rawPlants;
}

module.exports = {
    readPlantsAsync,
    writePlantsAsync,
    writeSuccessfulPlantsAsync,
    writeFailedPlantsAsync,
    getPlantAbbreviation,
    processRawPlants,
    readRawPlantsAsync
};