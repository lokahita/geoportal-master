import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Trash, PieChart, Table, Eye, EyeSlash } from 'react-bootstrap-icons';

import Analysis from './Analysis.js';
import TableView from './Table.js';


import { Map, View } from 'ol';
import { Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM as OSMSource, ImageArcGISRest, TileArcGISRest, Stamen as StamenSource, XYZ as XYZSource, ImageWMS as ImageWMSSource, Vector as VectorSource } from 'ol/source/';
import { fromLonLat } from 'ol/proj';
import {
    Attribution,
    Control,
    ScaleLine,
    ZoomSlider,
    Zoom,
    Rotate,
    MousePosition,
    OverviewMap,
    defaults as defaultControls,
    ZoomToExtent
} from 'ol/control'
export default function Theme(props) {
    const center = [-2, 106]
    const zoom = 8
    const urlBasemap = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
    const osmContrib = 'ArcGIS World Topo Map';
    const [title, setTitle] = useState('title');
    const [analysis, setAnalysis] = useState(false);
    const [table, setTable] = useState(false);
    const [layer1, setLayer1] = useState(true);
    const [layer2, setLayer2] = useState(true);
    const [layer3, setLayer3] = useState(true);
    const [layer4, setLayer4] = useState(true);
    const [layer5, setLayer5] = useState(true);
    const [layer6, setLayer6] = useState(true);
    const [layer7, setLayer7] = useState(true);

    const urlCanopyTile = 'https://forests2020.ipb.ac.id/arcgis/rest/services/Ecosystem_CanopyCover/IndonesiaCanopyCover2018/MapServer'
    const urlPaddyTile = 'https://forests2020.ipb.ac.id/arcgis/rest/services/Ecosystem_CommodityDistribution/Paddy_Distribution_2019/MapServer'
    const urlCoffeeDistributionTile = 'https://forests2020.ipb.ac.id/arcgis/rest/services/Ecosystem_CommodityDistribution/Coffe_Distribution_2019/MapServer'
    const urlShake = 'https://gis.bmkg.go.id/arcgis/rest/services/Shakemap/Shakemap_20170424010111/MapServer'
    const urlForest = 'https://forests2020.ipb.ac.id/arcgis/rest/services/Ecosystem_Forest_KLHK/Primary_Swamp_Forest/MapServer'
    const oilPalm = 'https://forests2020.ipb.ac.id/arcgis/rest/services/UNDP/OilPalmAustin/MapServer'
    const alertDevegetation = 'https://forests2020.ipb.ac.id/arcgis/rest/services/Ecosystem_Devegetation/Devegetation_2019/MapServer'
    const tileRef = useRef();
    //<TileLayer ref={tileRef} url={urlBasemap} attribution={attribution} />

    const [map, setMap] = useState(null);
    /*
    const displayMap2 = useMemo(
        () => (
            <div id='map-thematic' />
        ),
        []
    )
            */

    useEffect(() => {
        init_map();
        props.setTheme(false)
        const requestOptions = {
            method: 'GET'
        };

        fetch(urlCanopyTile + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('canopy_legend');
            for (var l in data.layers) {
                //console.log(data.layers[l])
                for (var y in data.layers[l].legend) {
                    //console.log(data.layers[l].legend[y])
                    var img = document.createElement('img');
                    img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                    img.width = data.layers[l].legend[y].width;
                    img.height = data.layers[l].legend[y].height;
                    var div2 = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = data.layers[l].legend[y].label;
                    div2.appendChild(img);
                    div2.appendChild(span);
                    div.append(div2)

                }
            }
        })
        //
        fetch(urlPaddyTile + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('paddy_legend');
            for (var l in data.layers) {
               //console.log(data.layers[l])
                for (var y in data.layers[l].legend) {
                   //console.log(data.layers[l].legend[y])
                    var img = document.createElement('img');
                    img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                    img.width = data.layers[l].legend[y].width;
                    img.height = data.layers[l].legend[y].height;
                    var div2 = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = data.layers[l].legend[y].label;
                    div2.appendChild(img);
                    div2.appendChild(span);
                    div.append(div2)

                }
            }
        })
        fetch(urlCoffeeDistributionTile + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('coffee_legend');
            for (var l in data.layers) {
               //console.log(data.layers[l])
                for (var y in data.layers[l].legend) {
                   //console.log(data.layers[l].legend[y])
                    var img = document.createElement('img');
                    img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                    img.width = data.layers[l].legend[y].width;
                    img.height = data.layers[l].legend[y].height;
                    var div2 = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = data.layers[l].legend[y].label;
                    div2.appendChild(img);
                    div2.appendChild(span);
                    div.append(div2)

                }
            }
        })
        fetch(urlShake + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('bmkg_legend');
            for (var l in data.layers) {
               //console.log(data.layers[l])
                for (var y in data.layers[l].legend) {
                   //console.log(data.layers[l].legend[y])
                    var img = document.createElement('img');
                    img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                    img.width = data.layers[l].legend[y].width;
                    img.height = data.layers[l].legend[y].height;
                    var div2 = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = data.layers[l].legend[y].label;
                    div2.appendChild(img);
                    div2.appendChild(span);
                    div.append(div2)

                }
            }
        })
        fetch(urlForest + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('forest_legend');
            for (var l in data.layers) {
               //console.log(data.layers[l])
                if (l == 0) {
                    for (var y in data.layers[l].legend) {
                       //console.log(data.layers[l].legend[y])
                        var img = document.createElement('img');
                        img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                        img.width = data.layers[l].legend[y].width;
                        img.height = data.layers[l].legend[y].height;
                        var div2 = document.createElement('div');
                        var span = document.createElement('span');
                        span.innerHTML = data.layers[l].legend[y].label;
                        div2.appendChild(img);
                        div2.appendChild(span);
                        div.append(div2)

                    }
                }
            }
        })
        fetch(oilPalm + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('oil_legend');
            for (var l in data.layers) {
               //console.log(data.layers[l])
                for (var y in data.layers[l].legend) {
                   //console.log(data.layers[l].legend[y])
                    var img = document.createElement('img');
                    img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                    img.width = data.layers[l].legend[y].width;
                    img.height = data.layers[l].legend[y].height;
                    var div2 = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = data.layers[l].legend[y].label;
                    div2.appendChild(img);
                    div2.appendChild(span);
                    div.append(div2)

                }
            }
        })
        fetch(alertDevegetation + "/legend?f=json", requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layers)
            //console.log(data.layers[0])
            //console.log(data.layers[0].legend[0])
            //console.log('data:'+data.layers[0].legend[0].contentType+';base64,'+data.layers[0].legend[0].imageData)
            var div = document.getElementById('devegetation_legend');
            for (var l in data.layers) {
               //console.log(data.layers[l])
                if (l == 0) {
                    for (var y in data.layers[l].legend) {
                       //console.log(data.layers[l].legend[y])
                        var img = document.createElement('img');
                        img.src = 'data:' + data.layers[l].legend[y].contentType + ';base64,' + data.layers[l].legend[y].imageData;
                        img.width = data.layers[l].legend[y].width;
                        img.height = data.layers[l].legend[y].height;
                        var div2 = document.createElement('div');
                        var span = document.createElement('span');
                        span.innerHTML = data.layers[l].legend[y].label;
                        div2.appendChild(img);
                        div2.appendChild(span);
                        div.append(div2)

                    }
                }
            }
        })

    }, [])

    var tile = new XYZSource({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: 'Tiles Imagery © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',
        crossOrigin: "Anonymous"
    });

    function init_map() {
        const peta = new Map({
            target: 'map-thematic',
            layers: [
                new TileLayer({
                    source: tile
                }),
            ],
            overlays: [],
            view: new View({
                center: fromLonLat([117, -1]),
                zoom: 5
            }),
            controls: defaultControls().extend([
                new Attribution({ collapsed: false }),
            ]),
        })
        /*
        tile.on('imageloadstart', function () {
            //progress.addLoading();
            alert('processing')
        });

        tile.on('imageloadend', function () {
            alert('loaded')
        });

        tile.on('imageloaderror', function () {
            alert('error')
        });
        */
        var wmsCanopySource = new XYZSource({
            url: urlCanopyTile + "/tile/{z}/{y}/{x}",
            crossOrigin: "Anonymous"
        });

        var canopyLayer = new TileLayer({
            source: wmsCanopySource,
        })

        peta.addLayer(canopyLayer)


        var wmsPaddySource = new XYZSource({
            url: urlPaddyTile + "/tile/{z}/{y}/{x}",
            crossOrigin: "Anonymous"
        });

        var paddyLayer = new TileLayer({
            source: wmsPaddySource,
        })
        peta.addLayer(paddyLayer)


        var wmsCoffeeSource = new XYZSource({
            url: urlCoffeeDistributionTile + "/tile/{z}/{y}/{x}",
            crossOrigin: "Anonymous"
        });

        var coffeeLayer = new TileLayer({
            source: wmsCoffeeSource,
        })
        peta.addLayer(coffeeLayer)

        /*
      var wmsThematic2Source = new TileArcGISRest({
          ratio: 1,
          params: {},
          url: urlThematicTile,
          crossOrigin: 'anonymous'
      })
      */
        var wmsShakeSource = new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: urlShake,
            crossOrigin: 'anonymous'
        })

        var shakeLayer = new ImageLayer({
            source: wmsShakeSource,
        })
        peta.addLayer(shakeLayer)


        /*
        var wmsCoffeeSource = new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: urlCoffee,
            crossOrigin: 'anonymous'
        })

        var coffeeLayer = new ImageLayer({
            source: wmsCoffeeSource,
        })

        peta.addLayer(coffeeLayer)
        */



        var wmsForestSource = new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: urlForest,
            crossOrigin: 'anonymous'
        })

        var forestLayer = new ImageLayer({
            source: wmsForestSource,
        })
        peta.addLayer(forestLayer)


        var wmsOilSource = new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: oilPalm,
            crossOrigin: 'anonymous'
        })

        var oilLayer = new ImageLayer({
            source: wmsOilSource,
        })
        peta.addLayer(oilLayer)

        var wmsDevegetationSource = new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: alertDevegetation,
            crossOrigin: 'anonymous'
        })

        var devegetationLayer = new ImageLayer({
            source: wmsDevegetationSource,
        })
        peta.addLayer(devegetationLayer)
        setMap(peta)
    }

    function openAnalysis(title) {
        setTitle(title)
        setAnalysis(true)
    }

    function openTable(title) {
        setTitle(title)
        setTable(true)
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
        if (elmnt.id === "thematic") {
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

    function showHide(id){
        //console.log(map.getLayers())
        var layers = map.getLayers().getArray()
        if(id == 1){
            setLayer1(!layers[id].getVisible())
        }
        if(id == 2){
            setLayer2(!layers[id].getVisible())
        }
        if(id == 3){
            setLayer3(!layers[id].getVisible())
        }
        if(id == 4){
            setLayer4(!layers[id].getVisible())
        }
        if(id == 5){
            setLayer5(!layers[id].getVisible())
        }
        if(id == 6){
            setLayer6(!layers[id].getVisible())
        }
        layers[id].setVisible(!layers[id].getVisible())
      
    }

    return (
        <div id="thematic" className={props.theme ? 'show' : 'hide'} >
            <Analysis title={title} analysis={analysis} setAnalysis={(e) => setAnalysis(e)} />
            <TableView title={title} table={table} setTable={(e) => setTable(e)} />
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Thematic<button type="button" className="close" onClick={() => props.setTheme(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3">
                <Col className="py-2 pl-3 font-13 font-weight-bold">
                    Forecasting land cover and decision tool
                </Col>
            </Row>

            <Row className="px-3">
                <Col lg={6} className="pt-1 px-1 font-11" style={{ maxHeight: "320px", overflowY: "auto", overflowX: "hidden" }} >
                    <Row className="px-3 ">
                        <Col lg={3} className="p-2 border bg-light">Data Source</Col>
                        <Col lg={3} className="p-2 border bg-light">Data Name</Col>
                        <Col lg={3} className="p-2 border bg-light">Legend</Col>
                        <Col lg={3} className="p-2 border bg-light">Action</Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">IPB</Col>
                        <Col lg={3} className="p-2 border">Canopy Cover</Col>
                        <Col lg={3} className="p-2 border"><div id="canopy_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(1)} size="sm" className="px-1 py-0" >{layer1?<Eye size={12} />: <EyeSlash size={12} />}</Button></Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">IPB</Col>
                        <Col lg={3} className="p-2 border">Paddy Field Distribution 2019</Col>
                        <Col lg={3} className="p-2 border"><div id="paddy_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(2)} size="sm" className="px-1 py-0" >{layer2?<Eye size={12} />: <EyeSlash size={12} />}</Button> <Button variant="outline-secondary" onClick={() => openAnalysis('IPB - Paddy Field')} size="sm" className="px-1 py-0" ><PieChart size={12} /></Button> <Button variant="outline-secondary" onClick={() => openTable('IPB - Paddy Field')} size="sm" className="px-1 py-0"><Table size={12} /></Button></Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">IPB</Col>
                        <Col lg={3} className="p-2 border">Coffee Distribution</Col>
                        <Col lg={3} className="p-2 border"><div id="coffee_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(3)} size="sm" className="px-1 py-0" >{layer3?<Eye size={12} />: <EyeSlash size={12} />}</Button></Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">BMKG</Col>
                        <Col lg={3} className="p-2 border">Shake Analysis</Col>
                        <Col lg={3} className="p-2 border"><div id="bmkg_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(4)} size="sm" className="px-1 py-0" >{layer4?<Eye size={12} />: <EyeSlash size={12} />}</Button></Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">KLHK</Col>
                        <Col lg={3} className="p-2 border">Primary Swamp Forest</Col>
                        <Col lg={3} className="p-2 border"><div id="forest_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(5)} size="sm" className="px-1 py-0" >{layer5?<Eye size={12} />: <EyeSlash size={12} />}</Button></Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">Austin</Col>
                        <Col lg={3} className="p-2 border">Oil Palm Distribution</Col>
                        <Col lg={3} className="p-2 border"><div id="oil_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(6)} size="sm" className="px-1 py-0" >{layer6?<Eye size={12} />: <EyeSlash size={12} />}</Button></Col>
                    </Row>
                    <Row className="px-3">
                        <Col lg={3} className="p-2 border">IPB</Col>
                        <Col lg={3} className="p-2 border">Devegetation Alert</Col>
                        <Col lg={3} className="p-2 border"><div id="devegetation_legend"></div></Col>
                        <Col lg={3} className="p-2 border"><Button variant="outline-secondary" onClick={() => showHide(7)} size="sm" className="px-1 py-0" >{layer7?<Eye size={12} />: <EyeSlash size={12} />}</Button></Col>    
                    </Row>
                </Col>
                <Col lg={6} className="pt-1 px-1" >
                    <div id='map-thematic' />
                </Col>
            </Row>
        </div>
    );
}