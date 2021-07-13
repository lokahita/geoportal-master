import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Config from '../config.json';
import { useState, useEffect } from 'react';

export default function TableAttribute(props) {

    const url_list_harvesting = Config.api_domain + "/harvestings/identifier/";
    const [data, setData] = useState();
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
        if (elmnt.id === "tableAttribute") {
            //console.log('yes')
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


    useEffect(() => {

        if (props.identifierAttribute) {

            const requestOptions = {
                method: 'GET'
            };

            fetch(url_list_harvesting + props.identifierAttribute, requestOptions).then(res => res.json()).then(data => {

                console.log(data.data);
                setData(data.data)
                var json_obj = JSON.parse(data.data.references);
                console.log(json_obj);
                var ogc = json_obj.filter(p => p.scheme === 'OGC:WFS');
                const requestOptions = {
                    method: 'GET'
                };
                if (ogc.length > 0) {
                    console.log(ogc[0].url)
                    //http://sumbarprov.ina-sdi.or.id:8080/geoserver/wfs?SERVICE=WfS&REQUEST=GetFeature&VERSION=2.0.0&typeName=ADMIN:administrasi_ar_250k_130020201203152021&featureID=1&outputFormat=application/json
                    var urlnya = ogc[0].url + "?SERVICE=WfS&REQUEST=GetFeature&VERSION=2.0.0&typeName=" + props.identifierAttribute + "&outputFormat=application/json"
                    console.log(urlnya)
                    fetch(urlnya, requestOptions).then(res => res.json()).then(data => {
                        console.log(data)
                        setData(data.features)

                    });
                }

            })
        }

    }, [props.identifierAttribute]);

    function getRows() {
        if (typeof (data) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (data !== null) {

                if (data.length > 0) {

                    return data.map((row, index) => {
                        console.log(row)
                        return (
                            <Row className="px-3 font-11" key={"att" + index}>
                                <Col xs={1} className="px-1 border-bottom">{index + 1}</Col>
                                <Col xs={4} className="px-1 border-bottom">{row.properties.lcode}</Col>
                                <Col xs={4} className="px-1 border-bottom">{row.properties.namobj}</Col>
                                <Col xs={3} className="px-1 border-bottom"></Col>
                            </Row>
                        )
                        ///cr = cr + 1
                        //return <tr><td className="p-2">{cr}</td><td className="p-2">{row.name}</td><td className="p-2">{row.sj}</td><td className="p-2">{row.kategori}</td><td className="p-2">{row.katalog}</td><td className="p-2 pointer"> <FileEarmarkText size={14} onClick={() => showMetadata(row)} className="mr-2" /> {' '} {row.viewable === 'true' ? <Eye onClick={() => showView(row)} className="mr-2" size={14} /> : ""} {' '} {row.downloadable === 'true' ? <Download size={12}  onClick={() => showDownload(row)} /> : ""}  </td></tr>
                    })
                } else {
                    return (
                        <Row className="px-3">
                            <Col className="px-1 font-11"> No record found</Col>
                        </Row>
                    )
                }
            } else {
                return (
                    <Row className="px-3">
                        <Col className="px-1 font-11"> No record found</Col>
                    </Row>
                )
            }
        } else {
            return (
                <Row className="px-3">
                    <Col className="px-1 font-11"> No record found</Col>
                </Row>
            )
        }
    }


    return (
        <div id="tableAttribute" className={props.showTable ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Table Attribute<button type="button" className="close" onClick={() => props.setShowTable(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3" >
                <Col className="pt-2 px-1 font-11" >
                    Identifier: 
                    {
                        props.identifierAttribute
                    }
                    <div style={{ maxHeight: "200px", overflowY: "auto", overflowX: "hidden" }} className="pointer">
                        {
                            getRows()
                        }
                    </div>
                </Col>
            </Row>
        </div>
    );
}