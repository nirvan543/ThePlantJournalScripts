// Step 1: Read each plant name from the processed json file -- CHECK
// Step 2: Perform a Google image search and get the URL for one of the images returned
// Step 3: Pass the image URL to the color analyzer library to get the primary colors
// Step 4: Create the Plant object
// Step 5: Write the list of plants to a json file

const fs = require('fs');
// const sightEngine = require('sightengine')('1077382482', 'TCYZwqEz7XC4gmwr3Sgy');
const sightEngine = require('sightengine')('711445624', 'kTGwWcRokKqt8uyz8pW6');
const gis = require('g-i-s');
const { v4: uuidv4 } = require('uuid');

function getPlantAbbreviation(plantName) {
    const firstSpaceIndex = plantName.trim().indexOf(' ');

    var firstChar = plantName.substring(0, 1);

    if (firstSpaceIndex > 0) {
        var secondChar = plantName.substring(firstSpaceIndex + 1, firstSpaceIndex + 2);

        return firstChar.toUpperCase() + secondChar.toUpperCase();
    } else {
        return firstChar.toUpperCase();
    }
}

function printPlantInfos(numProcessed) {
    if (numProcessed == plantNames.length) {
        fs.writeFileSync("./assets/runs/plant_infos.json", JSON.stringify(plantInfos), function (err) {
            if (err) {
                console.error('Crap happens');
            }
        });

        fs.writeFileSync("./assets/runs/success.json", JSON.stringify(successPlants), function (err) {
            if (err) {
                console.error('Crap happens');
            }
        });

        fs.writeFileSync("./assets/runs/failure.json", JSON.stringify(failedPlants), function (err) {
            if (err) {
                console.error('Crap happens');
            }
        });
    }
}

function wait(ms) {
    let start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

const plantNamesData = fs.readFileSync('./assets/runs/failure_1.json');
const plantNames = JSON.parse(plantNamesData);

let successPlants = [];
let failedPlants = [];
let plantInfos = [];

let numProcessed = 0;

function gisCallback(error, results) {
    console.log("Error: ", error);
    console.log("Results: ", results);
}

// gis("cat", gisCallback)

plantNames.forEach(plant => {
    gis(plant, function (imageError, imageResults) {
        if (imageResults === null || imageResults === undefined) {
            failedPlants.push(plant);
            numProcessed++;

            console.log("[Error @1] Finished processing plant number " + numProcessed + ": " + plant);
            console.log("Error bruh: " + imageError);
            printPlantInfos(numProcessed);
        }
        else {
            if (imageResults.count > 0) {
                let firstImageResult = imageResults[0];

                sightEngine.check(['properties']).set_url(firstImageResult.url).then(function (colorResult) {
                    plantInfos.push({
                        id: uuidv4(),
                        name: plant,
                        abbreviation: getPlantAbbreviation(plant),
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
                    })

                    successPlants.push(plant);
                    numProcessed++;

                    console.log("[Success] Finished processing plant number " + numProcessed + ": " + plant);
                    printPlantInfos(numProcessed);
                }).catch(function (colorError) {
                    failedPlants.push(plant);
                    numProcessed++;

                    console.log("[Error @2] Finished processing plant number " + numProcessed + ": " + plant);
                    console.log("Mannnnnnn: " + colorError);
                    printPlantInfos(numProcessed);
                    wait(1000);
                });
            } else {
                numProcessed++;

                console.log(imageResults[0]);
                console.log("[Error @3] Finished processing plant number " + numProcessed + ": " + plant);
                printPlantInfos(numProcessed);
                return;
            }
        }
    });
});

/*
let numProcessed = 0;

plantNames.forEach(plant => {
    gis(plant, function (error, imageResults) {
        if (error) {
            failedPlants.push(plant);

            numProcessed++;
            console.log(numProcessed);

            if (numProcessed == plantNames.length) {
                console.log(JSON.stringify(plantInfos));
            }
        }
        else {
            sightEngine.check(['properties']).set_url(imageResults[0].url).then(function (colorResult) {
                plantInfos.push({
                    id: uuidv4(),
                    name: plant,
                    abbreviation: getPlantAbbreviation(plant),
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
                })

                successPlants.push(plant);

                numProcessed++;
                console.log(numProcessed);

                if (numProcessed == plantNames.length) {
                    console.log(JSON.stringify(plantInfos));
                }
            }).catch(function (colorError) {
                failedPlants.push(plant);

                numProcessed++;
                console.log(numProcessed);

                if (numProcessed == plantNames.length) {
                    console.log(JSON.stringify(plantInfos));
                }
            });
        }
    });
})
*/





/*
const unsplash = require('unsplash-js');
const fetch = require('node-fetch');
URL = require('url').URL;
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const serverApi = unsplash.createApi({
    accessKey: '1R6UxGnSAto7GjY0RTV3mHPjx_R9Fw6-T9P1ElqyWSI',
});

serverApi.search.getPhotos({
    query: plant,
}).then(imageResult => {
    if (imageResult.errors) {
        console.log("Uh oh unsplash, ", imageResult.errors);
    } else {
        console.log(JSON.stringify(imageResult));
        sightengine.check(['properties']).set_url(imageResult.response.results[0].urls.regular).then(function (colorResult) {
            console.log(JSON.stringify(colorResult));
        }).catch(function (colorError) {
            console.log("Uh oh sightengine, ", colorError);
        });
    }
});
*/
