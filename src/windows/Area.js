
import { useState, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Config from '../config.json';

//import image_loader from './loading.gif';

export default function Area(props) {
    const url_list_continents = Config.api_domain + "/continents/";
    //const url_get_continent = Config.api_domain + "/continent/id/";
    const url_list_countries = Config.api_domain + "/countries/continent/";
    const url_get_country = Config.api_domain + "/countries/id/";
    const url_list_regions = Config.api_domain + "/regions/country/";
    const url_get_region = Config.api_domain + "/regions/id/";
    const url_search_region = Config.api_domain + "/regions/search/";

    //const loader = <img className="logo d-inline" alt="logo" src={image_loader} width="30px" />

    //const [listSearch, setListSearch] = useState(false);
    const [idCountry, setIdCountry] = useState(0);
    const [idContinent, setIdContinent] = useState(0);
    const [labelCountry, setLabelCountry] = useState('');
    const [labelContinent, setLabelContinent] = useState('');
    const [listCountries, setListCountries] = useState();
    const [listContinents, setListContinents] = useState();
    const [idRegion, setIdRegion] = useState();
    //const [labelRegion, setLabelRegion] = useState('');
    const [listRegions, setListRegions] = useState();
    const [data, setData] = useState();
    const [query, setQuery] = useState('');

    const [areaLabel, setAreaLabel] = useState("Select Continent/Country/Region");

    useEffect(() => {

        let mounted = true;

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        //
        fetch(url_list_continents, requestOptions).then(res => res.json()).then(data => {
            if (mounted) {
                //console.log(data.data);
                var dataset = [{ id: 0, name: "All Continents" }]
                data.data.forEach(element => {
                    dataset.push(element);
                });
                //console.log(dataset)
                setListContinents(dataset);
            }
        });

        return function cleanup() {
            mounted = false;
        }
    }, []);


    function getCountries() {
        if (typeof (listCountries) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listCountries !== null) {
                if (listCountries.length > 0) {
                    return listCountries.map((row, index) => {
                        //console.log(row.id, index)
                        return <option key={index} value={row.id}>{row.name}</option>
                    })
                }
            } else {
                return <option></option>
            }
        } else {
            return <option></option>
        }
    }

    function getContinents() {
        if (typeof (listContinents) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listContinents !== null) {
                if (listContinents.length > 0) {
                    return listContinents.map((row, index) => {
                        //console.log(row.id, index)
                        return <option key={index} value={row.id}>{row.name}</option>
                    })
                }
            } else {
                return <option></option>
            }
        } else {
            return <option></option>
        }
    }

    function getRegions() {
        if (typeof (listRegions) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listRegions !== null) {
                if (listRegions.length > 0) {
                    return listRegions.map((row, index) => {
                        //console.log(row.id, index)
                        return <option key={index} value={row.id}>{row.name}</option>
                    })
                }
            } else {
                return <option></option>
            }
        } else {
            return <option></option>
        }
    }

    function handlingContinents(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdContinent(e.target.value);
        setLabelContinent(e.target.selectedOptions[0].text)
        if (e.target.value === "0") {
            setAreaLabel("Select Continent/Country/Region")
            setListCountries([{ id: 0, name: 'All Countries' }])
            //props.setAreaName("Choose Country/Region")
            //props.setBbox([-180, -90, 180, 90])
            //props.setBboxLabel('[]');
            //props.setBboxGeom([{type:"Point", coordinates:[60,-2]},{type:"Point", coordinates:[[0,0]]},0]);
        } else {
            //alert ('Generate Regions')
            setIdCountry(0);
            setAreaLabel(e.target.selectedOptions[0].text)
            load_countries(e.target.value)
        }
    }

    function handlingCountries(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdCountry(e.target.value);
        setLabelCountry(e.target.selectedOptions[0].text)
        if (e.target.value === "0") {
            setAreaLabel(labelContinent)
            setListRegions([{ id: 0, name: 'All Regions' }])
            //props.setAreaName("Choose Country/Region")
            //props.setBbox([-180, -90, 180, 90])
            //props.setBboxLabel('[]');
            //props.setBboxGeom([{type:"Point", coordinates:[60,-2]},{type:"Point", coordinates:[[0,0]]},0]);
        } else {
            //alert ('Generate Regions')
            setIdRegion(0);
            setAreaLabel(labelContinent + "/" + e.target.selectedOptions[0].text)
            load_regions(e.target.value)
        }
    }

    function handlingRegions(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdRegion(e.target.value);
        //setLabelRegion(e.target.selectedOptions[0].text)
        if (e.target.value === "0") {
            setAreaLabel(labelContinent + "/" + labelCountry )
        } else {
            //alert ('Generate Regions')
            setAreaLabel( labelContinent + "/" + labelCountry + "/" + e.target.selectedOptions[0].text)
        }
    }

    function load_regions(id) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url_list_regions + id, requestOptions).then(res => res.json()).then(data => {
            //console.log(data.data);
            var dataset = [{ id: 0, name: "All Regions" }]
            data.data.forEach(element => {
                dataset.push(element);
            });
            //console.log(dataset)
            setListRegions(dataset);
        });
    }

    function load_countries(id) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
       
        fetch(url_list_countries + id, requestOptions).then(res => res.json()).then(data => {
            //console.log(data.data);
            var dataset = [{ id: 0, name: "All Countries" }]
            data.data.forEach(element => {
                dataset.push(element);
            });
            //console.log(dataset)
            setListCountries(dataset);
        });
    }

    function handlingCancel() {
        props.setArea(false)
        //setIdCountry(0)
        //setIdRegion(0)
        //setAreaLabel("Choose Country/Region")
    }

    function handlingRefine() {
        //alert('oke')
        if (idContinent > 0) {
            if (idCountry > 0) {
                if (idRegion > 0) {
                    const requestOptions = {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    };

                    props.setShowArea(true)
                    fetch(url_get_region + idRegion, requestOptions).then(res => res.json()).then(data => {
                
                        if (data.status === "ok") {
                            //console.log(data.message);
                            props.setAreaName(areaLabel)
                            var bbox = JSON.parse(data.message.bbox);
                            var geom = JSON.parse(data.message.geom);

                            //console.log(bbox.coordinates[0][0][0])
                            var center = JSON.parse(data.message.center);
                            console.log(center.coordinates)
                            props.setBbox([bbox.coordinates[0][0][0], bbox.coordinates[0][0][1], bbox.coordinates[0][2][0], bbox.coordinates[0][2][1]])
                            props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
                            props.setCountry(geom)
                            props.setPerformZoom(true)
                            //props.setBboxGeom([center, geom, 2]);


                        }

                    });
                } else {
                    const requestOptions = {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    };

                    //alert('aaa')
                    props.setShowArea(true)
                    fetch(url_get_country + idCountry, requestOptions).then(res => res.json()).then(data => {
                        if (data.status === "ok") {
                            //console.log(data.message);
                            props.setAreaName(areaLabel)
                            var bbox = JSON.parse(data.message.bbox);
                            var center = JSON.parse(data.message.center);

                            var geom = JSON.parse(data.message.geom);
                            //console.log(bbox.coordinates[0][0][0])
                            props.setBbox([bbox.coordinates[0][0][0], bbox.coordinates[0][0][1], bbox.coordinates[0][2][0], bbox.coordinates[0][2][1]])
                            props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
                            props.setCountry(geom)
                            props.setPerformZoom(true)
                            //props.setBboxGeom([center, geom, 1]);
                        }

                    });

                }
            } else {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };

                //alert('aaa')
                props.setShowArea(true)
                fetch(url_get_country + idContinent, requestOptions).then(res => res.json()).then(data => {
                    if (data.status === "ok") {
                        //console.log(data.message);
                        props.setAreaName(areaLabel)
                        var bbox = JSON.parse(data.message.bbox);
                        var center = JSON.parse(data.message.center);

                        var geom = JSON.parse(data.message.geom);
                        //console.log(bbox.coordinates[0][0][0])

                        props.setBbox([bbox.coordinates[0][0][0], bbox.coordinates[0][0][1], bbox.coordinates[0][2][0], bbox.coordinates[0][2][1]])
                        props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
                        props.setCountry(geom)
                        props.setPerformZoom(true)
                        //props.setBboxGeom([center, geom, 1]);
                    }

                });
            }
        } else {
            props.setAreaName("All Continents")
            props.setBbox([-133044556.24688484, -20037508.342789244, 133044555.79934952, 20037508.342789244])
            props.setBboxLabel('[-133044556.25, -20037508.34, 133044555.80, 20037508.35]');
            props.setCountry()
            props.setPerformZoom(true)
            //props.setBboxGeom([{ type: "Point", coordinates: [60, -2] }, { type: "Polygon", coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]] }, 0]);
        }
    }

    function getRowsData() {
        if (typeof (data) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (data !== null) {

                if (data.length > 0) {
                    return data.map((row, index) => {
                        //console.log(row)
                        return <Row className="mx-0 border-bottom font-11"><Col>{row.id}</Col><Col xs={6}>{row.name}</Col> <Col><Button size="sm" variant="secondary" className="px-1 py-0 font-11" onClick={() => handlingRefineSearch(row)}>Select</Button></Col></Row>
                    })
                } else {
                    return <p className="text-center font-11">no data found</p>
                }
            } else {
                return ""
            }
        } else {
            return ""
        }
    }

    function handlingRefineSearch(row) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        props.setShowArea(true)
        fetch(url_get_region + row.id, requestOptions).then(res => res.json()).then(data => {
            if (data.status === "ok") {
                //console.log(data.message);
                props.setAreaName(row.name)
                var bbox = JSON.parse(data.message.bbox);
                var geom = JSON.parse(data.message.geom);
                //console.log(bbox.coordinates[0][0][0])
                var center = JSON.parse(data.message.center);
                console.log(center.coordinates)
                props.setBbox([bbox.coordinates[0][0][0], bbox.coordinates[0][0][1], bbox.coordinates[0][2][0], bbox.coordinates[0][2][1]])
                props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
                props.setCountry(geom)
                props.setPerformZoom(true)
                //props.setBboxGeom([center, geom, 2]);
                

            }

        });
    }


    function handleSearch(key) {
        //console.log(key);


        if (key.length < 2) {
            setData();
        } else {
            //alert('cari')
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(url_search_region + key, requestOptions).then(res => res.json()).then(data => {
                setData(data.data)
            });
        }
        setQuery(key);
    }

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function handleMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        // get the mouse cursor position at startup:
        //setPos3(e.clientX);
        //setPos4(e.clientY);
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = handleMouseUp;
        // call a function whenever the cursor moves:
        document.onmousemove = handleMouseMove;

        //console.log(e)
    }

    function handleMouseMove(e) {
        //const { isDragging } = this.state;

        /*
        if (!isDragging) {
          return;
        }
    
        //event.persist();
        console.log(event);
        */
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        //var p1 = pos3 - e.clientX;
        //var p2 = pos4 - e.clientY;
        //setPos3(e.clientX);
        //setPos4(e.clientY);
        // set the element's new position:
        //elmnt.style.top = (elmnt.offsetTop - p2) + "px";
        //elmnt.style.left = (elmnt.offsetLeft - p1) + "px";
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        var elmnt = e.target.parentNode;
        //alert('handleMouseMove')
        //console.log(elmnt.id);
        if (elmnt.id === "area") {
            
            if ((elmnt.offsetTop - pos2) > 0)
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

            //if(elmnt.top === "0px")
            //  elmnt.style.top = "10px";

            if ((elmnt.offsetLeft - pos1) > 0)
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    }

    function handleMouseUp() {
        //window.removeEventListener('mousemove', handleMouseMove);
        //window.removeEventListener('mouseup', handleMouseUp);
        document.onmouseup = null;
        document.onmousemove = null;
    }
  
     


    return (
        <div id="area" className={props.area ? 'show' : 'd-none'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Define Study Area<button type="button" className="close" onClick={() => props.setArea(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3 font-11" >
                <Col className="pt-2 px-1" id="area-tabs">
                    <Tabs defaultActiveKey="select" >
                        <Tab eventKey="select" title="Select">
                            <Row className={props.area ? 'show' : 'd-none'}>
                                <Col className="bg-light mx-3 mt-1 text-center font-14" >
                                    {areaLabel}
                                </Col>
                            </Row>
                            <Row className='show px-1 pt-1'>
                                <Col className="">
                                    <Form.Label>Select Continent</Form.Label>
                                    <Form.Control size="sm" as="select" className="font-11" value={idContinent} onChange={e => handlingContinents(e)} >
                                        {
                                            getContinents()
                                        }
                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className={props.area && idContinent > 0 ? 'show px-1 pt-1' : 'd-none'}>
                                <Col className="">
                                    <Form.Label>Select Country</Form.Label>
                                    <Form.Control size="sm" as="select" className="font-11"  value={idCountry} onChange={e => handlingCountries(e)} >
                                        {
                                            getCountries()
                                        }
                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className={props.area && idContinent > 0 && idCountry > 0 ? 'show px-1 pt-1' : 'd-none'}>
                                <Col className="">
                                    <Form.Label>Select Region</Form.Label>
                                    <Form.Control size="sm" as="select" className="font-11"  value={idRegion} onChange={e => handlingRegions(e)} >
                                        {
                                            getRegions()
                                        }
                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className='show px-1 pt-2'>
                                <Col className="">
                                    <Button size="sm" variant="secondary" className="py-0 font-11" block onClick={() => handlingRefine()}>Refine Area</Button>
                                    <Button size="sm" variant="danger" className="py-0 font-11" block onClick={() => handlingCancel()}>Cancel</Button>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="search" title="Search">
                            <Row className={props.area ? 'show' : 'd-none'}>
                                <Col className="px-3 pt-1">
                                    <Form.Control size="sm" className="font-11" type="text" placeholder="Find Area Name" value={query} onChange={e => handleSearch(e.target.value)} />
                                </Col>
                            </Row>
                            <Row className={props.area ? 'show mt-1 mx-1 bg-light' : 'd-none'}>
                                <Col className="border-right">Id</Col>
                                <Col className="border-right" xs={6}>Name</Col>
                                <Col></Col>
                            </Row>

                            <div style={{ maxHeight: "180px", overflowY: "auto", overflowX: "hidden" }} className="pointer">

                                {
                                    getRowsData()
                                }
                            </div>
                        </Tab>
                    </Tabs>

                </Col>
            </Row>
        </div>
    );
}