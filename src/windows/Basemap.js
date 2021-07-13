import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import img_topo from './thumbs/topo.png';
import img_street from './thumbs/street.png';
import img_natgeo from './thumbs/natgeo.png';
import img_ocean from './thumbs/ocean.png';
import img_gray from './thumbs/gray.png';
import img_osm from './thumbs/osm.png';
import img_imagery from './thumbs/imagery.png';
import img_stamen from './thumbs/stamen.png';

export default function Basemap(props) {
    var base = "px-2 py-1 border pointer text-center small";
    var base_left = base + " "
    var active = " border-dark bg-fta font-weight-bold";
    var osm = props.provider === 'osm' ? base_left + active : base_left;
    var gray = props.provider === 'gray' ? base + active : base;
    var ocean = props.provider === 'ocean' ? base_left + active : base_left;
    var natgeo = props.provider === 'natgeo' ? base + active : base;
    var street = props.provider === 'street' ? base_left + active : base_left;
    var topography = props.provider === 'topography' ? base + active : base;
    var imagery = props.provider === 'imagery' ? base + active : base;
    var stamen = props.provider === 'stamen' ? base + active : base;

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
        if (elmnt.id === "basemap") {
            
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
        <div id="basemap" className={props.basemap ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom mb-2 py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Select Basemap<button type="button" className="close" onClick={() => props.setBasemap(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <div style={{maxHeight:"36vh", overflowY:"auto", overflowX:"hidden"}}>
                <Row className="px-3 font-11">
                <Col className={osm} onClick={() => props.setProvider('osm')}>
                    <img alt="osm" src={img_osm} />
                    <br />
                    Open Street Map
                </Col>
                <Col className={gray} onClick={() => props.setProvider('gray')} >
                    <img alt="gray" src={img_gray} />
                    <br />
                    ArcGIS Gray
                </Col>

            </Row>
            <Row className="px-3 font-11">
                <Col className={ocean} onClick={() => props.setProvider('ocean')} >
                    <img alt="ocean" src={img_ocean} />
                    <br />
                    ArcGIS Ocean
                </Col>
                <Col className={natgeo} onClick={() => props.setProvider('natgeo')} >
                    <img alt="natgeo" src={img_natgeo} />
                    <br />
                    ArcGIS National Geographic
                </Col>
            </Row>
            <Row className="px-3 font-11">
                <Col className={street} onClick={() => props.setProvider('street')} >
                    <img alt="street" src={img_street} />
                    <br />
                    ArcGIS Street
                </Col>
                <Col className={topography} onClick={() => props.setProvider('topography')}>
                    <img alt="topography" src={img_topo} />
                    <br />
                    ArcGIS Topography
                </Col>
            </Row>
            <Row className="px-3 font-11">
                <Col className={imagery} onClick={() => props.setProvider('imagery')} >
                    <img alt="imagery" src={img_imagery} />
                    <br />
                    ArcGIS Imagery
                </Col>
                <Col className={stamen} onClick={() => props.setProvider('stamen')} >
                    <img alt="Stamen" src={img_stamen} height="67px" />
                    <br />
                    Stamen
                </Col>
            </Row>
            </div>
        </div>
    );
}