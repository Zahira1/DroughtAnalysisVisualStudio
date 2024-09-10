import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Draw from '@arcgis/core/views/draw/Draw';
import { DrawLine } from './utils/Draw';
import PropTypes from 'prop-types';
import { GetWebMapAsJsonString } from './utils/MapAsJson';
import { submitJob } from '@arcgis/core/rest/geoprocessor';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function MapComponent({ selectedDate, selectedCounty, queryDate, onForestToggle, setSelectedCountyDraw, setSelectedCounty }) {
    const counties = useRef(null);
    const highlightSelect = useRef(null);
    const droughtLayer = useRef(null);
    const view = useRef(null);
    const mapDiv = useRef(null);

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

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

            // Add drought layer
            droughtLayer.current = new FeatureLayer({
                url: 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/1',
                opacity: 0.7,
                definitionExpression: queryDate,
            });
            webmap.add(droughtLayer.current);
            webmap.add(counties.current);

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

            // Draw tool 
            const draw = new Draw({
                view: view.current
            });
            const drawTool = document.getElementById('draw');
            view.current.ui.add(drawTool, 'top-right');
            document.getElementById('draw-polygon').onclick = () => {
                DrawLine(draw, view.current, setSelectedCountyDraw);
            };

            // Clear selection button
            document.getElementById('clear-selction').onclick = () => {
                view.current.graphics.removeAll();
                setSelectedCountyDraw([]);
                setSelectedCounty(null);
                if (highlightSelect.current) {
                    highlightSelect.current.remove();
                }
            };

            // Forest button
            document.getElementById('forest').onclick = () => {
                forest.visible = !forest.visible;
                onForestToggle(forest.visible ? 'pctForestArea' : 'pctArea');
            };

            //Report and printig button

            const geoprocessor = 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/Shared/PrintUsingPro/GPServer/PrintUsingPro';

            // Print button
            document.getElementById('print').onclick = async () => {
                try {
                    console.log('it is working');
                    const printParameters = {
                        Web_Map_as_JSON: GetWebMapAsJsonString(view.current)
                    };
                    const jobInfo = await submitJob(geoprocessor, printParameters);
                    await jobInfo.waitForJobCompletion();
                    const response = await jobInfo.fetchResultData('Output_File');
                    console.log(response.value.url);
                } catch (error) {
                    console.error('Print error:', error);
                }
            };

            // Report button
            let pathname = window.location.href;
           // console.log(pathname);
            let pathnameProxy;
            let lastChar = pathname[pathname.length - 1];
            //pathnameProxy = pathname
            if (lastChar == "/") {
                pathnameProxy = pathname + 'ReportService';
                console.log(pathnameProxy);
            } else {
                pathnameProxy = pathname + '/ReportService';
                console.log(pathnameProxy);
            }

            document.getElementById('report').onclick = async () => {
                try {
                    const printParameters = {
                        Web_Map_as_JSON: GetWebMapAsJsonString(view.current)
                    };
                    const jobInfo = await submitJob(geoprocessor, printParameters);
                    await jobInfo.waitForJobCompletion();
                    const response = await jobInfo.fetchResultData('Output_File');
                    console.log(response.value.url);
                    console.log(pathnameProxy);
                    const urlPic = response.value.url;
                    fetch(pathnameProxy, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ content: urlPic })
                    })
                        .then(response => {
                            console.log(response);
                        });
                } catch (error) {
                    console.error('Print error:', error);
                }
            };

            view.current.ui.add(bgExpand, 'bottom-right');
        };
        initializeMap();
    }, []);

    useEffect(() => {
        if (!counties.current) return;
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

    useEffect(() => {
        if (droughtLayer.current) {
            droughtLayer.current.definitionExpression = queryDate;
        }
    }, [queryDate]);

    return (
        <div className="map-container">
            <ButtonGroup
                size='sm'
                id="draw"
                title="Draw polyline"
                role="group"
                aria-label="Basic example"
                className="button-group-responsive"
            >
                <Button variant="secondary" className="esri-widget tool" id="draw-polygon">
                    Draw<span className="esri-icon-polygon"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool" id="clear-selction">
                    Clear<span className="esri-icon-erase"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool" id="report">
                    Report<span className="esri-icon-printer"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool" id="print">
                    Print<span className="esri-icon-printer"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool" id="forest">
                    Forest<span className="esri-icon-layers"></span>
                </Button>
            </ButtonGroup>
            <div className="mapDiv" ref={mapDiv}></div>
        </div>

    );
}

MapComponent.propTypes = {
    selectedDate: PropTypes.instanceOf(Date),
    selectedCounty: PropTypes.string,
    queryDate: PropTypes.string.isRequired,
    onForestToggle: PropTypes.func.isRequired,
    setSelectedCountyDraw: PropTypes.func.isRequired,
    selectedCountyDraw: PropTypes.array,
    setSelectedCounty: PropTypes.func.isRequired
};

export default MapComponent;