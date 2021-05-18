let fs = require('fs');

let rawPlants = fs.readFileSync("./plant_list_raw.txt", 'utf-8').split('\n');
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
fs.writeFileSync("./plant_list_processed.json", JSON.stringify(processedPlants), function (err) {
    if (err) {
        console.error('Crap happens');
    }
});