import Graphic from "@arcgis/core/Graphic";

export function DrawLine(draw, view, setSelectedCountyDraw) {
    let action = draw.create("polygon");

    // PolygonDrawAction.vertex-add
    action.on("vertex-add", function (evt) {
        createPolygonGraphic(evt.vertices, view);
    });

    // PolygonDrawAction.vertex-remove
    action.on("vertex-remove", function (evt) {
        createPolygonGraphic(evt.vertices, view);
    });

    // Fires when the pointer moves over the view
    action.on("cursor-update", function (evt) {
        createPolygonGraphic(evt.vertices, view);
    });

    // Add a graphic representing the completed polygon
    action.on("draw-complete", function (evt) {
        createPolygonGraphic(evt.vertices, view);
        doQuery(view, setSelectedCountyDraw);
    });
}

function createPolygonGraphic(vertices, view) {
    view.graphics.removeAll();
    let polygon = {
        type: "polygon", // autocasts as Polygon
        rings: vertices,
        spatialReference: view.spatialReference,
    };

    let graphic = new Graphic({
        geometry: polygon,
        symbol: {
            type: "simple-fill", // autocasts as SimpleFillSymbol
            color: [0, 0, 0, 0.2],
            style: "solid",
            outline: {
                color: [255, 0, 0],
                width: 1,
            },
        },
    });
    view.graphics.add(graphic);
}

function doQuery(view, setSelectedCountyDraw) {
    let counties = view.map.layers.find((layer) => layer.title === "Counties");
    let polygon = view.graphics.items[0].geometry;
    let query = counties.createQuery();
    query.geometry = polygon;
    query.spatialRelationship = "intersects";
    query.returnGeometry = true;
    query.outFields = ["*"];
    counties.queryFeatures(query).then(function (response) {
        const selectedCounty = [];
        setSelectedCountyDraw([]);
        response.features.forEach(function (feature) {
            selectedCounty.push(feature.attributes.NAME);
            highlightSelectedFeatures(view, response.features);
        });
        setSelectedCountyDraw(selectedCounty);
    });
}

function highlightSelectedFeatures(view, features) {
    let selectedGraphics = [];
    features.forEach(function (feature) {
        let graphic = new Graphic({
            geometry: feature.geometry,
            symbol: {
                type: "simple-fill",
                color: [0, 255, 255, 0.5], // Highlight color
                outline: {
                    color: [0, 255, 255, 1], // Outline color
                    width: 1,
                },
            },
        });
        selectedGraphics.push(graphic);
    });
    view.graphics.removeAll();
    view.graphics.addMany(selectedGraphics);
}
