import './Css/MapComponent.css';
import { useState } from 'react';
import MapComponent from './MapComponent';
import GraphsSection from './GraphsSection';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import './Css/Header.css';
//import Logo from './assets/Logo.png';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import { Row, Col } from 'react-bootstrap'; // Assuming you're using react-bootstrap for Row and Col
import DatePickerComponent from './DatePickerComponent.jsx';
import CountyPicker from './CountyPicker.jsx';
import PropTypes from 'prop-types';
import { QueryDate } from './utils/DateFormatter';
function Monitor({ selectedDate, selectedCounty, handleDateChange, setSelectedCounty ,handleCountyChange, setSelectedCountyDraw, selectedCountyDraw }) {
    const[isForestVisible, setIsForestVisible] = useState(true);
    let layer = new MapImageLayer({
        url : 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer',
        sublayers: [{
            id: 1,
            title: "Drought Condition",
            listMode: "hide",
            definationExpression: QueryDate(selectedDate)
        }],
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
            <div className='graphDiv'>
                <Row style={colStyle}>
                    <Col xs={6} style={colStyle}>
                        <DatePickerComponent onChange={handleDateChange} />
                    </Col>
                    <Col xs={5} style={colStyle}>
                        <CountyPicker onChange={handleCountyChange} />
                    </Col>
                    <GraphsSection selectedDate={selectedDate} selectedCounty={selectedCounty} chartData={chartData} selectedCountyDraw={selectedCountyDraw }></GraphsSection>
                </Row>
            </div>
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