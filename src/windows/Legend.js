import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ImageWMS as ImageWMSSource } from 'ol/source/';


import Config from '../config.json';

export default function Legend(props) {
    //https://geonode.cifor.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer="+layer_geonode
    //http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=topp:states
    /*
    function getMeta(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () { callback(this.width, this.height); }
    }
    */

    function getRowsLayer() {
        if (typeof (props.mapLayer) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (props.mapLayer !== null) {

                if (props.mapLayer.length > 0) {

                    return props.mapLayer.map((row, index) => {
                        //console.log(row)
                        //console.log(row.layer)
                        var main
                        if (row.url.includes("demak")) {
                            main = row.url
                        } else {
                            main = Config.proxy_domain + row.url
                        }

                        var wmsSource = new ImageWMSSource({
                            url: main,
                            params: { 'LAYERS': row.layer },
                            ratio: 1,
                            serverType: row.server,
                            crossOrigin: 'anonymous'
                        });

                        //var resolution = peta.getView().getResolution();
                        //console.log(resolution)
                        var graphicUrl = wmsSource.getLegendUrl(props.resolution);
                        //console.log(graphicUrl)


                        if (row.layer) {
                            //<img src={main + "?" + request} alt="alt" />
                            return <Row className="mr-0" key={index}>
                                <Col xs={10} className="ml-2 mt-1 font-11"><b>{row.title}</b>
                                    <br />
                                    <img crossOrigin="anonymous" referrerPolicy="origin" src={graphicUrl} alt={row.title} />
                                </Col>
                            </Row>
                        } else {
                            if (row.tipe === 'zip') {
                                return <Row className="mr-0" key={index}>
                                    <Col xs={10} className="ml-2 mt-1 font-11"><b>{row.title}</b> <br />
                                        <div className="border bg-light border-primary" style={{ width: "20px", height: "20px" }}>

                                        </div>
                                    </Col>
                                </Row>
                            } else {
                                return null
                            }
                        }
                    })
                } else {
                    return <p className="pl-2 font-11">no legend</p>
                }
            } else {
                return <p className="pl-2 font-11">no legend</p>
            }
        } else {
            return <p className="pl-2 font-11">no legend</p>
        }
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
        if (elmnt.id === "legenda") {
            console.log('yes')
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
        <div id="legenda" className={props.legend ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Legend<button type="button" className="close" onClick={() => props.setLegend(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3" >
                <Col className="pt-2 px-1" id="legenda-content">
                    {
                        getRowsLayer()
                    }
                </Col>
            </Row>
        </div>
    );
}