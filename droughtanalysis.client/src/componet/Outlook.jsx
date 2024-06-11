import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Draw from '@arcgis/core/views/draw/Draw';
import CreateLayerList from './utils/LayerListActions';
import { DrawLine } from './utils/Draw';
import PropTypes from 'prop-types';
import CountyPicker from './CountyPicker.jsx';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { Row, Col } from 'react-bootstrap';
import GraphsSection from './OutlookGraph';
function Outlook({ selectedCounty, handleCountyChange, setSelectedCountyDraw, setSelectedCounty, selectedCountyDraw }) {
    const counties = useRef(null);
    const highlightSelect = useRef(null);
    const view = useRef(null);
    const mapDiv = useRef(null);

    const [radioValue, setRadioValue] = useState('1');
    const NextOutlookRef = useRef(null);
    const SeasonalOutlookRef = useRef(null);

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
            webmap.add(counties.current);
            const NextOutlook = new FeatureLayer({
                url: "https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/0",
                opacity: 0.7
            });
            webmap.add(NextOutlook);
            NextOutlookRef.current = NextOutlook;

            const SeasonalOutlook = new FeatureLayer({
                url: "https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/1",
                opacity: 0.7,
                visible: false // Initially set the Seasonal layer to be invisible
            });
            webmap.add(SeasonalOutlook);
            SeasonalOutlookRef.current = SeasonalOutlook;
            // Add widgets Basemap
            const basemapGallery = new BasemapGallery({
                view: view.current,
                container: document.createElement('div')
            });
            const bgExpand = new Expand({
                view: view.current,
                content: basemapGallery.container,
                expandIconClass: 'esri-icon-basemap'
            });
            // Adding Layerlist
            const layerListExp = new Expand({
                view: view.current,
                content: CreateLayerList(view),
                expanded: true
            });
            // Add Draw tool
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
                console.log("forest", chartdata);
                // onForestToggle(chartdata);

            }
            view.current.ui.add(layerListExp, 'top-right');
            view.current.ui.add(bgExpand, 'bottom-right');
        };
        initializeMap();
    }, [setSelectedCounty, setSelectedCountyDraw]);

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

    useEffect(() => {
        if (NextOutlookRef.current && SeasonalOutlookRef.current) {
            if (radioValue === '1') {
                NextOutlookRef.current.visible = false;
                SeasonalOutlookRef.current.visible = true;
            } else {
                NextOutlookRef.current.visible = true;
                SeasonalOutlookRef.current.visible = false;
            }
        }
    }, [radioValue]);

    const radio = [
        { name: 'Seasonal', value: '1' },
        { name: 'Monthly', value: '2' }
    ];
    const colStyle = {
        height: '50px', // You can adjust the height as needed
    };


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
            <div className='graphDiv'>
                <Row style={colStyle}>
                    <Col xs={6} style={colStyle}>
                        <ButtonGroup className="outlookBtnGrp mb-2">
                            {radio.map((radio, idx) => (
                                <ToggleButton
                                    className="mb-2 outlookBtn"
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    name="radio"
                                    variant={idx % 2 ? 'outline-success' : 'outline-secondary'}
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>

                    </Col>
                    <Col xs={5} style={colStyle}>
                        <CountyPicker onChange={handleCountyChange} />
                    </Col>
                    <GraphsSection selectedCounty={selectedCounty} onchart={radioValue} selectedCountyDraw={selectedCountyDraw}></GraphsSection>
                </Row>
            </div>
        </div>


    );
}

Outlook.propTypes = {
    selectedCounty: PropTypes.string,
    handleCountyChange: PropTypes.func.isRequired,
    setSelectedCountyDraw: PropTypes.func.isRequired,
    selectedCountyDraw: PropTypes.array,
    setSelectedCounty: PropTypes.func.isRequired
};

export default Outlook;
