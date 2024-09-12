
import './App.css';
import Outlook from './componet/Outlook.jsx';
import Timeline from './componet/Timeline.jsx';
//import MapComponent from './componet/MapComponent'; 
//import GraphsSection from './componet/GraphsSection';
import Monitor from './componet/Monitor';
//import Timeline from './component/Timeline';
// Remove the unused import statement for 'React'
import  { useState } from 'react';
import './componet/Css/Header.css';
import Logo from './assets/starWhite.png';
import AboutModal from './componet/AboutModal.jsx';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '@esri/calcite-components/dist/components/calcite-button.js';
//import CountyPicker from './componet/CountyPicker.jsx';
//import {  CalciteButton } from '@esri/calcite-components-react';
//import DatePickerComponent from './componet/DatePickerComponent.jsx';
import './componet/Css/MapComponent.css';
import './componet/Css/Outlook.css';
import { useMediaQuery } from 'react-responsive';




function App() {

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const openAboutModal = () => setIsAboutModalOpen(true);
    const closeAboutModal = () => setIsAboutModalOpen(false);  
    let [selectedDate, setSelectedDate] = useState(new Date());
    let [selectedCounty, setSelectedCounty] = useState(null);
    let [selectedCountyDraw, setSelectedCountyDraw] = useState([]);// Add selectedCounty state

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const handleCountyChange = (county) => {
      setSelectedCounty(county);
    };
   
    const [activeComponent, setActiveComponent] = useState('Monitor'); // Default to MapComponent
    
    const handleNavClick = (component) => {
      setActiveComponent(component);
    };

  return (
    <div className="App">    
       
     

          <Navbar expand="lg" className="navbar-expand-lg w-100" bg="dark" data-bs-theme="dark">
              <Container fluid>
                  <Navbar.Brand className="mb-0 h1" href="#home">
                      <img
                          src={Logo}
                          width="32"
                          height="32"
                          className="d-inline-block align-top"
                          alt="Logo"
                      />Drought Condition Analysis
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="nav-left">
                          <Nav.Link onClick={() => handleNavClick('Home')}>Home</Nav.Link>
                          <Nav.Link onClick={() => handleNavClick('Contact')}>Contact</Nav.Link>
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>

          <Navbar expand='sm' className='navbar-expand-sm navbar-second '  >
              <Navbar.Collapse id="basic-nav">
                  <Nav className="nav-center">
                  
                      <Nav.Link onClick={openAboutModal}>About</Nav.Link>
                      <Nav.Link onClick={() => setActiveComponent('Monitor')}>Monitor</Nav.Link>
                      <Nav.Link onClick={() => setActiveComponent('Outlook')}>Outlook</Nav.Link>
                      <Nav.Link onClick={() => setActiveComponent('Timeline')}>Timeline</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
          </Navbar>

          <div id="infoDiv" className="esri-widget">
    {/* <span style="font-size: 15px; padding-left: 5px;">Select by</span> */}
    <div style={{ height: "5px" }}></div>
   
    <div id="buttonsGroup" className="buttonsGroup btn-group">
      <button id="addressbtn" className="flex-item btn addressbtn"  type="button" data-toggle="collapse"
        data-target="#addressdiv">Address</button>
        <button id="citybtn" className="flex-item btn citybtn"  type="button" data-toggle="collapse"
        data-target="#citydiv">City</button>
        <button id="countybtn" className="flex-item btn countybtn"  type="button" data-toggle="collapse"
        data-target="#countydiv">County</button>
      <button id="pointbtn" className="flex-item btn pointbtn"  type="button" data-toggle="collapse"
        data-target="#pointdiv">Point</button>
        <button id="practicebtn" className="flex-item btn practicebtn" type="button" data-toggle="collapse"
        data-target="#practicediv">Practice</button>
        <button id="programbtn" className="flex-item btn programbtn" type="button"  data-toggle="collapse"
        data-target="#programdiv">Program</button>
      <div>
        <div className="collapse indent" id="programdiv" data-parent="#buttonsGroup">
          <p></p>
          <label htmlFor="programselect" className="hidden">Program Dropdown </label>
          <select id="programselect" name="programselect" className="programselect" aria-label="Selet or type a program" title="Select or type program" >
            <option value="" >Select or type a program</option>
          </select>
        </div>
        <div className="collapse indent" id="practicediv" data-parent="#buttonsGroup" >
          <p></p>
          <div id="practicedivwithicon" style={{display: "inline-flex"}}>
          <label htmlFor="practiceselect" className="hidden"> Practice Dropdown </label>
          <select id="practiceselect" className="practiceselect" aria-label="Selet or type a practice" title="Select or type a practice" >
            <option value="" >Select or type a practice</option>
          </select>
          <div style={{marginLeft: "3px"}}>
          <button className="action-button esri-icon-lightbulb" id="lightbulbbtn" type="button" value="practices" title="Practices Description"></button>
        </div>
        </div>
        </div>
        <div className="collapse indent" id="countydiv" data-parent="#buttonsGroup">
          <p></p>
          <label htmlFor="countyselect" className="hidden">County Dropdown </label>
          <select id="countyselect" className="countyselect" aria-label="Selet or type a county" title="Select or type a county" >
            <option value="" >Select or type a county</option>
          </select>
        </div>
        <div className="collapse indent" id="citydiv" data-parent="#buttonsGroup">
          <p></p>
          <label htmlFor="cityselect" className="hidden">City Dropdown </label>
          <select id="cityselect" className="cityselect" aria-label="Selet or type a city" title="Select or type a city">
            <option value="" >Select or type a city</option>
          </select>
        </div>
        <div className="collapse" id="addressdiv" data-parent="#buttonsGroup">
          <p></p>
          <p></p>
          <div>
            <p></p>
          </div>
        </div>
        <div className="collapse" id="pointdiv" data-parent="#buttonsGroup">
          <p></p>
          <p></p>
          
          <p style={{paddingLeft: "25px", paddingTop: "5px"}}>Click on a location on the map to view available
            programs for that location</p>
        </div>
      </div>
      <div style={{textAlgin: "center", paddingTop: "8px"}}>
     
      <div id="sliderDiv" style={{height: "20px !important"}} >
      </div>
   
    </div>
    </div>
        <div>
          <div id="basemapMainDiv" className="esri-widget"  >
            <div id="basemapDiv" className="basemapdiv" >
            </div>
            </div>
        </div>
          <div id="legendMainDiv" className="esri-widget" >
            <div id="legendDiv"  >
            </div>
      </div>
      <div id="dividerContainer" style={{width: "20px", height: "10px", boxShadow: "none !important"}}></div>
   </div>

          <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} /> 
      
      
          {activeComponent == "Monitor" && <Monitor selectedDate={selectedDate} selectedCounty={selectedCounty}
              handleDateChange={handleDateChange} setSelectedCounty={setSelectedCounty}
              handleCountyChange={handleCountyChange} setSelectedCountyDraw={setSelectedCountyDraw} selectedCountyDraw={selectedCountyDraw} />}
          {activeComponent == "Outlook" &&
              <Outlook selectedCounty={selectedCounty}  handleCountyChange={handleCountyChange}
                  setSelectedCountyDraw={setSelectedCountyDraw} setSelectedCounty={setSelectedCounty} selectedCountyDraw={selectedCountyDraw} />}
          {activeComponent == "Timeline" &&
              <Timeline/>}

            
    </div>
  );
}


export default App;
