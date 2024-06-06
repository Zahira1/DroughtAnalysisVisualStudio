
import './App.css';
import Outlook from './componet/Outlook.jsx';
//import MapComponent from './componet/MapComponent'; 
//import GraphsSection from './componet/GraphsSection';
import Monitor from './componet/Monitor';
//import Timeline from './component/Timeline';
// Remove the unused import statement for 'React'
import  { useState } from 'react';
import './componet/Css/Header.css';
import Logo from './assets/Logo.png';
import AboutModal from './componet/AboutModal.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@esri/calcite-components/dist/components/calcite-button.js';
//import CountyPicker from './componet/CountyPicker.jsx';
//import {  CalciteButton } from '@esri/calcite-components-react';
//import DatePickerComponent from './componet/DatePickerComponent.jsx';
import './componet/Css/MapComponent.css';
import './componet/Css/Outlook.css';


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
       
      <header className='header'>
        <Container>
          <Row>
            <Col xs={1}>
              <img src={Logo} style={{ height: '5vh' }} alt="Logo" />
            </Col>
            <Col xs={8}>
              <h2>Drought Condition</h2>
            </Col>
          </Row>
        </Container>

        <Container className='home2'>
          <a className='home' href='https://tfsweb.tamu.edu/'>Home | </a>
          <a className='home' href='https://texasforestinfo.tamu.edu/contact/'> | Contact</a>
        </Container>
      </header>
     
      <nav className='nav'>
              <button className='btn ' onClick={openAboutModal}>About</button>
              <button className='btn  ' onClick={() => setActiveComponent('Monitor')}>Monitor</button>
              <button className='btn  ' onClick={() => setActiveComponent('Outlook')} >Outlook</button>
              <button className='btn  ' onClick={() => setActiveComponent('Timeline')}>Timeline</button>
      </nav>

          <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} /> 
      
      
          {activeComponent == "Monitor" && <Monitor selectedDate={selectedDate} selectedCounty={selectedCounty}
              handleDateChange={handleDateChange} setSelectedCounty={setSelectedCounty}
              handleCountyChange={handleCountyChange} setSelectedCountyDraw={setSelectedCountyDraw} selectedCountyDraw={selectedCountyDraw} />}
          {activeComponent == "Outlook" &&
              <Outlook selectedCounty={selectedCounty}  handleCountyChange={handleCountyChange}
              setSelectedCountyDraw={setSelectedCountyDraw} setSelectedCounty={setSelectedCounty} selectedCountyDraw={selectedCountyDraw} />}

            
    </div>
  );
}


export default App;
