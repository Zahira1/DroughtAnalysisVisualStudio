
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
