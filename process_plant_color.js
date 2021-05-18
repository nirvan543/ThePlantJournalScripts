


/*
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
            if (imageResults.count > 0) { // TODO change this to `length`!!!
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
                    });

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
*/

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
