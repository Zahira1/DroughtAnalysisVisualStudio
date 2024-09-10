/* eslint-disable no-debugger */
import { useEffect, useRef, useState } from 'react';
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
import Query from "@arcgis/core/rest/support/Query.js";
import { Row, Col } from 'react-bootstrap';
import { areaFormatter } from './utils/areaFormatter.js';
import './Css/timeline.css';

import Histogram from './Histogram.jsx';
function Timeline() {

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const mapDiv = useRef(null);
    const timeSliderDiv = useRef(null);
    const mapViewRef = useRef(null);
    const [sliderText, setSliderText] = useState("Initial text");
    const [data, setData] = useState([0, 0, 0, 0, 0, 0]);
    const [areaAll, setAreaAll] = useState(0);
    const openAboutModal = () => setIsAboutModalOpen(true);
    const closeAboutModal = () => setIsAboutModalOpen(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Drought Condition",
                data: [],
                backgroundColor: [
                    'rgba(255, 255, 0,1)',
                    'rgba(252, 210, 126, 1)',
                    'rgba(255, 170, 0, 1)',
                    'rgba(230, 0, 0, 1)',
                    'rgba(115, 0, 0, 1)',
                    'rgba(239, 239, 239, 1)',
                ],
            },
        ],
    });
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
        },
    };
    function rounddown(num) {
        return Math.floor(num);
    }

    useEffect(() => {
        const initializeMap = async () => {
            if (mapViewRef.current) {
                return; // Prevent reinitializing the map
            }

            try {
                // Create a new Map instance with a basemap
                const webmap = new Map({
                    basemap: "streets",
                });

                // Create a new MapView instance with specified options
                const view = new MapView({
                    container: mapDiv.current,
                    map: webmap,
                    zoom: 5,
                    center: [-99.9018, 31.9686]
                });

                const layer = new FeatureLayer({
                    url: "https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/1",
                    timeInfo: {
                        startField: "Date",
                        interval: {
                            value: 28,
                            unit: "days"
                        }
                    },
                    outFields: ["*"],
                });

                // Add layer to the map
                webmap.add(layer);

                // TimeSlider setup
                const timeSlider = new TimeSlider({
                    container: timeSliderDiv.current,
                    view: view,
                    playRate: 50,
                    fullTimeExtent: {
                        start: new Date(2000, 0, 1),
                        end: new Date(2022, 11, 31)
                    },
                    stops: {
                        interval: {
                            value: 28,
                            unit: "days"
                        }
                    }
                });

                view.ui.add(timeSlider, "bottom-left");

                mapViewRef.current = view; // Store the view reference

                // Watch for changes in the time slider's time extent and update the layer's definition expression
                reactiveUtils.watch(
                    () => timeSlider.timeExtent,
                    async () => {
                        const startDate = new Date(timeSlider.timeExtent.start).toISOString().split('T')[0];
                        const endDate = new Date(timeSlider.timeExtent.end).toISOString().split('T')[0];
                        console.log(`Filtering data from ${startDate} to ${endDate}`);
                        layer.definitionExpression = `Date >= DATE '${startDate}' AND Date <= DATE '${endDate}'`;

                        // Update layerView to reflect changes
                        const layerView = await view.whenLayerView(layer);
                        layerView.filter = {
                            timeExtent: timeSlider.timeExtent
                        };

                        //// Update the text content based on the time extent
                        setSliderText(` Data from ${startDate} to ${endDate}`);
                        fetchData(startDate, endDate);
                    }
                );

                const fetchData = async (startDate, endDate) => {
                    const query = layer.createQuery();
                    query.where = `Date >= DATE '${startDate}' AND Date <= DATE '${endDate}'`;
                    query.outFields = ['*'];
                    query.returnGeometry = false;

                    const DMlabel = ["Exceptional Drought", "Extreme Drought", "Severe Drought", "Moderate Drought", "Abnormally Dry", "None"];
                    let newData = [0, 0, 0, 0, 0, 0]; // Use a local variable to avoid mutating the state directly
                    let area = [0, 0, 0, 0, 0, 0];

                    const featureSet = await layer.queryFeatures(query);
                    console.log("featureSet", featureSet);
                    debugger
                    featureSet.features.forEach((feature) => {
                        const DM = feature.attributes.DM;
                        const Date = feature.attributes.Date;
                        const AllPct = feature.attributes.AllPct;
                        const AreaA = feature.attributes.AllAcres;
                        console.log("AllPct", AllPct);
                        console.log(Date);
                        if (DM >= 0 && DM <= 5) {
                            newData[DM] += rounddown(AllPct);
                            area[DM] += (AreaA);
                        }
                    });

                    const noneD = 100 - (newData[0] + newData[1] + newData[2] + newData[3] + newData[4]);
                    const noneA = 171902080 - (area[0] + area[1] + area[2] + area[3] + area[4]);
                    area[5] = noneA;
                    newData[5] = noneD;

                    setData(newData); // Update the state with the new data
                    setAreaAll(area);

                    console.log("newData", newData.length);

                    setChartData({
                        labels: DMlabel,
                        datasets: [
                            {
                                label: "Drought Condition",
                                data: newData,
                                backgroundColor: [
                                    'rgba(255, 255, 0,1)',
                                    'rgba(252, 210, 126, 1)',
                                    'rgba(255, 170, 0, 1)',
                                    'rgba(230, 0, 0, 1)',
                                    'rgba(115, 0, 0, 1)',
                                    'rgba(239, 239, 239, 1)',
                                ],
                            },
                        ],
                    });
                };

            } catch (error) {
                console.error("Error initializing the map or time slider:", error);
            }

        };

        initializeMap();

        return () => {
            if (mapViewRef.current) {
                mapViewRef.current.destroy();
                mapViewRef.current = null;
            }
        };
    }, []);

    // Render the map container, time slider container, and text div in the top-right corner
    return (
        <div style={{ height: "88.9vh", width: "100%", position: "relative" }}>
            <div ref={mapDiv} style={{ height: "88.9vh", width: "100%" }}></div>
            <div ref={timeSliderDiv} style={{ position: "absolute", bottom: 0, width: "70%" }}></div>
            <Histogram isOpen={isAboutModalOpen} onClose={closeAboutModal} ></Histogram>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20%', height: '45vh', margin: '1rem', background: '#333333', padding: '1rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', zIndex: 10 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, margin: '1rem', zIndex: 10 }}>
                    <button className='btn btn btn-info histogram-button' style={{ backgroundcolor: '#00796b' }} onClick = { openAboutModal }>Histogram</button>
                </div>
                <div style={{ position: 'relative', width: '100%', height: '20vh', color: '#D7D7D7', top:'5vh' }}>
                    <Doughnut data={chartData} options={chartOptions} />
                    
                    <Row style={{ margin: 0 }}>
                        <Col xs={6} style={{ textAlign: 'left' }}>
                            <h6 style={{ color: '#730000', margin: 0 }}> {data[4]} % Exceptional </h6>
                            <p style={{ margin: 0, fontSize: "10px" }}>{areaFormatter(areaAll[4])}</p>
                            <h6 style={{ color: '#E6000F', margin: 0 }}>{data[3]} % Extreme  </h6>
                            <p style={{ margin: 0, fontSize: "12px" }}>{areaFormatter(areaAll[3])} acres</p>
                            <h6 style={{ color: '#FFA900', margin: 0 }}> {data[2]}% Severe  </h6>
                            <p style={{ margin: 0, fontSize: "12px" }}>{areaFormatter(areaAll[2])} acres</p>
                        </Col>
                        <Col xs={6} style={{ textAlign: 'left' }}>
                            <h6 style={{ color: '#FDD27E', margin: 0 }}>{data[1]} % Moderate </h6>
                            <p style={{ margin: 0, fontSize: "12px" }}>{areaFormatter(areaAll[1])} acres</p>
                            <h6 style={{ color: '#FFFF00', margin: 0 }}> {data[0]}% Abnormally Dry </h6>
                            <p style={{ margin: 0, fontSize: "12px" }}>{areaFormatter(areaAll[0])} acres</p>
                            <h6 style={{ color: 'D7D7D7', margin: 0 }}> {data[5]}% None </h6>
                            <p style={{ margin: 0, fontSize: "12px" }}>{areaFormatter(areaAll[5])} acres</p>
                        </Col>
                    </Row>
                    <p style={{ color: 'white' }}>{sliderText}</p>
                </div>
            </div>
        </div>
    );
}

export default Timeline;
