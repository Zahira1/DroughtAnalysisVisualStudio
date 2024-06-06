import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Draw from '@arcgis/core/views/draw/Draw';
import CreateLayerList from './utils/LayerListActions';
import { DrawLine } from './utils/Draw';
import PropTypes from 'prop-types';

function MapComponent({ selectedDate, selectedCounty, Url, queryDate, onForestToggle, setSelectedCountyDraw, setSelectedCounty }) {
    const counties = useRef(null);
    const highlightSelect = useRef(null);
    const [droughtlayer, setDroughtLayer] = useState(Url);
    const view = useRef(null);
    const mapDiv = useRef(null);

   
    useEffect(() => {
       // console.log('Selected Date:', selectedDate);
        const layer = Url.findSublayerById(1);
       console.log(layer)

        // Assuming layer is a sublayer of the MapImageLayer
        if (layer) {
            layer.definitionExpression = queryDate;
            
        }
        setDroughtLayer(Url);
    }, [selectedDate, queryDate]);
    useEffect(() => {
        const initializeMap = async () => {
            const webmap = new Map({
                basemap: 'streets'
            });

            view.current = new MapView({
                container: mapDiv.current,
                map: webmap,
                center: [-117.1490, 32.7353],
                scale: 10000000
            });
            //

            webmap.add(droughtlayer);
            // Add forest layer
            const forest = new MapImageLayer({
                url: 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/Shared/Forest2015/MapServer',
                title: 'Forest',
                sublayers: [{
                    id: 0,
                    visible: true,
                    opacity: 0.5,
                    listMode: 'hide'
                }],
                legendEnabled: true
            });
            webmap.add(forest);
           //
            // Add counties layer
            counties.current = new FeatureLayer({
                url: 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/Shared/Boundaries/MapServer/1',
                title: 'Counties',
                listMode: 'hide',
                highlightOptions: {
                    color: [0, 0, 0, 0],
                    haloOpacity: 0.9,
                    fillOpacity: 0.2,
                    listMode: 'hide'
                }
            });
            webmap.add(counties.current);
           // console.log(droughtlayer.url);
            webmap.add(droughtlayer);

            // Add widgets
            const basemapGallery = new BasemapGallery({
                view: view.current,
                container: document.createElement('div')
            });
            const bgExpand = new Expand({
                view: view.current,
                content: basemapGallery.container,
                expandIconClass: 'esri-icon-basemap'
            });
            const layerListExp = new Expand({
                view: view.current,
                content: CreateLayerList(view),
                expanded: true
            });
            const draw = new Draw({
                view: view.current
            });
            const drawTool = document.getElementById('draw');
            view.current.ui.add(drawTool, 'top-right');
            document.getElementById('draw-polygon').onclick = () => {
                DrawLine(draw, view, setSelectedCountyDraw);
            };
            document.getElementById('clear-selction').onclick = () => {
                view.current.graphics.removeAll();
                setSelectedCountyDraw([]);
                setSelectedCounty(null);
                if (highlightSelect.current) {
                    highlightSelect.current.remove();
                }
            
            };
            document.getElementById('forest').onclick = () => {
                let chartdata;
                forest.visible = !forest.visible;
                chartdata = forest.visible ? 'pctForestArea' : 'pctArea';
                console.log("foresr",chartdata);
                onForestToggle(chartdata);

            }
            view.current.ui.add(layerListExp, 'top-right');
            view.current.ui.add(bgExpand, 'bottom-right');
        };
        initializeMap();
    }, []);

    




    useEffect(() => {
        const query = counties.current.createQuery();
        query.where = `NAME = '${selectedCounty}'`;
        query.outFields = ['*'];
        query.returnGeometry = true;
        const fetchData = async () => {
            const featureLayerView = await view.current.whenLayerView(counties.current);
            if (highlightSelect.current) {
                highlightSelect.current.remove();
            }
            counties.current.queryFeatures(query).then((feat) => {
                view.current.goTo(feat.features);
                highlightSelect.current = featureLayerView.highlight(feat.features);
            });
        };
        fetchData();
    }, [selectedCounty]);

    return (
        <div className="map-container">
            <div className="btn-group" id="draw" title="Draw polyline" role="group" aria-label="Basic example" style={{ display: 'flex', width: '450px' }}>
                <button className="btn btn-secondary esri-widget tool" id="draw-polygon">Draw<span className="esri-icon-polygon"></span></button>
                <button className="btn btn-secondary esri-widget tool" id="clear-selction">Clear<span className="esri-icon-erase"></span></button>
                <button className="btn btn-secondary esri-widget tool" id="report">Report<span className="esri-icon-printer"></span></button>
                <button className="btn btn-secondary esri-widget tool" id="print">Print<span className="esri-icon-printer"></span></button>
                <button className="btn btn-secondary esri-widget tool" id="forest">Forest<span className="esri-icon-layers"></span></button>
            </div>
            <div className="mapDiv" ref={mapDiv}></div>
        </div>
    );
}

MapComponent.propTypes = {
    selectedDate: PropTypes.instanceOf(Date),
    selectedCounty: PropTypes.string,
    Url: PropTypes.instanceOf(MapImageLayer).isRequired,
    queryDate: PropTypes.string.isRequired,
    onForestToggle: PropTypes.func.isRequired,
    setSelectedCountyDraw: PropTypes.func.isRequired,
    selectedCountyDraw: PropTypes.array,
    setSelectedCounty: PropTypes.func.isRequired


};

export default MapComponent;
