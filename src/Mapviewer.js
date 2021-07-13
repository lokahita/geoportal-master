import Button from 'react-bootstrap/Button';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Map from 'ol/Map';
import View from 'ol/View';

import Overlay from 'ol/Overlay';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import { useState, useEffect } from 'react';

import Config from './config.json';
import { OSM as OSMSource, Stamen as StamenSource, XYZ as XYZSource, ImageWMS as ImageWMSSource, Vector as VectorSource } from 'ol/source/';
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
} from 'ol/control';

import { Image as ImageLayer, Group as LayerGroup, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

import { GeoJSON, XYZ } from 'ol/format';
import {
    Style,
    Fill as FillStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle,
    Circle as CircleStyle
} from 'ol/style';

import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import Draw, {
    createBox,
    createRegularPolygon,
} from 'ol/interaction/Draw';
import DragBox from 'ol/interaction/DragBox';

import { LineString, Polygon, MultiPolygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import NewPDFPages from './NewPDFPages';

import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import domtoimage from 'dom-to-image';
//import html2canvas from 'html2canvas';

export default function Mapviewer(props) {
    const gcolor1 = '#82D7F3';
    const gcolor2 = '#0D2DC3';
    const i_basemap = 0;
    const i_graticule = 1;
    const i_highlight = 2;
    const i_measurement = 3;
    const i_magic = 4;
    const i_bbox = 5;
    const i_country = 6;
    const i_group = 7;
    var idx = -1;

    var measuring = false;
    var identifying = false;
    var drawing = false;

    const [peta, setPeta] = useState(null);

    const [identify, setIdentify] = useState(false);
    const [alertIdentify, setAlertIdentify] = useState(false);
    const [measurement, setMeasurement] = useState(false);
    const [drawingO, setDrawingO] = useState(false);
    const [pointColor, setPointColor] = useState("#FF0000");
    const [strokeColor, setStrokeColor] = useState('#EEFF00');
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [fillColor, setFillColor] = useState('#FFFFFF');
    const [fillColorAlpha, setFillColorAlpha] = useState(1.0);

    const [title, setTitle] = useState('map title');
    const [description, setDescription] = useState('map description');
    const [legend, setLegend] = useState(false);
    const [size, setSize] = useState('A4');
    const [orientation, setOrientation] = useState('landscape');//landscape
    const [height, setHeight] = useState('500');
    const [clegend, setCLegend] = useState("data:image/png;base64,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");
    const [capture, setCapture] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAADwCAMAAAB4+uBSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAADZQTFRF////x8fHxMTEzs7O0tLS2tra5+fn8fHxycnJ5ubm9/f3/Pz819fX4+Pj7e3t7OzszMzMvb29Tvoc/QAADfJJREFUeJztnYl2ozgUREGAwQIM/f8/O3paWGxwYlyva86M7jndccIS+1YkhBCoKDKZTCaTyWQymcx/kvK/DlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A7VYQtGwHaoDlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A7VYQtGwHaoDlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A7VYQtGwHaoDlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A7VYQtGwHaoDlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A7VYQtGwHaoDlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A7VYQtGwHaoDlswArZDddiCEbAdqsMWjIDtUB22YARsh+qwBSNgO1SHLRgB26E6bMEI2A5LY4zq/tmCEagKeo+Lx1R1c2s7zd/CFoxA0885Lp6ubu6t7eU91Jq/ii0YgaafI3zxGcZHiCfQaFZ4PLU4FPU8YULxmezLe7jnkN6jqGfFFx9Xu/XH76HNIb1HUY8gTbdZarfDX26npnVf+hzSe9TkSOXW1eNkj4pPb9uxqaSAjfLdrPYuckhnuOIzS9P6sPj07a2p5+XsaJCfaTbv/q5OHcBKXPF5brst9HYah+rp7HWWJZrNu7/sUwWsEdOc1m5D1R11LhhZfsshvQVrxB9idlhfu5WnfT9G6kTN5h3BKRywknqza6ndusPis8HcZE3FjiGWWCRgJZ3faS+1W3lefDaE5l0FfhsbuHoxoJ1I7XX7pGfblz3F5h3ZLwSwEiMnp/Zji4rNO7JfCGAl/hDTx9eT/Q3yLvr1W3RHHtkvBKwR1waXnYYeBF+qPmbKIb2ANRIPMYN/mUNCgTVSlrOczI5edA4JBdZIGZp3jzWkfvoACTiH9ArWiEvm4XZq15Cs+QDZIIf0CtZI6hjahhSu+f2M2yKHdAzWSLm99pBCah6/wp0r5ZCOwRpxVLJXf3KaqruXTtdj7jmkM7BGHJ0c/W8XQhpzSGdgjZTbaw9PId3qujkZieLJIZ2CNVJKZ1ARh5bsQ5Ia0MxvUsohnYI1UqbmnVwg2oUUruuFXqNjckinYI0IS/NuF9JofnKWQzoFa0SoUsfQUUjd069v6mVIUQ7pFKwRj2ifnkOyh9WdC8bY9XUO6RisEWHtaNg1HO7Sq1Dvf3kYJRRTyiGdgjUi+Ot+xUtIhW2a2/53xzxiky+HdArWiBCqtOrnk9k2bRDKVw7pFKwRT7ru90NI6ziuEGsO6RSsEU+67vc+pH4z1s6vkkM6BWvEY+J1v7ch9bvxkHIcyyGdgjXiSc27tyFV5nmbHNIpWCOeMCi1extS/RyF6fOlilOwRjyhHVC/C2l4TaLLJekUrJGAb9415iWkKfWBHw5YNfny+RlYIxsxt+eQbG26h381nuWQQzoGayQQr/vtQxr9ksG+u2Ush3QM1kggXPfbHZNsbCmY8v44TyGHdAzWSCDec7QJadwsfLNhDukYrJGIv+43pJDu9qXBfUIO6RiskYi/pXxMJ7XVr2+2zCEdgzUS8beUT3/ShaVfk0M6BmskYtbHbOSQAGCNRMx6dS+HBABrJLIZyvBJSPmuihOwRhLrWAZb1b8nDWFBwlOLA2tko8a2t+Pnp/1ADukVrJGFWp4klG/HBIE1siOHhAJrZEcOCQXWyJ75CuhnQbEFIwAr+ffBFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHW7QmQqBLRiBiphL1DeVCXrYghF8/qlNs94FNp/ftffxbvHDGzxswQg+/9SmWe95nXHztZixH0C72sEWjODzTy1jiNPd48CQfjUl1gXYghF8/qklpD7eFpZCMl09DPPOcl0bMw9D3Zn07ey+kXUr91OfSDekGciqoSvnoXva1ZDmvopfzXBhMiy2YASff2oX0pjm700h3f3N/4/tkb+3pb/XvPftAWOtDOLvwq3N8lw1/0T9OB2WafvO7VYic7WeLG8rU5pHnIhpLsKO6yvllmYWyKWQhjo+YyuGZIupnqvbbuplmb7qXs/15Fc1ti/ucy0b22aeG+tnpa/jJD61a3/EkB5+Vy4pV1ar+BD4e2iemOlKW5QtGMG1kNw//3hiH5Jpo8xqe6OLlVub5aeDrGpseDJA5ZpwfvaKuxzXjG2j/bn0IZkxHO5MZ6XUxcXxBpru0ny0bMEIroUkNqXB7EOqk7xtu8+FFFsXIl5C8pVZ28fpQ/5YeURUKD2V7MC/nv2kjUIVClcdq9fa7+fKHOlswQguhiQ387k6SEJyhSIdi8xmWl+7TL84S+mxfSgM9hYJqfUuareDyu+2cv8ecfHdl57+FoqbfzJbf2nOYLZgBFdDkomSGuNDehRJnhSUJaT1oRq2LWNIddGvhNLRueRkVR/SuFlu5WjUd3Lgcn8Rs6s2L51HsQUjuByS1GB1JyFNa0h2E9L6d++KgLE2HJKa3YRJLqC7GcOj3kNI3W65rD/10oQYt38AOaTfhiTzuwwifSzS6c6uulueDSnHrBhSua4QZ9C8Fab3i3xIw3pQ8/s0bduFJ4Xaqz1QbMEIPv/US0ju77sXqXMy75sICZukuuqwKmNIrtSlR0bGnrq5eMS2oTQcut7ufolL7SbNBWlNFtf6X9mCEXz+qdeQ5FnR0gQfY5us2RQkeSS7r9rKm5wSpZLUSWeFY7ZxKm3Xfrdpt5X89/Czyw3pYcc2zOLomuQXu1/ZghF8E5L8oftJKdxp7L0Z7TYjd0xy561jc++LqSyXkCTXRzO2a/dfnSY89c1xaTr4XdlYHY5x6rn71fnR2YIRXAqpWV6PoS+g9k+o2XXauFRq6Rdqw9lpDMmdpkoXUj/Na2Nj2a0/k/Ib2eWxXlVcXH82ofoK2S+EK597k0Xqul7bawl/srr+cF34vOqS1vGuzNPXT2ELRnDxo/+M/eiBNXqwBSNQk5NDwqEmp88hwVCTU19sjaFhC0bAdqgOWzACtkN12IIRsB2qwxaMgO1QHbZgBGyH6rAFI/irwqQ/rju4Bt49PfYJ+RQotmAEOBs/IuMi4rXypwXN/qLrtREnJ7AFI4DJ+BlzK9pyc4lwXdDsu7g7P94LBFswApiMX9DVXQ7pChARsd86/Ys/e1km/60hrQvi0K2l83sJ6aVr/QJswQi+VOBVDo++t/e5kwFY7XIpvffDS7qb7ftpMFNflnU/LCHFjboujq8zQ1v0bbOMTpFVKr/tb2cjOYEtGMF3+Xjdj6Kfbm1RNDK+bqm5/Cg5Gdzf3qa+uMkQ4bpolpDauNEgk6K7jVoZkRcvyIaQZNuH2+7LVgRbMILvM5LJR6VWaoPOMN7Oj0Uu/VAFWTjKpFebkNJGnS1CSH0Y+tD4+Wd9SO71VIZtv0qJLRjB1xk1y6ig1o8WDiXF+AGsXRocLvY3Ibn/0kY2hhQup7tUJxNC6or2T1jloKnxAWzBCL74+NFyn17WfkBPF++XaEwsTmG1fhfSMojSxOoujalzSYddyLbx+cbVV0WJLRjB9U8fmPt1OLEPyZ0NyTzAEt12bOvumDRvxmfFY1JaT176kKbNm/zm+iHNLJDrnz4w94tvE9TLkOAqHPo3o8Tv25Cq9UTIhJCWCm1wDb0YUj0kvrl+yBaM4IuP7+nWex1i+TCP3t9wFAtVwFdjS0i7jULVltbzi+Vn96J7GWh0BbZgBN98fm9wSlXV0gyrfWM8vEolpts3HB7pViP3rQ9pqTNl/Io/rNXLcap6XLkvKcEWjOCLjx8VSiu7DGNTQ0gyWVyovlz5CUMj3Y92TXC5JzBt5ENKw1gnaXCEJrgNw8ZNaS+OAg+wBSP4LqEytK6d+2os+lh+wg2Yns6dxrrGddMXdn+e5DYa3Eb3IjbB2+JRGbnp+bY0EDuXXGc6t+3BdPY5pA9TqsO884+lzWb69UgfZjvvq0c6Jt3jaOKw0SSXJaRJFydIbzY3x3Zh1phfz1J7zN9Xiuebz58w9Tg2s+nGdPjftMbM3IxN7QrJ6BoJo8unHrt1I1dSRrdyNbriNoxjHe8sG+vttt+9ObZgBN8ZSITO6mOdsSN7WWEzKLzc/WwzXPxp229gC0bwrYN/PWzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBCNgO1WELRsB2qA5bMAK2Q3XYghGwHarDFoyA7VAdtmAEbIfqsAUjYDtUhy0YAduhOmzBmUwmk8lkMplMJvP/4R/C5v1kw6V38AAAAABJRU5ErkJggg==");


    var draw; // global so we can remove it later
    var sketch;
    var helpTooltip;
    var helpTooltipElement;
    var measureTooltip;
    var measureTooltipElement;
    var continuePolygonMsg = 'Click to continue drawing the polygon, Double click to finish';
    var continueLineMsg = 'Click to continue drawing the line, Double click to finish';

    const url_list_harvesting_bbox = Config.api_domain + "/harvestings/bbox_identifier/";






    useEffect(() => {

        init_map();
    }, [])

    function init_map() {
        const graticule = new Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new Stroke({
                color: gcolor1, //'rgba(255,120,0,0.9)',
                width: 1,
                lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: false,
        })

        var overviewMapControl = new OverviewMap({
            // see in overviewmap-custom.html to see the custom CSS used
            className: 'ol-overviewmap ol-custom-overviewmap',
            layers: [
                new TileLayer({
                    source: new XYZSource({
                        url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                        attributions: 'Tiles Imagery © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',
                        crossOrigin: "Anonymous"
                    })
                })
            ],
            collapseLabel: '\u00BB',
            label: '\u00AB',
            collapsed: true,
        });
        var scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 125 });

        const el = document.createElement('div');
        el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>' +
            '<path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>' +
            '</svg>';
        var zoomToExtentControl = new ZoomToExtent({
            'tipLabel': 'Zoom to initial extent',
            'label': el
        })


        const locate = document.createElement('div');
        locate.className = 'ol-control ol-unselectable graticule';
        locate.innerHTML = '<button title="Show/Hide Graticule"><i class="fa fa-th"></i></button>';
        locate.addEventListener('click', function () {
            graticule.setVisible(!graticule.getVisible())
        });

        const gratiControl = new Control({ element: locate });

        const measure = document.createElement('div');
        measure.className = 'ol-control ol-unselectable measure';
        measure.innerHTML = '<button title="Measurement"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rulers" viewBox="0 0 16 16">' +
            '<path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1H1z"/>' +
            '</svg></button>';
        measure.addEventListener('click', function () {
            var cek = document.getElementById("measurement");
            cek.classList.contains('show') ? setMeasurement(false) : setMeasurement(true);
        });

        const measureControl = new Control({
            element: measure
        });

        const identify = document.createElement('div');
        identify.className = 'ol-control ol-unselectable identify';
        identify.innerHTML = '<button title="Identify"><i class="fa fa-info-circle"></i></button>';
        identify.addEventListener('click', function () {
            var cek = document.getElementById("identifying");
            cek.classList.contains('show') ? setIdentify(false) : setIdentify(true);
            //setIdentify(true);
        });

        const identifyControl = new Control({
            element: identify
        });

        const drawingDiv = document.createElement('div');
        drawingDiv.className = 'ol-control ol-unselectable drawing';
        drawingDiv.innerHTML = '<button title="Draw"><i class="fa fa-pencil"></i></button>';
        drawingDiv.addEventListener('click', function () {
            var cek = document.getElementById("drawing");
            cek.classList.contains('show') ? setDrawingO(false) : setDrawingO(true);
            //setDrawingO(true)
            //addInteraction2()
        });

        const drawingControl = new Control({
            element: drawingDiv
        });
        var sourceHighlight = new VectorSource({
            //features: new GeoJSON().readFeatures(geojsonObject),
            wrapX: false
        });


        var image = new CircleStyle({
            radius: 5,
            fill: null,
            stroke: new Stroke({ color: 'red', width: 1 }),
        });


        var styles = {
            'Point': new Style({
                image: image,
            }),
            'LineString': new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiLineString': new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiPoint': new Style({
                image: image,
            }),
            'MultiPolygon': new Style({
                stroke: new Stroke({
                    color: 'yellow',
                    width: 1,
                }),
                fill: new FillStyle({
                    color: 'rgba(255, 255, 0, 0.1)',
                }),
            }),
            'Polygon': new Style({
                stroke: new Stroke({
                    color: 'blue',
                    lineDash: [4],
                    width: 3,
                }),
                fill: new FillStyle({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
            }),
            'GeometryCollection': new Style({
                stroke: new Stroke({
                    color: 'magenta',
                    width: 2,
                }),
                fill: new FillStyle({
                    color: 'magenta',
                }),
                image: new CircleStyle({
                    radius: 10,
                    fill: null,
                    stroke: new Stroke({
                        color: 'magenta',
                    }),
                }),
            }),
            'Circle': new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2,
                }),
                fill: new FillStyle({
                    color: 'rgba(255,0,0,0.2)',
                }),
            }),
        };

        var styleFunction = function (feature) {
            //console.log(feature)
            return styles[feature.getGeometry().getType()];
        };

        //var vectorSource = new VectorSource({
        //    features: new GeoJSON().readFeatures(geojsonObject),
        //});

        //sourceHighlight.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

        var vectorHighlight = new VectorLayer({
            source: sourceHighlight,
            style: styleFunction,
            zIndex: 899
        });

        var sourceMeasurement = new VectorSource();

        var vectorMeasurement = new VectorLayer({
            source: sourceMeasurement,
            zIndex: 901,
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new StrokeStyle({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new FillStyle({
                        color: '#ffcc33',
                    }),
                }),
            }),
        });

        var sourceMagic = new VectorSource();

        var vectorMagic = new VectorLayer({
            source: sourceMagic,
            zIndex: 901,
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0)',
                }),
                stroke: new StrokeStyle({
                    color: 'rgba(255, 255, 255, 0)',
                    width: 0.5,
                })
            }),
        });

        var bboxFirst = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    props.bbox[0].toFixed(2),
                                    props.bbox[1].toFixed(2)
                                ],
                                [
                                    props.bbox[2].toFixed(2),
                                    props.bbox[1].toFixed(2)
                                ],
                                [
                                    props.bbox[2].toFixed(2),
                                    props.bbox[3].toFixed(2)
                                ],
                                [
                                    props.bbox[0].toFixed(2),
                                    props.bbox[3].toFixed(2)
                                ],
                                [
                                    props.bbox[0].toFixed(2),
                                    props.bbox[1].toFixed(2)
                                ]
                            ]
                        ]
                    }
                }
            ]
        }

        var sourceBbox = new VectorSource({
            format: new GeoJSON(),
            features: new GeoJSON().readFeatures(bboxFirst),
            wrapX: false
        });

        var sourceCountry = new VectorSource({
            format: new GeoJSON(),
            wrapX: false
        });


        var vectorCountry = new VectorLayer({
            source: sourceCountry,
            zIndex: 899,
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new StrokeStyle({
                    color: '#0000ff',
                    width: 1
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new FillStyle({
                        color: '#ffcc33'
                    })
                })
            })
        });

        var vectorBbox = new VectorLayer({
            source: sourceBbox,
            zIndex: 899,
            visible: props.showBbox,
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new StrokeStyle({
                    color: '#ff00ee',
                    width: 1
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new FillStyle({
                        color: '#ffcc33'
                    })
                })
            })
        });



        /**
    * Elements that make up the popup.
    */
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');

        /**
         * Create an overlay to anchor the popup to the map.
         */
        var overlay = new Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });

        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */

        closer.addEventListener('click', function () {
            sourceHighlight.clear();
            overlay.setPosition(undefined);
            closer.blur();

            return false;
        });

        var map = new Map({
            view: new View({
                center: [0, 0],
                zoom: 1
            }),
            layers: [
                new TileLayer({
                    source: new XYZSource({
                        url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                        attributions: 'Tiles Imagery © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',
                        crossOrigin: "Anonymous"
                    })
                }),
                graticule,
                vectorHighlight,
                vectorMeasurement,
                vectorMagic,
                vectorBbox,
                vectorCountry,
                new LayerGroup()
            ],
            target: 'map-container',
            overlays: [overlay],
            controls: defaultControls().extend([
                new Attribution({ collapsed: false }),
                overviewMapControl,
                scaleLine,
                zoomToExtentControl,
                gratiControl,
                measureControl,
                identifyControl,
                drawingControl
                //new MousePosition()
            ]),
        });
        var closePrint = document.getElementById('close_print');

        closePrint.addEventListener(
            'click',
            function () {
                props.setPrinting(false)
            },
            false
        );


        //measurement


        /**
         * Format length output.
         * @param {LineString} line The line.
         * @return {string} The formatted length.
         */
        var formatLength = function (line) {
            var length = getLength(line);
            var output;
            if (length > 100) {
                var calculation = Math.round((length / 1000) * 100) / 100
                output = calculation.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + 'km';
            } else {
                var calculation = Math.round(length * 100) / 100
                output = calculation.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + 'm';
            }
            return output;
        };

        /**
         * Format area output.
         * @param {Polygon} polygon The polygon.
         * @return {string} Formatted area.
         */
        var formatArea = function (polygon) {
            var area = getArea(polygon);
            var output;
            if (area > 10000) {
                var calculation = Math.round((area / 1000000) * 100) / 100
                output = calculation.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + 'km<sup>2</sup>';
            } else {
                var calculation = Math.round(area * 100) / 100
                output = calculation.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + 'm<sup>2</sup>';
            }
            return output;
        };

        /**
        * Creates a new help tooltip
        */
        function createHelpTooltip() {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'ol-tooltip hidden';
            helpTooltip = new Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left',
            });
            map.addOverlay(helpTooltip);
        }

        /**
         * Creates a new measure tooltip
         */
        function createMeasureTooltip() {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }
            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
            measureTooltip = new Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center',
            });
            map.addOverlay(measureTooltip);
        }


        var typeSelect = document.getElementById('type');
        typeSelect.onchange = function () {
            if (measuring) {
                map.removeInteraction(draw);
                addInteraction();
            }
        };

        function addInteraction() {
            var type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
            draw = new Draw({
                source: sourceMeasurement,
                type: type,
                style: new Style({
                    fill: new FillStyle({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                    stroke: new StrokeStyle({
                        color: 'rgba(140, 228, 250, 0.5)',
                        lineDash: [5, 5],
                        width: 2,
                    }),
                    image: new CircleStyle({
                        radius: 5,
                        stroke: new StrokeStyle({
                            color: 'rgba(140, 228, 250, 0.7)',
                        }),
                        fill: new FillStyle({
                            color: 'rgba(255, 255, 255, 0.2)',
                        }),
                    }),
                }),
            });
            map.addInteraction(draw);

            createMeasureTooltip();
            createHelpTooltip();

            var listener;
            draw.on('drawstart', function (evt) {
                // set sketch
                sketch = evt.feature;

                /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            });

            draw.on('drawend', function () {
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip();
                unByKey(listener);
            });
        }

        var closeMeasurement = document.getElementById('close_measurement');

        closeMeasurement.addEventListener(
            'click',
            function () {
                setMeasurement(false)
            },
            false
        );

        var finishMeasurement = document.getElementById('finish_measurement');

        finishMeasurement.addEventListener(
            'click',
            function () {

                if (!measuring) {
                    //peta.getInteractions().pop()
                    measuring = true;
                    map.removeOverlay(helpTooltip)
                    map.removeOverlay(measureTooltip)
                    addInteraction();
                    finishMeasurement.innerHTML = "Finish Measurement";
                } else {
                    measuring = false;
                    map.removeInteraction(draw)
                    map.removeOverlay(helpTooltip)
                    map.removeOverlay(measureTooltip)
                    finishMeasurement.innerHTML = "Start Measurement";

                }

            },
            false
        );


        var clearButton = document.getElementById('clear_measurement');

        clearButton.addEventListener(
            'click',
            function () {

                sourceMeasurement.clear();
                var elements = document.getElementsByClassName("ol-tooltip-static")
                //console.log(staticTooltip)
                while (elements.length > 0) {
                    elements[0].parentNode.removeChild(elements[0]);
                }
            },
            false
        );

        var closeIdentifying = document.getElementById('close_identifying');

        closeIdentifying.addEventListener(
            'click',
            function () {
                setIdentify(false)

            },
            false
        );

        var closeDrawing = document.getElementById('close_drawing');

        closeDrawing.addEventListener(
            'click',
            function () {
                setDrawingO(false)
            },
            false
        );

        //drawing
        var typeSelect2 = document.getElementById('type2');

        function addInteraction2() {
            var value = typeSelect2.value;
            var point_color = document.getElementById("point_color")
            var stroke_color = document.getElementById("stroke_color")
            var stroke_width = document.getElementById("stroke_width")
            var fill_color_rgba = document.getElementById("fill_color_rgba")
            var sourceDrawing = new VectorSource();

            var vectorDrawing = new VectorLayer({
                source: sourceDrawing,
                zIndex: 901,
                style: new Style({
                    fill: new FillStyle({
                        color: fill_color_rgba.innerHTML,
                    }),
                    stroke: new StrokeStyle({
                        color: stroke_color.value,
                        width: stroke_width.value,
                    }),
                    image: new CircleStyle({
                        radius: 3,
                        fill: new FillStyle({
                            color: point_color.value,
                        }),
                    }),
                }),
            });
            var random = Date.now()
            vectorDrawing.set('id', 'drawing-' + random)
            map.addLayer(vectorDrawing);
            props.setMapLayer(oldArray => [...oldArray, { id: 'drawing-' + random, title: value + "-" + random, server: 'local', tipe: 'geojson', url: '', layer: '', original: '', pdf: '', geojson: '', kml: '', gml: '', shp: '', csv: '', excel: '', metadata: false, table: false, visible: true, opacity: 1 }]);


            draw = new Draw({
                source: sourceDrawing,
                type: value,
            });
            map.addInteraction(draw);
        }

        var finishDrawing = document.getElementById('finish_drawing');

        finishDrawing.addEventListener(
            'click',
            function () {

                if (!drawing) {
                    //peta.getInteractions().pop()
                    drawing = true;
                    //map.removeOverlay(helpTooltip)
                    //map.removeOverlay(measureTooltip)
                    addInteraction2();
                    finishDrawing.innerHTML = "Finish Drawing";
                    var point_color = document.getElementById("point_color")
                    var stroke_color = document.getElementById("stroke_color")
                    var stroke_width = document.getElementById("stroke_width")
                    var fill_color = document.getElementById("fill_color")
                    var fill_color_alpha = document.getElementById("fill_color_alpha")
                    point_color.disabled = true;
                    stroke_color.disabled = true;
                    stroke_width.disabled = true;
                    fill_color.disabled = true;
                    fill_color_alpha.disabled = true;
                    typeSelect2.disabled = true;
                } else {
                    drawing = false;
                    map.removeInteraction(draw)
                    //map.removeOverlay(helpTooltip)
                    //map.removeOverlay(measureTooltip)
                    finishDrawing.innerHTML = "Start Drawing";
                    var point_color = document.getElementById("point_color")
                    var stroke_color = document.getElementById("stroke_color")
                    var stroke_width = document.getElementById("stroke_width")
                    var fill_color = document.getElementById("fill_color")
                    var fill_color_alpha = document.getElementById("fill_color_alpha")
                    point_color.disabled = false;
                    stroke_color.disabled = false;
                    stroke_width.disabled = false;
                    fill_color.disabled = false;
                    fill_color_alpha.disabled = false;
                    typeSelect2.disabled = false;

                }

            },
            false
        );

        var finishIdentifying = document.getElementById('finish_identifying');

        finishIdentifying.addEventListener(
            'click',
            function () {

                if (!identifying) {
                    identifying = true;
                    finishIdentifying.innerHTML = "Finish Identifying";
                    document.body.style.cursor = 'help';
                    setAlertIdentify(true);
                } else {
                    identifying = false;
                    setAlertIdentify(false);
                    finishIdentifying.innerHTML = "Start Identifying";
                    document.body.style.cursor = 'default';
                }
            }
            ,
            false
        );





        var pointerMoveHandler = function (evt) {
            if (evt.dragging) {
                return;
            }
            /*
            if (map) {

                var pixel = map.getEventPixel(evt.originalEvent);
                var hit = map.forEachLayerAtPixel(pixel, function () {
                    return true;
                });
                map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            }
            */
            //console.log(measuring)
            if (measuring) {
                /** @type {string} */
                var helpMsg = 'Click to start measuring';

                if (sketch) {
                    var geom = sketch.getGeometry();
                    if (geom instanceof Polygon) {
                        helpMsg = continuePolygonMsg;
                    } else if (geom instanceof LineString) {
                        helpMsg = continueLineMsg;
                    }
                }
                if (helpTooltipElement) {
                    helpTooltipElement.innerHTML = helpMsg;
                    helpTooltip.setPosition(evt.coordinate);

                    helpTooltipElement.classList.remove('hidden');
                }
            }
        };

        map.on('pointermove', pointerMoveHandler);
        //peta.on('rendercomplete', updatePrint(peta));
        map.on('singleclick', function (evt) {
            //document.getElementById('info').innerHTML = '';
            if (identifying) {
                var viewResolution = /** @type {number} **/ (map.getView().getResolution());
                //console.log(peta)
                /*
                var layers = map.getLayers().getArray()
                //console.log(layers.length)
                var layer = layers[layers.length - 1]
                //console.log(layer)
                var wmsSource = layer.getSource()
                console.log(wmsSource)

                var url = wmsSource.getFeatureInfoUrl(
                    evt.coordinate,
                    viewResolution,
                    'EPSG:3857',
                    { 'INFO_FORMAT': 'application/json' }
                    //text/html
                );
                */
                var wms = map.getLayers();
                idx = -1;                
                wms.forEach(function (layer, i) {
                    //var layerid = i;
                    //console.log(layer.getVisible())
                    if(layer instanceof ImageLayer){
                       if (layer.getVisible()) {
                            idx = i;
                        }
                    }
                });
                var url;
                if (idx === -1) {
                    alert("There is no WMS layer visible")
                } else {
                    //console.log();
                   var layer =  wms.getArray()[idx]
                   //console.log(layer)
                   var wmsSource = layer.getSource()
   
                   url = wmsSource.getFeatureInfoUrl(
                       evt.coordinate,
                       viewResolution,
                       'EPSG:3857',
                       { 'INFO_FORMAT': 'application/json' }
                       //text/html
                   );
                }
                if (url) {
                    fetch(url)
                        .then(function (response) { return response.text(); })
                        .then(function (html) {
                            //document.getElementById('info').innerHTML = html;
                            var data = JSON.parse(html);
                            //console.log(html)
                            var feature = data.features[0]
                            //html;
                            overlay.setPosition();
                            sourceHighlight.clear();
                            if (feature) {
                                console.log(feature)
                                //console.log(feature.geometry.coordinates[0])
                                var transform = true;
                                if (feature.geometry.type === "MultiPolygon") {
                                    var koordinat = feature.geometry.coordinates[0][0][0][0]
                                    //console.log(koordinat)
                                    if (koordinat > 180 || koordinat < -180)
                                        transform = false;
                                    //console.log(cek_koordinat);
                                } else {

                                }
                                console.log(transform)
                                if (transform) {
                                    //console.log(new GeoJSON().readFeature(feature, {featureProjection: 'EPSG:3857'}))
                                    sourceHighlight.addFeature(new GeoJSON().readFeature(feature, {
                                        featureProjection: 'EPSG:3857'
                                    }))
                                } else {
                                    sourceHighlight.addFeature(new GeoJSON().readFeature(feature))
                                }


                                /*
                                console.log(feature.geometry)
                                var src = 'EPSG:3857'
                                var dest = 'EPSG:4326'

                                var geomnya;
                                if (feature.geometry.type === "MultiPolygon") {
                                    geomnya = new MultiPolygon(feature.geometry.coordinates)
                                    console.log(geomnya)
                                }
                                sourceHighlight.addFeature(feature)
                                /*
                                const featurenya = new Feature({
                                    geometry: Polygon([[[8623931.28, 1449016.75], [8624007.72, 1458265.63],
                                    [8629358.31, 1458571.37], [8628441.06, 1455284.58], [8625765.77, 1449781.12], [8630275.55, 1453450.09],
                                    [8629281.88, 1452456.42], [8627294.51, 1451080.54], [8625765.76, 1449781.11], [8623931.28, 1449016.75]]]
                                    )
                                });

                                //source.addFeature(feature);
                                sourceHighlight.addFeature(feature)
                                */
                                /*
                                var featurenya = new Feature({
                                    geometry: geomnya,
                                    name: 'highlighted'
                                })
                                //console.log(featurenya)
                                
                                console.log(featurenya.getGeometry())
                                //feature.getGeometry().transform(src, dest).transform(src, dest)
                                /*
                                sourceHighlight.addFeature(featurenya)
                                //peta.getView().fit(featurenya.getGeometry())
                                //console.log(sourceHighlight)
                                */
                                if (feature.hasOwnProperty("properties")) {
                                    //console.log(data.features[0].properties)
                                    var tabel = '<p>Layer: ' + layer.get('title') + '</p>';
                                    tabel = tabel + '<div style="max-height:250px;overflow:auto;"><table class="table table-strip font-11">';
                                    //tabel += '<tr><td>ID</td><td style="max-width:200px;overflow-wrap: break-word;"> ' + data.features[0].id + '</td></tr>'
                                    for (var prop in feature.properties) {
                                        //console.log(prop)
                                        //console.log(feature.properties[prop])
                                        tabel += '<tr><td>' + prop + '</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '</td></tr>'
                                    }
                                    //feature.properties.forEach(element => {
                                    //    console.log(element);
                                    // });
                                    tabel += "</table></div>"
                                    content.innerHTML = tabel;
                                    overlay.setPosition(evt.coordinate);
                                }
                            }
                        });
                }
            }

        });

        setPeta(map);
    }

    useEffect(() => {
        if (peta) {
            //alert(props.provider)
            switch_basemap()
        }
    }, [props.provider])


    useEffect(() => {
        if (props.printing) {
            //alert(props.printing)
            updatePrint()
        }
    }, [props.printing])

    useEffect(() => {

        if (peta) {

            var renderComplete = function (evt) {
                /*
                var wms = peta.getLayers().getArray();
                //console.log(wms)

                idx = -1;
                
                wms[i_group].getLayers().forEach(function (layer, i) {
                    //var layerid = i;
                    //console.log(layer.getVisible())
                    if (layer.getVisible()) {
                        idx = i;
                    }


                });
                */

                var wms = peta.getLayers();
                //console.log(wms)

                idx = -1;
                
                wms.forEach(function (layer, i) {
                    //var layerid = i;
                    //console.log(layer.getVisible())
                    if(layer instanceof ImageLayer){
                       if (layer.getVisible()) {
                            idx = i;
                        }
                    }


                });

                var name_layer = document.getElementById('name_layer');
                if (idx === -1) {
                    name_layer.innerHTML = "None";
                } else {
                    //console.log();
                   // name_layer.innerHTML = wms[i_group].getLayers().getArray()[idx].get('title');
                   name_layer.innerHTML = wms.getArray()[idx].get('title');
                }
                //console.log(idx)


            }

            peta.on('rendercomplete', renderComplete);
            var exportButton = document.getElementById('export-pdf');

            exportButton.addEventListener(
                'click',
                function () {
                    //alert('clicked')
                    //exportButton.disabled = true;
                    document.body.style.cursor = 'progress';

                    updatePrint()

                },
                false
            );

        }
    }, [peta])

    useEffect(() => {
        if (peta) {

            if (props.buffer.length > 0) {
                console.log(props.buffer)
                //console.log(props.buffer[0])
                //console.log(props.buffer[0].data)

                if (props.buffer[0].data.features.length > 0) {
                    var shapeSource = new VectorSource({
                        features: new GeoJSON().readFeatures(props.buffer[0].data, {
                            featureProjection: 'EPSG:3857'
                        }),
                        wrapX: false
                    })

                    var shapeLayer = new VectorLayer({
                        source: shapeSource,
                        zIndex: 899,
                    });
                    shapeLayer.set('id', 'uploader' + props.buffer[0].data.fileName)
                    peta.addLayer(shapeLayer);
                    props.setMapLayer(oldArray => [...oldArray, { id: 'uploader' + props.buffer[0].data.fileName, title: props.buffer[0].data.fileName, server: 'local', tipe: 'zip', url: '', layer: '', original: '', pdf: '', geojson: '', kml: '', gml: '', shp: '', csv: '', excel: '', metadata: false, table: false, visible: true, opacity: 1 }]);
                    props.setZoomTo('uploader' + props.buffer[0].data.fileName)
                } else {
                    alert('no features found')
                }
                props.setBuffer([])

            }

        }
    }, [props.buffer])

    useEffect(() => {
        if (peta) {
            if (props.performZoom) {
                var layers = peta.getLayers().getArray()
                //console.log(layers)
                //console.log(layers[i_bbox].getSource().getFeatures())
                //console.log(layers[i_country].getSource().getFeatures()[0].getGeometry())
                peta.getView().fit(layers[i_bbox].getSource().getFeatures()[0].getGeometry())
                props.setPerformZoom(false)
                // map.getView().animate({zoom: map.getView().getZoom() - 0.5});
            }

        }
    }, [props.performZoom])

    useEffect(() => {
        if (peta) {
            if (props.zoomTo) {
                //alert(props.zoomTo)

                if (props.zoomTo.includes("upload")) {


                    var candidate;
                    peta.getLayers().forEach(function (layer, i) {
                        //alert('ya')
                        //console.log(layer.getKeys())
                        if (layer.getKeys().includes("id")) {
                            //console.log(layer);
                            //alert('wow')
                            if (layer.get("id") === props.zoomTo) {
                                //alert('oi')
                                candidate = layer;
                            }
                        }
                        /*
                        if (layer.get("id") !== undefined && layer.get("id") === props.identifierDelete) {
                         
                        }
                        */
                    });
                    //console.log(candidate.getSource().getExtent())
                    //console.log(candidate.getExtent())
                    peta.getView().fit(candidate.getSource().getExtent())
                    props.setZoomTo()
                } else if (props.zoomTo.includes("drawing")) {
                    var candidate;
                    peta.getLayers().forEach(function (layer, i) {
                        //alert('ya')
                        //console.log(layer.getKeys())
                        if (layer.getKeys().includes("id")) {
                            //console.log(layer);
                            //alert('wow')
                            if (layer.get("id") === props.zoomTo) {
                                //alert('oi')
                                candidate = layer;
                            }
                        }
                        /*
                        if (layer.get("id") !== undefined && layer.get("id") === props.identifierDelete) {
                         
                        }
                        */
                    });
                    //console.log(candidate.getSource().getExtent())
                    //console.log(candidate.getExtent())
                    //console.log(candidate)
                    peta.getView().fit(candidate.getSource().getExtent(), peta.getSize())
                    props.setZoomTo()

                } else {
                    const requestOptions = {
                        method: 'GET'
                    };

                    fetch(url_list_harvesting_bbox + props.zoomTo, requestOptions).then(res => res.json()).then(data => {

                        //console.log(data.message.bbox);
                        var bbox = JSON.parse(data.message.bbox);
                        //console.log(bbox)
                        //setZoomTo(bbox)
                        var feature = new Feature({
                            geometry: new Polygon(bbox.coordinates),
                            name: 'country'
                        })
                        //console.log(feature)
                        peta.getView().fit(feature.getGeometry())
                        props.setZoomTo()
                    })
                }
                /*
                console.log(props.zoomTo)
                //map.getView().fit(props.zoomTo)
                var feature = new Feature({
                    geometry: new Polygon(props.zoomTo.coordinates),
                    name: 'country'
                })
                console.log(feature)
                map.getView().fit(feature.getGeometry())
                */
                // map.getView().animate({zoom: map.getView().getZoom() - 0.5});
            }

        }
    }, [props.zoomTo])

    useEffect(() => {
        if (peta) {
            //load_wms()
            if (props.mapLayer.length > 0) {
                //console.log(props.mapLayer[props.mapLayer.length - 1])
                //var row = props.mapLayer[props.mapLayer.length - 1]
                //console.log(row)
                //console.log(row.layer)


                props.mapLayer.forEach(function (l, y) {
                    //console.log(l)

                    var check = false
                    peta.getLayers().forEach(function (layer, i) {
                        if (layer.get('id') === l.id) {
                            layer.setVisible(l.visible)
                            layer.setOpacity(parseFloat(l.opacity))
                            //console.log(l.opacity)
                            check = true
                        }
                    })
                    if (!check) {
                        // alert('oi')
                        if (l.tipe === "wms") {
                            //alert(main)
                            var wmsSource = new ImageWMSSource({
                                url: Config.proxy_domain + l.url,
                                params: { 'LAYERS': l.layer },
                                ratio: 1,
                                serverType: l.server,
                                crossOrigin: 'anonymous'
                            });
                            var wmsLayer = new ImageLayer({
                                source: wmsSource
                            })
                            wmsLayer.set('id', l.id)
                            wmsLayer.set('title', l.title)
                            //console.log(map.getLayerGroup())
                            //var group = map.getLayerGroup()

                            //var layers = peta.getLayers().getArray();
                            //var group = layers[i_group].getLayers().getArray()
                            //console.log(layers)
                            //group.push(wmsLayer)
                            //console.log(layers)
                            peta.addLayer(wmsLayer)
                        }
                    }

                })

                /*
                if (row.tipe === "wms") {
                    var check = false
                    map.getLayers().forEach(function (layer, i) {
                        //console.log(layer);
                        //console.log(layer.get('id'));
                        if (layer.get('id') === row.id) {
                            layer.setVisible(row.visible)
                            check = true
                            alert('visible')
                        }
                    });
                   
                }
                */
            }
        }
    }, [props.mapLayer])

    useEffect(() => {
        //alert(props.showBbox)
        if (peta) {
            var layers = peta.getLayers().getArray()
            //console.log(layers)
            //alert(props.showBbox)
            layers[i_bbox].setVisible(props.showBbox)
        }

    }, [props.showBbox])

    useEffect(() => {
        //alert(props.showBbox)
        if (peta) {
            var layers = peta.getLayers().getArray()
            //console.log(layers)
            layers[i_country].setVisible(props.showArea)
        }

    }, [props.showArea])

    useEffect(() => {
        //alert(props.showBbox)
        if (peta) {
            //var layers = map.getLayers().getArray()
            //console.log(layers)
            //console.log(props.identifierDelete)
            //alert(props.identifierDelete)
            if (props.identifierDelete) {
                // alert('ok')
                //console.log(map.getLayers().getArray().length)
                var candidate;
                peta.getLayers().forEach(function (layer, i) {
                    //alert('ya')
                    //console.log(layer.getKeys())
                    if (layer.getKeys().includes("id")) {
                        //console.log(layer);
                        //alert('wow')
                        if (layer.get("id") === props.identifierDelete) {
                            //alert('oi')
                            candidate = layer;
                        }
                    }
                    /*
                    if (layer.get("id") !== undefined && layer.get("id") === props.identifierDelete) {
                     
                    }
                    */
                });

                if (candidate) {
                    peta.removeLayer(candidate)
                }
                props.setIdentifierDelete('')

            }



            //layers[2].setVisible(props.showArea)

        }

    }, [props.identifierDelete])
    /*
    useEffect(() => {
        //alert(props.showBbox)
        if (map) {
            //var layers = map.getLayers().getArray()
            //console.log(layers)
            console.log(props.identifierVisible)
            props.setIdentifierVisible('')
            map.getLayers().forEach(function (layer, i) {
                //console.log(layer);
                //console.log(layer.get('id'));
                if (layer.get('id') === props.identifierVisible) {
                    //map.removeLayer(layer)
                    //console.log(layer)
                    console.log(layer.getVisible())
                    layer.setVisible(!layer.getVisible())
                 }

                });
        }

    }, [props.identifierVisible])
    */

    useEffect(() => {
        if (peta) {
            //sourceBbox.clear()
            var wms = peta.getLayers().getArray();
            //console.log(wms)

            var _source = wms[i_bbox].getSource()
            // console.log(_source)
            //console.log(props.bbox)
            _source.clear();
            var feature = new Feature({
                geometry: new Polygon([
                    [
                        [
                            props.bbox[0].toFixed(2),
                            props.bbox[1].toFixed(2)
                        ],
                        [
                            props.bbox[2].toFixed(2),
                            props.bbox[1].toFixed(2)
                        ],
                        [
                            props.bbox[2].toFixed(2),
                            props.bbox[3].toFixed(2)
                        ],
                        [
                            props.bbox[0].toFixed(2),
                            props.bbox[3].toFixed(2)
                        ],
                        [
                            props.bbox[0].toFixed(2),
                            props.bbox[1].toFixed(2)
                        ]
                    ]
                ]),
                name: 'Bbox'
            });
            //vectorSource.addFeature();
            _source.addFeature(feature)
            //peta.getView().fit(feature.getGeometry())
            //map.getView().animate({zoom: map.getView().getZoom() - 0.5});
        }
    }, [props.bbox])




    useEffect(() => {
        if (peta) {
            var wms = peta.getLayers().getArray();
            //console.log(wms)

            var _sourceCountry = wms[i_country].getSource()

            _sourceCountry.clear()
            //console.log(props.country)
            if (props.country) {
                var feature = new Feature({
                    geometry: new MultiPolygon(props.country.coordinates),
                    name: 'country'
                })
                //console.log(feature)
                _sourceCountry.addFeature(feature)
            }
            //map.getView().fit(feature.getGeometry())
            //map.getView().animate({zoom: map.getView().getZoom() - 0.5});
        }
    }, [props.country])

    useEffect(() => {
        if (peta) {
            //alert(props.drawBbox)
            //props.setDrawBbox(props.drawBbox)
            //alert(draw)
            if (props.drawBbox) {
                var dragBox = new DragBox({
                    //condition: platformModifierKeyOnly,
                });

                peta.addInteraction(dragBox);
                // clear selection when drawing a new box and when clicking on the map
                var wms = peta.getLayers().getArray();
                //console.log(wms)

                var _sourceBbox = wms[i_bbox].getSource()
                var _sourceCountry = wms[i_country].getSource()

                dragBox.on('boxstart', function () {
                    _sourceCountry.clear();
                    _sourceBbox.clear();
                });
                dragBox.on('boxend', function () {
                    // features that intersect the box geometry are added to the
                    // collection of selected features

                    // if the view is not obliquely rotated the box geometry and
                    // its extent are equalivalent so intersecting features can
                    // be added directly to the collection
                    //var rotation = map.getView().getRotation();
                    //var oblique = rotation % (Math.PI / 2) !== 0;
                    //var candidateFeatures = oblique ? [] : selectedFeatures;

                    var bbox = dragBox.getGeometry().getExtent();
                    //map.getView().fit(bbox)
                    //map.getView().animate({zoom: map.getView().getZoom() - 0.5});
                    props.setAreaName('User Drawing Bbox')
                    props.setBbox([bbox[0], bbox[1], bbox[2], bbox[3]])

                    props.setBboxLabel('[' + bbox[0].toFixed(2) + ', ' + bbox[1].toFixed(2) + ', ' + bbox[2].toFixed(2) + ', ' + bbox[3].toFixed(2) + ']')
                    props.setDrawBbox(false)
                    props.setShowBbox(true)

                    //vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
                    //candidateFeatures.push(feature);
                    //});

                    // when the view is obliquely rotated the box extent will
                    // exceed its geometry so both the box and the candidate
                    // feature geometries are rotated around a common anchor
                    // to confirm that, with the box geometry aligned with its
                    // extent, the geometries intersect

                });


            }
            else {
                peta.getInteractions().pop()
            }

        }
    }, [props.drawBbox, draw])


    function updatePrint() {
        //console.log('aaaaa')
        if (peta) {

            var exportOptions = {
                filter: function (element) {
                    var className = element.className || '';
                    return (
                        className.indexOf('ol-control') === -1 ||
                        className.indexOf('ol-scale') > -1 ||
                        (className.indexOf('ol-attribution') > -1 &&
                            className.indexOf('ol-uncollapsible'))
                    );
                },
            };
            var obj = peta.getTargetElement()

            exportOptions.width = obj.clientWidth;
            exportOptions.height = obj.clientHeight;

            //peta.once('rendercomplete', function () {
            var wms = peta.getLayers().getArray();
            var _source = wms[i_magic].getSource();
            _source.clear();
            //console.log(_source)
            var bbox = peta.getView().calculateExtent(peta.getSize());
            //console.log(bbox)
            var feature = new Feature({
                geometry: new Polygon([
                    [
                        [
                            bbox[0],
                            bbox[1]
                        ],
                        [
                            bbox[2],
                            bbox[1]
                        ],
                        [
                            bbox[2],
                            bbox[3]
                        ],
                        [
                            bbox[0],
                            bbox[3]
                        ],
                        [
                            bbox[0],
                            bbox[1]
                        ]
                    ]
                ]),
                name: 'BboxMagic'
            });
            //vectorSource.addFeature();
            _source.addFeature(feature)

            domtoimage.toPng(obj, exportOptions)
                .then(function (dataURL) {
                    //var link = document.getElementById('image-download');
                    //link.href = dataURL;
                    //link.click();
                    setCapture(dataURL)
                    setHeight(obj.clientHeight);
                    document.body.style.cursor = 'auto';
                });


            var leg = document.getElementById('preview-legend');
            //console.log(leg)
            //console.log(leg.clientWidth)
            //console.log(leg.clientHeight)
            const _a4PageSize = { height: leg.clientHeight, width: 250 }
            setTimeout(function () {
                domtoimage
                    .toPng(leg, _a4PageSize)
                    .then(dataUrl => {
                        //console.log(dataUrl)
                        setCLegend(dataUrl);

                    }).catch(err => { console.log(err) });

            }, 800);
        }
    }

    function switch_basemap() {
        var _source;
        var layers = peta.getLayers().getArray()
        //console.log(map.getControls())
        var controllers = peta.getControls().getArray()
        //console.log(controllers)
        //console.log(overviewMapControl.getOverviewMap().getLayers().getArray())
        //var layers_ = overviewMapControl.getOverviewMap().getLayers().getArray()
        var layers_ = controllers[4].getOverviewMap().getLayers().getArray()
        var coloring = gcolor2
        switch (props.provider) {
            case 'osm':
                _source = new OSMSource()
                break;
            case 'gray':
                _source = new XYZSource({
                    url: Config.proxy_domain + "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
                    attributions: 'Tiles World Light Gray © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer">ArcGIS</a>',
                    crossOrigin: "Anonymous"
                })

                break;
            case 'ocean':
                _source = new XYZSource({
                    url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
                    attributions: 'Tiles Ocean © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer">ArcGIS</a>',
                    crossOrigin: "Anonymous"
                });

                break;
            case 'topography':
                _source = new XYZSource({
                    url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
                    attributions: 'Tiles World Topo © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                    crossOrigin: "Anonymous"
                });

                break;
            case 'street':
                _source = new XYZSource({
                    url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
                    attributions: 'Tiles World Street © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer">ArcGIS</a>',
                    crossOrigin: "Anonymous"
                });

                break;
            case 'natgeo':
                _source = new XYZSource({
                    url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
                    attributions: 'Tiles NatGeo World © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer">ArcGIS</a>',
                    crossOrigin: "Anonymous"
                });

                break;
            case 'imagery':
                _source = new XYZSource({
                    url: Config.proxy_domain + "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    attributions: 'Tiles Imagery © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',
                    crossOrigin: "Anonymous"
                });
                coloring = gcolor1;
                break;
            case 'stamen':
                _source = new StamenSource({
                    layer: 'watercolor',
                })

                break;
            default:
                //tileRef.current.setUrl(urlBasemap);
                //setAttribution(osmContrib);
                break;
        }
        //console.log(layers)
        //console.log(layers[0])
        //peta.getLayers().removeAt(i_graticule)
        var newGraticule = new Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new Stroke({
                color: coloring, //'rgba(255,120,0,0.9)',
                width: 1,
                lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: false,
        })

        peta.getLayers().setAt(i_graticule, newGraticule)
        layers[i_basemap].setSource(_source);
        //console.log(layers[0])
        //console.log(layers_[0])
        layers_[i_basemap].setSource(_source);

    }

    function load_wms_legend() {
        if (typeof (props.mapLayer) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (props.mapLayer !== null) {

                if (props.mapLayer.length > 0) {

                    return props.mapLayer.map((row, index) => {
                        //console.log(row)
                        //console.log(row.layer)

                        var wmsSource = new ImageWMSSource({
                            url: Config.proxy_domain + row.url,
                            params: { 'LAYERS': row.layer },
                            ratio: 1,
                            serverType: row.server,
                            crossOrigin: 'Anonymous'
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
                                    <img crossOrigin="Anonymous" referrerPolicy="origin" src={graphicUrl} alt={row.title} onLoad={() => { console.log(this) }} />
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

    function handlingLegend() {
        setLegend(!legend)
        var leg = document.getElementById('preview-legend');
        console.log(leg)
        //console.log(leg.clientWidth)
        //console.log(leg.clientHeight)
        const _a4PageSize = { height: 300, width: 250 }

        setTimeout(function () {
            domtoimage
                .toPng(leg, _a4PageSize)
                .then(dataUrl => {
                    //console.log(dataUrl)
                    setCLegend(dataUrl);

                }).catch(err => { console.log(err) });

        }, 800);

    }



    function handleFillColor(val) {
        setFillColor(val)
        var r = parseInt(val.substr(1, 2), 16)
        var g = parseInt(val.substr(3, 2), 16)
        var b = parseInt(val.substr(5, 2), 16)

        var fill_color_rgba = document.getElementById('fill_color_rgba');
        var a = document.getElementById('fill_color_alpha');
        fill_color_rgba.innerHTML = "rgba(" + r + ", " + g + ", " + b + ", " + a.value + ")";
    }

    function handleFillColorAlpha(val) {
        setFillColorAlpha(val)
        var fill_color = document.getElementById('fill_color');
        var rgb = fill_color.value;
        var r = parseInt(rgb.substr(1, 2), 16)
        var g = parseInt(rgb.substr(3, 2), 16)
        var b = parseInt(rgb.substr(5, 2), 16)

        var fill_color_rgba = document.getElementById('fill_color_rgba');

        fill_color_rgba.innerHTML = "rgba(" + r + ", " + g + ", " + b + ", " + val + ")";
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
        if (elmnt.id === "print") {

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
        <>
            <div id='map-container' className="map" />

            <div id="measurement" className={measurement ? 'show' : 'hide'} >
                <div className="bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Measurement<button type="button" className="close" id="close_measurement"><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
                <Row className="mx-3 my-3">
                    <Col className="px-1 font-11">
                        <form className="form-inline">
                            <label htmlFor="type">Measurement type &nbsp;</label>
                            <select id="type">
                                <option value="length">Length (LineString)</option>
                                <option value="area">Area (Polygon)</option>
                            </select>
                        </form>
                    </Col>
                </Row>
                <Row className='show px-1 pt-2'>
                    <Col className="">
                        <Button size="sm" variant="secondary" className="py-0 font-11" block id="finish_measurement">Start Measurement</Button>
                        <Button size="sm" variant="secondary" className="py-0 font-11" block id="clear_measurement">Clear Measurement</Button>
                    </Col>
                </Row>
            </div>
            <div id="identifying" className={identify ? 'show' : 'hide'} >
                <div className="bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Identify<button type="button" className="close" id="close_identifying"><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
                <Row className="mx-2 mt-2">
                    <Col className="px-1 font-11">
                        {alertIdentify ? <Button variant="outline-success" className="py-0 font-11 mb-2" disabled><b>Feature Identification is ACTIVE</b></Button> : <Button variant="outline-danger" className="py-0 font-11 mb-2" disabled><b>Feature Identification is NOT ACTIVE</b></Button>}
                        <span>Layer (Top-Visible): <br /><b><span id="name_layer">None</span></b></span>
                        <Button size="sm" variant="secondary" className="py-0 font-11 mt-2" block id="finish_identifying">Start Identifying</Button>

                    </Col>
                </Row>
            </div>
            <div id="drawing" className={drawingO ? 'show' : 'hide'} >
                <div className="bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Drawing<button type="button" className="close" id="close_drawing"><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
                <Row className="mx-3 my-3">
                    <Col className="px-1 font-11">
                        <form className="form-inline">
                            <label htmlFor="type2">Geometry type: &nbsp;</label>
                            <select id="type2">
                                <option value="Point">Point</option>
                                <option value="LineString">LineString</option>
                                <option value="Polygon">Polygon</option>
                            </select>
                        </form>
                    </Col>
                </Row>

                <Row className="mx-3 my-3">
                    <Col className="px-1 font-11">
                        <span><b>Styling Symbology</b></span>
                        <form className="form">
                            <label htmlFor="point_color">Point Color: &nbsp; </label>
                            <input type="color" id="point_color" name="point_color" value={pointColor} onChange={(e) => setPointColor(e.target.value)} />
                            <br />
                            <label htmlFor="stroke_color">Stroke Color: &nbsp;</label>
                            <input type="color" id="stroke_color" name="stroke_color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
                            <br />
                            <label htmlFor="stroke_width">Stroke Width: &nbsp;</label>
                            <select id="stroke_width" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)}>
                                <option value="0.5">0.5</option>
                                <option value="1">1</option>
                                <option value="1.5">1.5</option>
                                <option value="2">2</option>
                                <option value="2.5">2.5</option>
                            </select>
                            <br />
                            <label htmlFor="fill_color">Fill Color: &nbsp; <span id="fill_color_rgba">rgba(255, 255, 255, 1)</span></label>
                            <br />
                            <input type="color" id="fill_color" name="fill_color" value="#ffffff" value={fillColor} onChange={(e) => handleFillColor(e.target.value)} />
                            <input className="ml-2" type="range" min="0" max="1" step="0.01" id="fill_color_alpha" value={fillColorAlpha} onChange={(e) => handleFillColorAlpha(e.target.value)} />
                        </form>
                    </Col>
                </Row>


                <Row className='show px-1 pt-2'>
                    <Col className="">
                        <Button size="sm" variant="secondary" className="py-0 font-11" block id="finish_drawing">Start Drawing</Button>

                    </Col>
                </Row>
            </div>

            <div id="popup" className="ol-popup">
                <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                <div id="popup-content" ></div>
            </div>

            <div id="print" className={props.printing ? 'show' : 'hide'} >
                <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Print<button type="button" className="close" id="close_print"><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
                <Row className="px-3">
                    <Col className="pt-1 px-1" id="attribute-content">
                        <Form.Control type="text" size="sm" placeholder="Title" className="font-11" value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                    </Col>
                </Row>
                <Row className="px-3">
                    <Col lg={9} className="pt-1 px-1">
                        <img id="preview" width="100%" style={{ border: "solid 1px #000", maxHeight: "250px" }} src={capture} alt="preview" />
                    </Col>
                    <Col lg={3} className="pt-1 px-1">
                        <p className="font-11 mb-1">Legend</p>
                        <div id="preview-legend" style={{ maxWidth: "200px", overflowX: "hidden", maxHeight: "220px", overflowY: "hidden" }} >
                            {
                                legend ? load_wms_legend() : ""
                            }
                        </div>
                    </Col>
                </Row>
                <Row className="px-3">
                    <Col lg={3} className="pt-1 px-1" id="attribute-content">
                        <Form.Group controlId="formBasicCheckbox" className="pl-1">
                            <Form.Check type="checkbox" label="Legend" checked={legend} onChange={() => handlingLegend()} />
                        </Form.Group>
                        <Form.Control as="select" size="sm" className="mt-2 font-11" value={size} onChange={(e) => setSize(e.target.value)}>
                            <option value="A4">A4</option>
                        </Form.Control>
                        <Form.Control as="select" size="sm" className="mt-2 font-11" value={orientation} onChange={(e) => setOrientation(e.target.value)}>
                            <option value="landscape">Landscape</option>
                        </Form.Control>
                    </Col>
                    <Col lg={6} className="pt-1 px-1" id="attribute-content">
                        <Form.Control as="textarea" rows={5} placeholder="Description" className="font-11" value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                    </Col>
                    <Col lg={3} className="pt-2 px-1" id="attribute-content">

                        <Button size="sm" variant="secondary" block className="font-11 py-0" id="export-pdf">Recapture Map</Button>
                        <PDFDownloadLink document={<NewPDFPages mapLayer={props.mapLayer} height={height} legend={legend} size={size} orientation={orientation} data={capture} dataClegend={clegend} title={title} description={description} />} fileName="CiforMap.pdf" className="font-11 py-0 btn btn-secondary btn-block btn-sm">
                            {({ blob, url, loading, error }) =>
                                loading ? 'updating document..' : 'Download pdf'
                            }
                        </PDFDownloadLink>
                        <Button size="sm" variant="secondary" block className="font-11 py-0" onClick={() => props.setPrinting(false)}>Cancel</Button>


                    </Col>
                </Row>
            </div>
        </>

    )
}