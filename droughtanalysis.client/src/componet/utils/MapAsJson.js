export const GetWebMapAsJsonString = (mv) => {
    
    const webMapAsJson = {
        operationalLayers: GetOperationalLayers(mv),
        baseMap: [],
        mapOptions: GetMapOptions(mv),
        exportOptions: {
            dpi: 96,
            outputSize: [800, 1100]
        }
    };
    return JSON.stringify(webMapAsJson);
};

const GetMapOptions = (mv) => {
    console.log(mv.extent.toJSON())
    return {
       
        extent: mv.extent.toJSON(),
        spatialReference: {
            latestWkid: 3857,
            wkid: 102100
        },
        scale: mv.scale
    };
};

const GetOperationalLayers = (mv) => {
    const operationalLayers = [];

    mv.map.layers.forEach((lyr) => {
        if (lyr.visible) {
            let opLayer = null;
            switch (lyr.type) {
                case 'wms':
                    opLayer = FormatWMSLayerJson(lyr);
                    break;
                case 'group':
                    lyr.layers.forEach((subLyr) => {
                        if (subLyr.visible) {
                            switch (subLyr.type) {
                                case 'wms':
                                    opLayer = FormatWMSLayerJson(subLyr);
                                    break;
                                case 'feature':
                                case 'map-image':
                                    opLayer = subLyr.toJSON();
                                    break;
                            }
                            if (opLayer !== null) {
                                opLayer.id = lyr.id;
                                operationalLayers.push(opLayer);
                            }
                        }
                    });
                    break;
                case 'map-image':
                case 'feature':
                    opLayer = lyr.toJSON();
                    if (opLayer !== null) {
                        opLayer.id = lyr.id;
                        operationalLayers.push(opLayer);
                    }
                    break;
            }
        }
    });

    return operationalLayers;
};

const FormatWMSLayerJson = (wmsLyr) => {
    return {
        type: 'wms',
        url: wmsLyr.url,
        opacity: wmsLyr.opacity,
        version: wmsLyr.version,
        layers: wmsLyr.sublayers.map((sublyr) => {
            return { name: sublyr.name };
        }),
        visibleLayers: wmsLyr.sublayers.map((sublyr) => {
            return sublyr.visible ? sublyr.name : '';
        })
    };
};

const GetBasemap = (map) => {
    const baseMapLayers = [];
    map.basemap.baseLayers.forEach((lyr) => {
        let lyrUrl = lyr.url;
        if (!lyr.url.includes('http')) {
            lyrUrl = 'https:' + lyrUrl;
        }
        baseMapLayers.push({ url: lyrUrl });
    });

    map.basemap.referenceLayers.forEach((lyr) => {
        let lyrUrl = lyr.url;
        if (!lyr.url.includes('http')) {
            lyrUrl = 'https:' + lyrUrl;
        }
        baseMapLayers.push({ url: lyrUrl });
    });

    return { baseMapLayers };
};