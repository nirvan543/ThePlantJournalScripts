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

module.exports = {
    readPlantsAsync,
    writePlantsAsync,
    writeSuccessfulPlantsAsync,
    writeFailedPlantsAsync,
    getPlantAbbreviation,
};