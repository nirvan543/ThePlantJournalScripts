const fs = require("fs").promises;

/**
 * 
 * @param {string} filePath 
 * @param {string} splitWith 
 * @returns {Array}
 */
async function readRawPlantsAsync(filePath, splitWith = "\n") {
    let rawPlants = await fs.readFile(filePath, "utf-8");

    const array = rawPlants.split(splitWith);

    return array;
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

        let badIndex = plant.indexOf("(");
        if (badIndex < 0) {
            badIndex = plant.indexOf(",");
        }
        if (badIndex < 0) {
            badIndex = plant.indexOf("/");
        }

        if (badIndex < 0) {
            let plantName = plant.trim();

            addPlantToCollection(processedPlants, plantName);
        } else {
            let plantName = plant.substring(0, badIndex).trim();

            addPlantToCollection(processedPlants, plantName);
        }
    });

    processedPlants.sort();

    return processedPlants;
}

/**
 * 
 * @param {Array} collection 
 * @param {String} plantName 
 */
function addPlantToCollection(collection, rawPlantName) {
    const plantName = rawPlantName.trim();
    const singularPlantName = plantName.substring(0, plantName.length - 1);
    const pluralPlantName = `${plantName}s`;
    const pluralPlantName2 = `${singularPlantName}ies`;


    let iesIndex = plantName.lastIndexOf("ies");

    if (iesIndex < 0) {
        iesIndex = plantName.length;
    }

    const singularPlantName2 = `${plantName.substring(0, iesIndex)}y`;

    // If this plant name or its singular version or its plural version is contained in the collection, toss it.
    if (collection.includes(plantName) ||
        collection.includes(singularPlantName) ||
        collection.includes(singularPlantName2) ||
        collection.includes(pluralPlantName) ||
        collection.includes(pluralPlantName2)) {

        return;
    } else {
        collection.push(plantName);
    }
}

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

/**
 * 
 * @param {String} folderPath 
 */
async function createFolderAsync(folderPath) {
    await fs.mkdir(folderPath);
}

/**
 * 
 * @param {String} filePath 
 * @param {Array} plants 
 */
async function writePlantsAsync(filePath, plants) {
    await fs.writeFile(filePath, JSON.stringify(plants));
}

/**
 * 
 * @param {String} filePath 
 * @param {Array} successfulPlants 
 */
async function writeSuccessfulPlantsAsync(filePath, successfulPlants) {
    await fs.writeFile(filePath, JSON.stringify(successfulPlants));
}

/**
 * 
 * @param {String} filePath 
 * @param {Array} failedPlants 
 */
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
    readRawPlantsAsync,
    processRawPlants,
    readPlantsAsync,
    createFolderAsync,
    writePlantsAsync,
    writeSuccessfulPlantsAsync,
    writeFailedPlantsAsync,
    getPlantAbbreviation
};