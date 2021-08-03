import 'ol/ol.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { useState, useEffect } from 'react'
import Zoom from 'react-reveal/Zoom'
import Slide from 'react-reveal/Slide'
import Fade from 'react-reveal/Fade'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TopMenu from './TopMenu'
import Mapviewer from './Mapviewer'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Copyright from './windows/Copyright'
import Area from './windows/Area'
import Basemap from './windows/Basemap'
import Browse from './windows/Browse'
import Upload from './windows/Upload.js';
import Legend from './windows/Legend.js';
import Theme from './windows/Theme.js';
import TableAttribute from './windows/TableAttribute.js';
import Metadata from './windows/MetadataFrontend.js';
import Config from './config.json';

function App() {

  const url_list_harvesting = Config.api_domain + "/harvestings/bbox/";
  // var url = 'http://localhost:8004/geoportal/api/harvestings/bbox/-133044556.246885/-20037508.342789/133044555.799350/20037508.342789'
  const [copyright, setCopyright] = useState(false);
  const [area, setArea] = useState(false);
  const [drawBbox, setDrawBbox] = useState(false);
  const [basemap, setBasemap] = useState(false);
  const [provider, setProvider] = useState('imagery');
  const [legend, setLegend] = useState(false);
  const [upload, setUpload] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [mapLayer, setMapLayer] = useState([]);
  const [browse, setBrowse] = useState(false);
  const [bbox, setBbox] = useState([-133044556.24688484, -20037508.342789244, 133044555.79934952, 20037508.342789244]);
  const [bboxLabel, setBboxLabel] = useState('[' + bbox[0].toFixed(2) + ', ' + bbox[1].toFixed(2) + ', ' + bbox[2].toFixed(2) + ', ' + bbox[3].toFixed(2) + ']');
  const [areaName, setAreaName] = useState('All Continents');
  const [resolution, setResolution] = useState();
  const [country, setCountry] = useState();
  const [theme, setTheme] = useState(true);
  const [buffer, setBuffer] = useState([]);
  const [zoomTo, setZoomTo] = useState();
  const [showBbox, setShowBbox] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [performZoom, setPerformZoom] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [identifierMetadata, setIdentifierMetadata] = useState("");
  const [identifierAttribute, setIdentifierAttribute] = useState("");
  const [identifierDelete, setIdentifierDelete] = useState("");
  const [identifierVisible, setIdentifierVisible] = useState("");
  const [dataAll, setDataAll] = useState();

  /*
  const response = await fetch(url);
  const total = Number(response.headers.get('content-length'));

  const reader = response.body.getReader();
  let bytesReceived = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) {
      console.log('Fetch complete');
      break;
    }
    bytesReceived += result.value.length;
    console.log('Received', bytesReceived, 'bytes of data so far');
  }
  */

  /*
  async function f() {
    return Promise.resolve(1);
  }

  f().then(alert)
 
  async function f() {
    /*
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 1000)
    });
  /
   
    const response = await fetch(url)
  
    let result = await response; // wait until the promise resolves (*)
  
    //alert(result); // "done!"
    console.log(result);
  }
  
  f();
  */
  useEffect(() => {

    async function loadDataset() {
      /*
          const requestOptions = {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token 
                    }
                };

      */
      const response = await fetch(url_list_harvesting + bbox[0].toFixed(6) + "/" + bbox[1].toFixed(6) + "/" + bbox[2].toFixed(6) + "/" + bbox[3].toFixed(6))

      var json = await response.json();

      if (response.status === 200) {
        //console.log(json.data)
        setDataAll(json.data);//.sort((a, b) => (a.title > b.title) ? 1 : -1));

        const ele = document.getElementById('ipl-progress-indicator')
        if (ele) {
          // fade out
          ele.classList.add('available')
          setTimeout(() => {
            // remove from DOM
            ele.outerHTML = ''
          }, 1000)
        }
      } else {
        console.log(response.status)
      }
    }

    loadDataset();

  }, [url_list_harvesting]);

  function viewTable(id) {
    setShowTable(true)
    setIdentifierAttribute(id)
    //alert(id)
  }

  function viewMetadata(id) {
    setShowMetadata(true)
    setIdentifierMetadata(id)
    //alert(id)
  }

  function zoomToMap(id) {
    //setShowMetadata(true)
    //setIdentifierMetadata(id)
    //alert(id);
    setZoomTo(id);
  }


  function handlingUnduhKML(e, url) {
    window.open(url)
    //window.location.href = url;
    return
  }

  function deleteDataset(id) {
    //setDataset(oldArray => [...oldArray, newElement]);
    //console.log(dataset);

    const layers = mapLayer.slice();
    console.log(id);

    //console.log(map)
    //map.eachLayer(function(layer){
    //if(layer.options.id === id)
    //map.removeLayer(layer)
    //});
    //var index = mapLayer.findIndex(x => x.id === id);
    //setDataset(mapLayer.slice(index, 1));
    //console.log(typeof(id))
    //console.log(typeof(dataset.slice()[0].id))
    //console.log(dataset.filter(item => item.id !== id))
    setMapLayer(mapLayer.filter(item => item.id !== id));
    setIdentifierDelete(id)

  }

  function handleVisible(id) {
    //setIdentifierVisible(id);
    const data = mapLayer.slice();
    //console.log(data[0]);
    var index = mapLayer.findIndex(x => x.id === id);
    //console.log(index);
    data[index].visible = !data[index].visible
    setMapLayer(data);
  }

  function handleOpacity(id, val) {
    //setIdentifierVisible(id);
    const data = mapLayer.slice();
    //console.log(data[0]);
    var index = mapLayer.findIndex(x => x.id === id);
    //console.log(index);
    data[index].opacity = val
    setMapLayer(data);
  }



  // setPerformZoom={(e) => setPerformZoom(e)} setCountry={(e) => setCountry(e)} setWaiter={(e) => setWaiter(e)}
  // setBbox={(e) => setBbox(e)} setBboxLabel={(e) => setBboxLabel(e)} setAreaName={(e) => setAreaName(e)} setShowArea={(e) => setShowArea(e)}

  // <Legend legend={legend} resolution={resolution} mapLayer={mapLayer} setLegend={(e) => setLegend(e)} />
  // <Browse viewMetadata={(e) => viewMetadata(e)} setWaiter={(e) => setWaiter(e)} bbox={bbox} browse={browse} setBrowse={(e) => setBrowse(e)} setArea={(e) => setArea(e)} areaName={areaName} setMapLayer={(e) => setMapLayer(e)} zoomToMap={(e) => zoomToMap(e)} />
  // <Upload upload={upload} setUpload={(e) => setUpload(e)} setBuffer={(e) => setBuffer(e)} />
  /*

  <Browse 
      viewMetadata={(e) => viewMetadata(e)} 
      zoomToMap={(e) => zoomToMap(e)} />
      */

  return (

    <Container fluid className="bg-white">
      <Copyright copyright={copyright} setCopyright={(e) => setCopyright(e)} />
      <Area setPerformZoom={(e) => setPerformZoom(e)} setCountry={(e) => setCountry(e)} area={area} setArea={(e) => setArea(e)} setBbox={(e) => setBbox(e)} setBboxLabel={(e) => setBboxLabel(e)} setAreaName={(e) => setAreaName(e)} setShowArea={(e) => setShowArea(e)} />
      <Basemap basemap={basemap} setBasemap={(e) => setBasemap(e)} provider={provider} setProvider={(e) => setProvider(e)} />
      <Browse
        areaName={areaName} bbox={bbox}
        browse={browse} dataAll={dataAll}
        setBrowse={(e) => setBrowse(e)}
        setArea={(e) => setArea(e)}
        setMapLayer={(e) => setMapLayer(e)}
        viewMetadata={(e) => viewMetadata(e)}
        zoomToMap={(e) => zoomToMap(e)}
      />
      <Upload upload={upload} setUpload={(e) => setUpload(e)} setBuffer={(e) => setBuffer(e)} />
      <Legend legend={legend} resolution={resolution} mapLayer={mapLayer} setLegend={(e) => setLegend(e)} />
      <Theme theme={theme} setTheme={(e) => setTheme(e)} />
      <TableAttribute identifierAttribute={identifierAttribute} showTable={showTable} setShowTable={(e) => setShowTable(e)} />
      <Metadata identifierMetadata={identifierMetadata} showMetadata={showMetadata} setShowMetadata={(e) => setShowMetadata(e)} />

      <Fade top delay={1500} duration={2000}>
        <TopMenu />
      </Fade>
      <Row className="main">
        <Col lg={10} className="p-0" style={{ overFlowX: "hidden" }}>
          <Zoom duration={3000}>
            <Mapviewer
              provider={provider}
              printing={printing}
              setPrinting={(e) => setPrinting(e)}
              buffer={buffer}
              bbox={bbox} setBbox={(e) => setBbox(e)}
              setBuffer={(e) => setBuffer(e)}
              mapLayer={mapLayer} setMapLayer={(e) => setMapLayer(e)}
              zoomTo={zoomTo} setZoomTo={(e) => setZoomTo(e)}
              setShowBbox={(e) => setShowBbox(e)}
              showArea={showArea} setShowArea={(e) => setShowArea(e)}
              showBbox={showBbox}
              country={country}
              performZoom={performZoom}
              setPerformZoom={(e) => setPerformZoom(e)}
              drawBbox={drawBbox} setDrawBbox={(e) => setDrawBbox(e)}
              setBboxLabel={(e) => setBboxLabel(e)} setAreaName={(e) => setAreaName(e)}
              setResolution={(e) => setResolution(e)}
              identifierDelete={identifierDelete}
              identifierVisible={identifierVisible}
              setIdentifierDelete={(e) => setIdentifierDelete(e)}
              setIdentifierVisible={(e) => setIdentifierVisible(e)}

            />
          </Zoom>
        </Col>
        <Col lg={2}>
          <Fade right delay={2000}>
            <Sidebar
              areaName={areaName} bboxLabel={bboxLabel} mapLayer={mapLayer}
              setArea={(e) => setArea(e)}
              setBasemap={(e) => setBasemap(e)}
              setLegend={(e) => setLegend(e)}
              setPrinting={(e) => setPrinting(e)}
              setBrowse={(e) => setBrowse(e)}
              setUpload={(e) => setUpload(e)}
              setTheme={(e) => setTheme(e)}
              handlingUnduhKML={(e, b) => handlingUnduhKML(e, b)}
              viewTable={(e) => viewTable(e)}
              viewMetadata={(e) => viewMetadata(e)}
              zoomToMap={(e) => zoomToMap(e)}
              deleteDataset={(e) => deleteDataset(e)}
              handleVisible={(e) => handleVisible(e)}
              handleOpacity={(e,b) => handleOpacity(e, b)}
              showBbox={showBbox} setShowBbox={(e) => setShowBbox(e)}
              showArea={showArea} setShowArea={(e) => setShowArea(e)}
              country={country}
              performZoom={performZoom} setPerformZoom={(e) => setPerformZoom(e)}
              drawBbox={drawBbox} setDrawBbox={(e) => setDrawBbox(e)}

            />
          </Fade>
        </Col>
      </Row>
      <Fade delay={3500}>
        <Footer setCopyright={(e) => setCopyright(e)} />
      </Fade>
    </Container>
  );
}

export default App;
