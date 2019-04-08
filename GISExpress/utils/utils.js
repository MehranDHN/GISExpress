
var validGeoJSON = (geojson)=>{
    if (geojson) {
        validgeojson = geojson.type === "Feature" && geojson.geometry.coordinates.length >0;
        return validgeojson;
    }
    return false;
}

module.exports = {
    IsValidGeoJson: validGeoJSON
};