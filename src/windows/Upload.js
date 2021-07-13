
import { useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import shp from "shpjs";


export default function Upload(props) {

    const [selectedFile, setSelectedFile] = useState();
    //const [selectedStyle, setSelectedStyle] = useState();

    function onFileChange(event) {

        // Update the state
        setSelectedFile(event.target.files[0])
        //console.log(event.target.files[0])
        //console.log(event.target)
        var a = document.getElementsByClassName('custom-file-label');
        //console.log(a);
        if(typeof (event.target.files[0].name) !== 'undefined')
            a[0].innerHTML = event.target.files[0].name
        else
            a[0].innerHTML = 'Upload File'


    }
/*
    function onStyleChange(event) {

        // Update the state
        setSelectedStyle(event.target.files[0])
        //console.log(event.target.files[0])
        //console.log(event.target)
        var a = document.getElementsByClassName('custom-style-label');
        //console.log(a);
        if(typeof (event.target.files[0].name) !== 'undefined')
            a[0].innerHTML = event.target.files[0].name
        else
            a[0].innerHTML = 'Upload File'


    }
*/
    function onFileUpload() {

        if (selectedFile) {
            console.log(selectedFile)
            //console.log(selectedStyle)
            if (selectedFile.name.slice(-3) !== 'zip') {
                alert('please upload zip file!')
            } else {
                var reader = new FileReader();
                reader.onload = function () {
                    if (reader.readyState !== 2 || reader.error) {
                        return;
                    } else {
                        convertToLayer(reader.result, selectedFile.name);
                    }
                }
                reader.readAsArrayBuffer(selectedFile); 

            }           
        }
    }

    function convertToLayer(buffer, name){
        console.log(buffer)
        shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
            //var layer = L.shapefile(geojson).addTo(map);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
            //console.log(layer);
            console.log(geojson)
            props.setBuffer(oldArray => [...oldArray, { id: 'uploader'+name, data: geojson }])
            //props.addBuffer(geojson)
            props.setUpload(false)
            //props.addDataset({ id: 'uploader'+name, title: name, wms: '', kml: '', gml: '', shp: '', csv: '', excel: '' })
                        
        });
        
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
        if (elmnt.id === "upload") {
            
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
        <div id="upload" className={props.upload ? 'show' : 'hide'} >
                <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Upload - Select a file<button type="button" className="close" onClick={() => props.setUpload(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
                <Row className="mx-3 my-2 font-11">
                    <Col xs={3} className="pt-2 px-1" id="attribute-content">
                        Shapefile (.zip)
                    </Col>
                    <Col xs={9} className="pt-1 px-1" id="attribute-content">
                        <Form>
                            <Form.File
                                id="custom-file"
                                label="Upload file"
                                custom
                                onChange={(e)=> onFileChange(e)}
                            />
              
                        </Form>
                    </Col>
                </Row>
                {
                /*
                <Row className="mx-3 my-3">
                    <Col xs={3} className="pt-2 px-1" id="attribute-content">
                        Styling (.sld)
                    </Col>
                    <Col xs={9} className="pt-1 px-1" id="attribute-content">
                        <Form>
                            <Form.File
                                id="custom-style"
                                label="Upload file"
                                custom
                                onChange={(e)=> onStyleChange(e)}
                            />
              
                        </Form>
                    </Col>
                </Row>
                */
                }
                <Row className="mx-3 my-2">
                    <Col xs={3} className="pt-1 px-1" id="attribute-content">
              
                    </Col>
                    <Col  xs={9}  className="pt-1 px-1">
                    <Button size="sm" variant="secondary font-11 py-0" onClick={() => props.setUpload(false)}>Cancel</Button> {' '}
                    <Button size="sm" variant="secondary font-11 py-0" onClick={()=>onFileUpload()}>Submit</Button>
                    </Col>
                </Row>
            </div>
    );
}