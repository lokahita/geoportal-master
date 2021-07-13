import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Trash, ThreeDotsVertical, BoundingBoxCircles, Layers, Download, Eye, EyeFill, EyeSlashFill, QuestionCircleFill, Printer, Wrench, Grid3x3, QuestionCircle, ListTask, ZoomIn, CardList, Table, InfoCircle, GearWideConnected, Map, ZoomOut } from 'react-bootstrap-icons';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Sidebar(props) {

    function getRowsData() {
        if (typeof (props.mapLayer) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (props.dataset !== null) {

                if (props.mapLayer.length > 0) {

                    return props.mapLayer.map((row, index) => {
                        //console.log(row)
                        //console.log(row.id.includes('uploader'))
                        //onChange={(e) => props.setLayerVisible(row.id)}
                        return (
                            <div className="bg-light font-11 border-top border-bottom my-2" key={index}>
                                <Row className="mr-0" key={index}>
                                    <Col xs={2} className="p-0">
                                        <Form.Group controlId="formBasicCheckbox" className="float-right">
                                            <Form.Check type="checkbox" checked={row.visible} onChange={() => props.handleVisible(row.id)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={9} className="pt-1 unselectable px-0">
                                        <b>{row.title}</b>
                                        <br />
                                        <input className="opacity" type="range" min="0" max="1" step="0.01" value={row.opacity} onChange={(e) => props.handleOpacity(row.id, e.target.value)} />
                                    </Col>
                                    <Col xs={1} className="unselectable p-0">

                                        <DropdownButton
                                            key={'left' + index}
                                            variant="light"
                                            drop="left"
                                            size="sm"
                                            title={<ThreeDotsVertical size={16} />}
                                        >
                                            <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => props.deleteDataset(row.id)} ><Trash size={12} /> Delete</Dropdown.Item>
                                            {
                                                //row.id.includes('uploader') 
                                                !row.metadata ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => props.viewMetadata(row.id)} ><CardList size={12} /> View Metadata</Dropdown.Item>
                                            }
                                            {
                                                !row.table ? "" : <Dropdown.Item eventKey={index + "2"} className="font-11 px-3" onClick={() => props.viewTable(row.id)} ><Table size={12} /> View Table</Dropdown.Item>
                                            }
                                            {
                                                row.wms === "" ? "" : <Dropdown.Item eventKey={index + "2"} className="font-11 px-3" onClick={() => props.zoomToMap(row.id)} ><ZoomIn size={12} /> Zoom to Layer</Dropdown.Item>
                                            }
                                            {
                                                row.kml === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={(e) => props.handlingUnduhKML(e, row.kml)} ><Download size={12} /> Download KML</Dropdown.Item>
                                            }
                                            {
                                                row.gml === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => window.open(row.gml)} ><Download size={12} /> Download GML</Dropdown.Item>
                                            }
                                            {
                                                row.original === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => window.open(row.original)} ><Download size={12} /> Download Original</Dropdown.Item>
                                            }
                                            {
                                                row.shp === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => { window.open(row.shp) }} ><Download size={12} /> Download SHP</Dropdown.Item>
                                            }
                                            {
                                                row.pdf === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => window.open(row.pdf)} ><Download size={12} /> Download PDF</Dropdown.Item>
                                            }
                                            {
                                                row.geojson === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => window.open(row.geojson)} ><Download size={12} /> Download Geojson</Dropdown.Item>
                                            }
                                            {
                                                row.csv === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => window.open(row.csv)} ><Download size={12} /> Download CSV</Dropdown.Item>
                                            }
                                            {
                                                row.excel === "" ? "" : <Dropdown.Item eventKey={index + "1"} className="font-11 px-3" onClick={() => window.open(row.excel)} ><Download size={12} /> Download Excel</Dropdown.Item>
                                            }

                                        </DropdownButton>

                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                } else {
                    return (
                        <Row className="mr-0">
                            <Col className="ml-2 mt-1 font-11">
                                No data added
                            </Col>
                        </Row>
                    )
                }
            }
        }
    }
    /*
                              

    */

    return (
        <>

            <Row className="mt-0">
                <Col className="p-0 m-0 ">
                    <div className="bg-fta p-2 font-1rem"><BoundingBoxCircles />  Study Area </div>
                    <Row className="mx-0 border-bottom">
                        <Col className="my-1">
                            <Button size="sm" block variant="secondary" className="py-0 font-11" onClick={() => props.setArea(true)} title="select area of study from given list">Select Area</Button>
                        </Col>
                        <Col className="my-1">
                            <Button size="sm" block variant="secondary" className="py-0 font-11" title="draw area of study as bounding box" onClick={() => props.setDrawBbox(!props.drawBbox)} >{props.drawBbox ? 'Draw Active' : 'Draw BBOX'}</Button>
                        </Col>
                    </Row>
                    <div className="pl-1 font-11 my-1" >
                        <Row className="mx-0 font-11">
                            <Col lg={10} xs={10} className="px-0">
                                Selected Area: <br /><b>{props.areaName}</b>
                            </Col>
                            <Col lg={1} xs={1} className="mt-2 p-0">
                                <button type="button" className="close font-0" onClick={() => props.setShowArea(!props.showArea)} >{props.showArea ? <EyeFill size={14} className="text-dark" /> : <EyeSlashFill size={14} className="text-dark" />} </button>
                            </Col>
                        </Row>
                    </div>
                    <div className="pl-1 font-11 my-1">
                        <Row className="mx-0 font-11">
                            <Col lg={10} xs={10} className="px-0">
                                Selected Bounding Box: <br /><b>{props.bboxLabel}</b>
                            </Col>
                            <Col lg={1} xs={1} className="mt-2 p-0">
                                <button type="button" className="close font-0" onClick={() => props.setShowBbox(!props.showBbox)} >{props.showBbox ? <EyeFill size={14} className="text-dark" /> : <EyeSlashFill size={14} className="text-dark" />} </button>
                            </Col>
                            <Col lg={1} xs={1} className="mt-2 p-0">
                                <button type="button" className="close font-0" onClick={(e) => { e.preventDefault(); props.setPerformZoom(true); }} ><ZoomIn size={14} className="text-dark" /> </button>
                            </Col>
                        </Row>

                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="submenu p-0 m-0">
                    <div className="bg-fta p-2 font-1rem"><Layers /> Data</div>

                    <Row className="mx-0">
                        <Col className="my-1">
                            <Button size="sm" block variant="secondary" className="py-0 font-11" onClick={() => props.setBrowse(true)} title="browse dataset catalogue" >Browse</Button>
                        </Col>
                        <Col className="my-1">
                            <Button size="sm" block variant="secondary" className="py-0 font-11" onClick={() => props.setUpload(true)} title="import your file" >Import</Button>

                        </Col>
                    </Row>
                    <div className="border-top border-bottom" style={{ height: "140px", maxHeight: "140px", overflowY: "auto" }} >
                        {
                            getRowsData()
                        /*
                        <ul className="no-list">
                            <li> <label className="checkbox" for="visible0">
                                    <input id="visible0" className="visible" type="checkbox" />
                                </label>
                                    <span className="layer_title font-11"><b>1964 Land Tenure System in Nyando River</b></span>
                                <fieldset id="layer_0">
                                    <label className="font-11">
                                        <input className="opacity" type="range" min="0" max="1" step="0.01" />
                                    </label>
                                </fieldset>
                            </li>

                            <li> <label className="checkbox" for="visible1">
                                    <input id="visible1" className="visible" type="checkbox" />
                                </label>
                                    <span className="layer_title font-11"><b>1998 2011 Rainfall Map</b></span>
                                <fieldset id="layer_1">
                                    <label className="font-11">
                                        <input className="opacity" type="range" min="0" max="1" step="0.01" />
                                    </label>
                                </fieldset>
                            </li>

                        </ul>
                        */
                        }
                    </div>

                </Col>
            </Row>
            <Row>
                <Col className="p-0 mt-1">
                    <Button block variant="light" className="btn-text-left" onClick={() => props.setBasemap(true)} title="change basemap" ><Map /> Basemap</Button> {' '}
                </Col>
            </Row>
            <Row>
                <Col className="p-0  mt-1">
                    <Button block variant="light" className="btn-text-left" onClick={() => props.setLegend(true)} title="view legend" ><ListTask /> Legend</Button> {' '}
                </Col>
            </Row>
            <Row>
                <Col className="p-0 mt-1">
                    <Button block variant="light" className="btn-text-left" onClick={() => props.setPrinting(true)} title="print map" ><Printer /> Print Map</Button> {' '}
                </Col>
            </Row>
            <Row>
                <Col className="p-0 mt-1">
                    <Button block variant="light" className="btn-text-left" onClick={() => props.setTheme(true)} title="thematic analysis" ><GearWideConnected /> Thematic Analysis</Button> {' '}
                </Col>
            </Row>

        </>
    )
}