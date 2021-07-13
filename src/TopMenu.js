import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo_fta from './fta-logo.png';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Config from './config.json';

export default function TopMenu(props) {
    return  (
        <>
            <Row className="p-0">
                <Col className="box-logo border-bottom">
                    <Navbar bg="white" className="py-0" >
                        <Navbar.Brand href="#" className="box-logo-fta pt-3">
                            <h3>Forests, Trees and Agroforestry</h3>
                            <h4>Livelihoods, Landscapes and Governance</h4>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                            </Nav>

                            <Nav>
                                <img src={logo_fta} alt="fta logo" width="150px" className="unselectable d-none d-sm-block" title="link to website CGIAR" />
                            </Nav>

                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
            <Row className="p-0">
                <Col className="py-0">
                    <Navbar bg="white" expand="sm" className="py-0">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="https://www.foreststreesagroforestry.org/what-is-fta/" target="_blank" className="px-3 mx-2">About Us</Nav.Link>
                                <Nav.Link href="https://www.foreststreesagroforestry.org/research/" target="_blank" className="px-3 mx-2">Research</Nav.Link>
                                <Nav.Link href="https://www.foreststreesagroforestry.org/news/" target="_blank" className="px-3 mx-2">News</Nav.Link>
                                <Nav.Link href="https://www.foreststreesagroforestry.org/publications/" target="_blank" className="px-3 mx-2">Resources</Nav.Link>
                                <Nav.Link href="https://www.foreststreesagroforestry.org/data-portal/" target="_blank" className="px-3 mx-2">Data Portal</Nav.Link>
                                <Nav.Link href="https://www.foreststreesagroforestry.org/asia-pacific-region-roadmaps-progress/" target="_blank" className="px-3 mx-2">Foresight</Nav.Link>
                                <Nav.Link href="https://www.foreststreesagroforestry.org/all-events/" target="_blank" className="px-3 mx-2">Event</Nav.Link>
                                <Nav.Link href={Config.base_domain + '/Help.pdf'} target="_blank" className="px-3 mx-2">Help?</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </>
    )
}

