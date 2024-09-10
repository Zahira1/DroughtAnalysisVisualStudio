import './Css/MapComponent.css';
import { useState, useEffect} from 'react';
import MapComponent from './MapComponent';
import GraphsSection from './GraphsSection';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import './Css/Header.css';
//import Logo from './assets/Logo.png';

import { Row, Col, Container } from 'react-bootstrap'; // Assuming you're using react-bootstrap for Row and Col
import DatePickerComponent from './DatePickerComponent.jsx';
import CountyPicker from './CountyPicker.jsx';
import PropTypes from 'prop-types';
import { QueryDate } from './utils/DateFormatter';
function Monitor({ selectedDate, selectedCounty, handleDateChange, setSelectedCounty ,handleCountyChange, setSelectedCountyDraw, selectedCountyDraw }) {
    useEffect(() => {
        // Adjust the height of the .mapDiv based on the navbar height
        function adjustMapDivHeight() {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const mapDiv = document.querySelector('.mapDiv');
            mapDiv.style.height = `${window.innerHeight - navbarHeight-40}px`;
        }

        // Call the function on component mount and on window resize
        adjustMapDivHeight();
        window.addEventListener('resize', adjustMapDivHeight);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', adjustMapDivHeight);
    }, []);


    const [isForestVisible, setIsForestVisible] = useState(true);
    let layer = new FeatureLayer({
        url : 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/1',
       
            definitionExpression: QueryDate(selectedDate),
       
       title: "Drought Condition",
       listMode: "hide",
       // definationExpression: QueryDate(selectedDate)
    });
    let expression = QueryDate(selectedDate);
    const colStyle = {
        height: '50px', // You can adjust the height as needed
    };

   
    const chartData = isForestVisible
    console.log(selectedCountyDraw);

    return (
        <div>
            <MapComponent selectedDate={selectedDate} selectedCounty={selectedCounty} Url={layer}
                queryDate={expression} onForestToggle={setIsForestVisible}
                setSelectedCountyDraw={setSelectedCountyDraw} selectedCountyDraw={selectedCountyDraw}
                setSelectedCounty={setSelectedCounty}            />
            <Container className='graphDiv' size="sm">
                <Row>
                    <Col  sm={6} style={colStyle}>
                        <DatePickerComponent onChange={handleDateChange} />
                    </Col>
                    <Col  sm={4} style={colStyle}>
                        <CountyPicker onChange={handleCountyChange} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <GraphsSection
                            selectedDate={selectedDate}
                            selectedCounty={selectedCounty}
                            chartData={chartData}
                            selectedCountyDraw={selectedCountyDraw}
                        />
                    </Col>
                </Row>
            </Container>

        </div>
    );
}
Monitor.propTypes = {
    selectedDate: PropTypes.instanceOf(Date), // Add prop type validation
    selectedCounty: PropTypes.string ,// Add prop type validation
    handleDateChange: PropTypes.func.isRequired, // Add prop type validation
    handleCountyChange: PropTypes.func.isRequired, 
    setSelectedCountyDraw: PropTypes.func.isRequired,
    selectedCountyDraw: PropTypes.array,
    setSelectedCounty: PropTypes.func.isRequired

};
export default Monitor;