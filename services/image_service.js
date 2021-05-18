
const gis = require("g-i-s");
const sightEngine = require("sightengine")(process.env.SIGHT_ENGINE_USER, process.env.SIGHT_ENGINE_SECRET);

/**
 * 
 * @param {string} keyword 
 * @returns {Array}
 */
function getImageResultsAsync(keyword) {
    return new Promise((resolve, reject) => {
        gis(keyword, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * 
 * @param {string} url - The URL to get the color information from.
 * @returns 
 */
async function getColorInfoFromImageAsync(url) {
    return await sightEngine.check(["properties"]).set_url(url);
}

module.exports = {
    getImageResultsAsync,
    getColorInfoFromImageAsync
};