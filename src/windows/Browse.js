
import { useState, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Trash, ThreeDotsVertical, BoundingBoxCircles, Layers, Download, Eye, EyeFill, EyeSlashFill, QuestionCircleFill, Printer, Wrench, Grid3x3, QuestionCircle, ListTask, ZoomIn, CardList, Table, InfoCircle, GearWideConnected, Map, ZoomOut } from 'react-bootstrap-icons';

//import image_loader from './loading.gif';

import Config from '../config.json';

export default function Browse(props) {
    //const loader = <img className="logo d-inline" alt="logo" src={image_loader} width="30px" />
    const no_thumb = Config.base_domain + "/no_preview.png"

    //const url_data =  Config.base_domain + "/harvest_cifor.json"
    const url_list_harvesting = Config.api_domain + "/harvestings/bbox/";
    const url_list_organizations = Config.api_domain + "/organizations/";
    const url_list_themes = Config.api_domain + "/themes/";
    const url_list_year = Config.api_domain + "/query/year/";
    const url_list_keywords = Config.api_domain + "/keywords/";

    const [data, setData] = useState();
    const [dataAttribute, setDataAttribute] = useState();

    const [numberData, setNumberData] = useState(0);
    const [title, setTitle] = useState();
    const [identifier, setIdentifier] = useState();
    const [abstract, setAbstract] = useState();
    const [type, setType] = useState();
    const [organization, setOrganization] = useState();
    const [subjects, setSubjects] = useState();
    const [layerName, setLayerName] = useState('Untitled');
    const [urlWMS, setUrlWMS] = useState();
    const [layerWMS, setLayerWMS] = useState();
    const [layerOriginal, setLayerOriginal] = useState();
    const [layerPdf, setLayerPdf] = useState();
    const [layerKML, setLayerKML] = useState();
    const [layerGML, setLayerGML] = useState();
    const [layerSHP, setLayerSHP] = useState();
    const [layerCSV, setLayerCSV] = useState();
    const [layerExcel, setLayerExcel] = useState();
    const [layerGeojson, setLayerGeojson] = useState();
    const [urlThumb, setUrlThumb] = useState(no_thumb);

    const [idOrganization, setIdOrganization] = useState(0);
    const [listOrganizations, setListOrganizations] = useState();

    const [idTheme, setIdTheme] = useState(0);
    const [listThemes, setListThemes] = useState();

    const [idYear, setIdYear] = useState(0);
    const [listYears, setListYears] = useState();

    const [idKeywords, setIdKeywords] = useState(0);
    const [listKeywords, setListKeywords] = useState();

    const [idFlagship, setIdFlagship] = useState(0);
    const [listFlagship, setListFlagship] = useState();


    const [query, setQuery] = useState("");

    useEffect(() => {
        if (props.dataAll) {
            setData(props.dataAll)
            setNumberData(props.dataAll.length);
            setDataAktif(null, props.dataAll.slice(0, 1)[0])
        }
    }, [props.dataAll])

    useEffect(() => {

        let mounted = true;
        let mounted2 = true;
        let mounted3 = true;
        let mounted4 = true;
        let mounted5 = true;

        var flagship = [{ id: 0, name: "All" }, { id: 1, name: "Yes" }, { id: 2, name: "No" }]
        //console.log(dataset)
        setListFlagship(flagship);

        const requestOptions = {
            method: 'GET'
        };
        //-180, -90, 180, 90
        //100.0248/-1.1223/103.8146/2.9191
        /*
        fetch(url_list_harvesting + props.bbox[0].toFixed(6) + "/" + props.bbox[1].toFixed(6) + "/" + props.bbox[2].toFixed(6) + "/" + props.bbox[3].toFixed(6), requestOptions).then(res => res.json()).then(data => {
           
            if (mounted) {
                //console.log(data.data)
                var result = data.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
                setData(result);//.slice(0, 10));
                setDataAll(result);
                setNumberData(result.length);
                setDataAktif(null, result.slice(0, 1)[0])

            }
        })
        */

        fetch(url_list_organizations, requestOptions).then(res => res.json()).then(data => {
            if (mounted2) {
                //console.log(data.data);
                var dataset = [{ id: 0, name: "All" }]
                data.data.forEach(element => {
                    dataset.push(element);
                });
                //console.log(dataset)
                setListOrganizations(dataset);
            }
        });

        fetch(url_list_themes, requestOptions).then(res => res.json()).then(data => {
            if (mounted3) {
                //console.log(data.data);
                var dataset = [{ id: 0, name: "All" }]
                data.data.forEach(element => {
                    dataset.push(element);
                });
                //console.log(dataset)
                setListThemes(dataset);
            }
        });

        fetch(url_list_year, requestOptions).then(res => res.json()).then(data => {
            if (mounted4) {
                //console.log(data.data);
                var dataset = [{ year: "All" }]
                data.data.forEach(element => {
                    dataset.push(element);
                });
                //console.log(dataset)
                setListYears(dataset);
            }
        });

        fetch(url_list_keywords, requestOptions).then(res => res.json()).then(data => {
            if (mounted5) {
                //console.log(data.data);
                var dataset = [{ id: 0, name: "All" }]
                data.data.forEach(element => {
                    dataset.push(element);
                });
                //console.log(dataset)
                setListKeywords(dataset);
            }
        });


        return function cleanup() {
            //mounted = false;
            mounted2 = false;
            mounted3 = false;
            mounted4 = false;
            mounted5 = false;
        }
    }, []);


    useEffect(() => {
        //alert('ready')
        const queryString = window.location.href;
        //console.log(queryString.replace("http://localhost:3000/#/",""));
        const urlParams = new URLSearchParams(queryString.replace(Config.base_domain + "/#/", ""));
        //console.log(urlParams.has('id'));
        if (urlParams.has('identifier')) {
            const id = urlParams.get('identifier');
            const requestOptions = {
                method: 'GET'
            };
            //-180, -90, 180, 90
            //100.0248/-1.1223/103.8146/2.9191
            fetch(Config.api_domain + "/harvestings/identifier/" + id, requestOptions).then(res => res.json()).then(data => {
                console.log(data);
                console.log(data.data);//
                //alert('a')
                if (data.data) {
                    var result = data.data
                    //alert(result.slice(0, 1)[0].identifier);
                    //setIdentifier(result.identifier);
                    var identifier = result.identifier;
                    //setTitle(result.slice(0, 1)[0].title);
                    //setAbstract(result.slice(0, 1)[0].abstract);
                    //setLayerName(result.title);
                    var layerName = result.title;
                    //setType(result.slice(0, 1)[0].data_type);
                    var json_obj = JSON.parse(result.distributions);
                    //var identifier = result.slice(0, 1)[0].identifier;
                    //var layerName = result.slice(0, 1)[0].title;
                    //var urlWMS = ""
                    //alert ('b')
                    var urlWMS;
                    var layerWMS;
                    var layerKML;
                    var layerGML;
                    var layerSHP;
                    var layerCSV;
                    var layerExcel;
                    var layerOriginal;
                    var layerPdf;
                    var layerGeojson;

                    var download_scheme = json_obj.filter(p => p.protocol === 'WWW:DOWNLOAD-1.0-http--download')
                    //console.log(row.references.filter(p => p.scheme === 'WWW:LINK-1.0-http--link'));
                    //console.log(row.references.filter(p => p.scheme === 'WWW:DOWNLOAD-1.0-http--download').filter(x => x.url.includes('wms?') && !x.url.includes('legend') && x.url.includes('png')));
                    //WWW:DOWNLOAD-1.0-http--download

                    //setUrlThumb(references[0].url);
                    //var thumbs = download_scheme.filter(x => x.url.toLowerCase().includes('thumbs'));
                    var original = download_scheme.filter(x => x.url.toLowerCase().includes('download'))
                    var getmap = download_scheme.filter(x => x.url.toLowerCase().includes('getmap'));
                    var jpeg = getmap.filter(x => x.url.toLowerCase().includes('jpeg'))
                    var png = getmap.filter(x => x.url.toLowerCase().includes('png'))

                    var getfeature = download_scheme.filter(x => x.url.toLowerCase().includes('getfeature'));

                    var kml = download_scheme.filter(x => x.url.toLowerCase().includes('kml'));

                    var raw = original.filter(x => !x.url.toLowerCase().includes('kml'))

                    if (raw.length > 0) {
                        //original dataset
                        var url_domain = raw[0].url.replace("91.225.61.58", "landscapeportal.org");
                        url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                        layerOriginal = url_domain
                    } else {
                        layerOriginal = ""
                    }

                    if (getmap.length > 0) {
                        //jpeg

                        if (jpeg.length > 0) {
                            var url_domain = jpeg[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            var main = url_domain.split("?")[0]
                            console.log(main)
                            var layer = url_domain.split("?")[1].split("&");
                            console.log(layer)
                            var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                            console.log(id)
                            urlWMS = main;
                            layerWMS = unescape(id);
                        } else if (png.length > 0) {
                            var url_domain = png[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            var main = url_domain.split("?")[0]
                            console.log(main)
                            var layer = url_domain.split("?")[1].split("&");
                            console.log(layer)
                            var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                            console.log(id)
                            urlWMS = main;
                            layerWMS = unescape(id);
                        } else {
                            urlWMS = "";
                            layerWMS = "";
                        }


                        var pdf = getmap.filter(x => x.url.toLowerCase().includes('pdf'))
                        if (pdf.length > 0) {
                            var url_domain = pdf[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            layerPdf = url_domain;
                        } else {
                            layerPdf = "";
                        }
                        //console.log(png)
                    } else {
                        urlWMS = "";
                        layerWMS = "";
                        layerPdf = ""
                    }

                    if (getfeature.length > 0) {
                        var shape = getfeature.filter(x => x.url.toLowerCase().includes('shape-zip'))
                        if (shape.length > 0) {
                            var url_domain = shape[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            layerSHP = url_domain
                        } else {
                            layerSHP = ""
                        }
                        var csv = getfeature.filter(x => x.url.toLowerCase().includes('csv'))
                        if (csv.length > 0) {
                            var url_domain = csv[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            layerCSV = url_domain
                        } else {
                            layerCSV = ""
                        }
                        var excel = getfeature.filter(x => x.url.toLowerCase().includes('excel'))
                        if (excel.length > 0) {
                            var url_domain = excel[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            layerExcel = url_domain
                        } else {
                            layerExcel = ""
                        }

                        var gml = getfeature.filter(x => x.url.toLowerCase().includes('gml2'))
                        if (gml.length > 0) {
                            var url_domain = gml[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            layerGML = url_domain
                        } else {
                            layerGML = ""
                        }

                        var geojson = getfeature.filter(x => x.url.toLowerCase().includes('json'))
                        if (geojson.length > 0) {
                            var url_domain = geojson[0].url.replace("91.225.61.58", "landscapeportal.org");
                            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                            layerGeojson = url_domain
                        } else {
                            layerGeojson = ""
                        }
                    } else {
                        layerSHP = ""
                        layerCSV = ""
                        layerExcel = ""
                        layerGML = ""
                        layerGeojson = ""
                    }

                    if (kml.length > 0) {
                        var url_domain = kml[0].url.replace("91.225.61.58", "landscapeportal.org");
                        url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                        layerKML = url_domain;
                    } else {
                        layerKML = "";
                    }

                    /*
                    var schemas = json_obj.filter(p => p.scheme === 'WWW:DOWNLOAD-1.0-http--download');
                    if (schemas.filter(x => x.url.includes('wms?')).length > 0) {
                        var wms = schemas.filter(x => x.url.includes('wms?') && !x.url.includes('legend') && x.url.includes('png'));
                        console.log(wms[0].url.split("&")[0]);
                        var main = wms[0].url.split("&")[0].split("?")[0]
                        var layer = wms[0].url.split("&")[0].split("?")[1].replace("layers=", "")
                        urlWMS = main;
                        layerWMS = unescape(layer);
                        setUrlThumb(Config.proxy_domain + wms[0].url);
                    } else {
                        var ogc = json_obj.filter(p => p.scheme === 'OGC:WMS');
                        //console.log(ogc)

                        if (ogc.length > 0) {
                            console.log(ogc[0].url + 'layers=' + result.identifier)
                            urlWMS = ogc[0].url
                            layerWMS = result.identifier;
                        } else {
                            var thumbs = schemas.filter(x => x.url.includes('thumbs'))
                            if (thumbs.length > 0) {
                                urlWMS = "";
                                layerWMS = "";
                                setUrlThumb(Config.proxy_domain + thumbs[0].url);
                            } else {
                                urlWMS = "";
                                layerWMS = "";
                                setUrlThumb(no_thumb);
                            }
                        }

                    }
                    if (schemas.filter(x => x.url.includes('kml?')).length > 0) {
                        var kml = schemas.filter(x => x.url.includes('download'));
                        layerKML = kml[0].url
                    } else {
                        layerKML = "";
                    }
                    if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                        var gml = schemas.filter(x => x.url.includes('gml2'));
                        layerGML = gml[0].url;
                    } else {
                        layerGML = "";
                    }
                    if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                        var shp = schemas.filter(x => x.url.includes('SHAPE-ZIP'));
                        layerSHP = shp[0].url;
                    } else {
                        layerSHP = "";
                    }
                    if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                        var csv = schemas.filter(x => x.url.includes('csv'));
                        layerCSV = csv[0].url;
                    } else {
                        layerCSV = "";
                    }
                    if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                        var excel = schemas.filter(x => x.url.includes('excel'));
                        layerExcel = excel[0].url;
                    } else {
                        layerExcel = "";
                    }
                    */
                    //console.log(identifier);
                    //alert('dsdsad')
                    props.setMapLayer(oldArray => [...oldArray, { id: identifier, title: layerName, server: 'geoserver', tipe: 'wms', url: urlWMS, layer: layerWMS, original: layerOriginal, pdf: layerPdf, geojson: layerGeojson, kml: layerKML, gml: layerGML, shp: layerSHP, csv: layerCSV, excel: layerExcel, metadata: true, table: layerGeojson ? true : false, visible: true, opacity: 1 }])
                    props.viewMetadata(identifier)
                    props.zoomToMap(identifier)
                    /*
                    var schemas = json_obj.filter(p => p.scheme === 'WWW:DOWNLOAD-1.0-http--download');
                    if (schemas.filter(x => x.url.includes('wms?')).length > 0) {
                      //console.log(schemas)
                      var wms = schemas.filter(x => x.url.includes('wms?') && !x.url.includes('legend') && x.url.includes('png'));
                      //console.log(wms)
                      //alert('UE : ' + wms[0].url.split("&")[0])
                      //setLayerWMS(wms[0].url.split("&")[0]);
                      //props.setMapLayer(oldArray => [...oldArray, { id: result.slice(0, 1)[0].id, title: result.slice(0, 1)[0].title, tipe: 'wms', layer: wms[0].url.split("&")[0], visible: true }]);
                      //setUrlThumb(wms[0].url);
                    } else {
                      var ogc = json_obj.filter(p => p.scheme === 'OGC:WMS');
                      //console.log(ogc)
          
                      if (ogc.length > 0) {
                        //console.log(ogc[0].url + 'layers=' + result.slice(0, 1)[0].identifier)
                        //setLayerWMS(ogc[0].url + 'layers=' + result.slice(0, 1)[0].identifier);
                        //props.setMapLayer(oldArray => [...oldArray, { id: result.slice(0, 1)[0].id, title: result.slice(0, 1)[0].title, tipe: 'wms', layer: ogc[0].url + 'layers=' + result.slice(0, 1)[0].identifier, visible: true }]);
                      } else {
                        var thumbs = schemas.filter(x => x.url.includes('thumbs'))
                        if (thumbs.length > 0) {
                          //setLayerWMS("");
                          //setUrlThumb(thumbs[0].url);
                        } else {
                          //setLayerWMS("");
                          //setUrlThumb(no_thumb);
                        }
                      }
          
                    }*/

                }

            });
        }

    }, []);

    useEffect(() => {

        if (props.dataAll) {

            const requestOptions = {
                method: 'GET'
            };
            //-180, -90, 180, 90
            //100.0248/-1.1223/103.8146/2.9191
            setIdOrganization(0)
            setIdTheme(0)
            fetch(url_list_harvesting + props.bbox[0].toFixed(6) + "/" + props.bbox[1].toFixed(6) + "/" + props.bbox[2].toFixed(6) + "/" + props.bbox[3].toFixed(6), requestOptions).then(res => res.json()).then(data => {

                //console.log(data.data)

                var result = data.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
                setData(result);//.slice(0, 10));
                //setDataAll(result);
                setNumberData(result.length);

                //console.log(result.slice(0,1)[0].references);
                setDataAktif(null, result.slice(0, 1)[0])

            })
        }
    }, [props.bbox, no_thumb, url_list_harvesting]);

    function setDataAktif(e, row) {
        //alert(id)
        //var list = document.getElementsByClassName("label-menu");
        var aktif = document.getElementsByClassName("bg-kuning");
        if (aktif.length > 0)
            aktif[0].classList.remove("bg-kuning");
        if (e !== null)
            e.target.parentNode.classList.add("bg-kuning");
        load_aktif(row)
    }

    function load_aktif(row) {
        if (row) {
            setTitle(row.title);
            setAbstract(row.abstract);
            setIdentifier(row.identifier);
            setLayerName(row.title);
            setType(row.data_type);
            setOrganization(row.organizations.name);
            setSubjects(row.keywords);
            //console.log(row.references);

            var json_obj = JSON.parse(row.distributions);
            var download_scheme = json_obj.filter(p => p.protocol === 'WWW:DOWNLOAD-1.0-http--download')
            //console.log(row.references.filter(p => p.scheme === 'WWW:LINK-1.0-http--link'));
            //console.log(row.references.filter(p => p.scheme === 'WWW:DOWNLOAD-1.0-http--download').filter(x => x.url.includes('wms?') && !x.url.includes('legend') && x.url.includes('png')));
            //WWW:DOWNLOAD-1.0-http--download

            //setUrlThumb(references[0].url);
            var thumbs = download_scheme.filter(x => x.url.toLowerCase().includes('thumbs'));
            var original = download_scheme.filter(x => x.url.toLowerCase().includes('download'))
            var getmap = download_scheme.filter(x => x.url.toLowerCase().includes('getmap'));
            var jpeg = getmap.filter(x => x.url.toLowerCase().includes('jpeg'))
            var png = getmap.filter(x => x.url.toLowerCase().includes('png'))

            var getfeature = download_scheme.filter(x => x.url.toLowerCase().includes('getfeature'));

            var kml = download_scheme.filter(x => x.url.toLowerCase().includes('kml'));

            if (thumbs.length > 0) {
                setUrlThumb(Config.proxy_domain + thumbs[0].url);
            } else {

                if (png.length > 0) {
                    var url_domain = png[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setUrlThumb(Config.proxy_domain + url_domain);
                } else if (jpeg.length) {
                    setUrlThumb(Config.proxy_domain + jpeg[0].url);
                } else {
                    setUrlThumb(no_thumb);
                }
            }

            var raw = original.filter(x => !x.url.toLowerCase().includes('kml'))
            console.log(raw)
            console.log(original)
            if (raw.length > 0) {
                //original dataset
                var url_domain = raw[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerOriginal(url_domain);
            } else {
                setLayerOriginal("")
            }

            if (getmap.length > 0) {
                //jpeg

                if (jpeg.length > 0) {
                    var url_domain = jpeg[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    var main = url_domain.split("?")[0]
                    console.log(main)
                    var layer = url_domain.split("?")[1].split("&");
                    console.log(layer)
                    var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                    console.log(id)
                    setUrlWMS(main);
                    setLayerWMS(unescape(id));
                } else if (png.length > 0) {
                    var url_domain = png[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    var main = url_domain.split("?")[0]
                    console.log(main)
                    var layer = url_domain.split("?")[1].split("&");
                    console.log(layer)
                    var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                    console.log(id)
                    setUrlWMS(main);
                    setLayerWMS(unescape(id));
                } else {
                    setUrlWMS("");
                    setLayerWMS("");
                }


                var pdf = getmap.filter(x => x.url.toLowerCase().includes('pdf'))
                if (pdf.length > 0) {
                    var url_domain = pdf[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setLayerPdf(url_domain);
                } else {
                    setLayerPdf("")
                }
                //console.log(png)
            } else {
                setUrlWMS("");
                setLayerWMS("");
                setLayerPdf("")
            }

            setDataAttribute()

            if (getfeature.length > 0) {
                var shape = getfeature.filter(x => x.url.toLowerCase().includes('shape-zip'))
                if (shape.length > 0) {
                    var url_domain = shape[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setLayerSHP(url_domain)
                } else {
                    setLayerSHP("")
                }
                var csv = getfeature.filter(x => x.url.toLowerCase().includes('csv'))
                if (csv.length > 0) {
                    var url_domain = csv[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setLayerCSV(url_domain)
                } else {
                    setLayerCSV("")
                }
                var excel = getfeature.filter(x => x.url.toLowerCase().includes('excel'))
                if (excel.length > 0) {
                    var url_domain = excel[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setLayerExcel(url_domain)
                } else {
                    setLayerExcel("")
                }

                var gml = getfeature.filter(x => x.url.toLowerCase().includes('gml2'))
                if (gml.length > 0) {
                    var url_domain = gml[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setLayerGML(url_domain)
                } else {
                    setLayerGML("")
                }

                var geojson = getfeature.filter(x => x.url.toLowerCase().includes('json'))
                if (geojson.length > 0) {
                    var url_domain = geojson[0].url.replace("91.225.61.58", "landscapeportal.org");
                    url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                    setLayerGeojson(url_domain)
                    load_info_attribute(url_domain)
                } else {
                    setLayerGeojson("")
                }
            } else {
                setLayerSHP("")
                setLayerCSV("")
                setLayerExcel("")
                setLayerGML("")
                setLayerGeojson("")
            }

            if (kml.length > 0) {
                setLayerKML(kml[0].url);
            } else {
                setLayerKML("");
            }


            //console.log(json_obj)
            /*
            var ows = false;
            if (schemas.filter(x => x.url.includes('ows?')).length > 0) {
                var wms = schemas.filter(x => x.url.includes('ows?') && x.url.includes('png'))
                console.log(wms)
                var main = wms[0].url.split("?")[0]
                console.log(main)
                var layer = wms[0].url.split("?")[1].split("&");
                console.log(layer)
                var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                console.log(id)
                setUrlWMS(main);
                setLayerWMS(unescape(id));
                //load_info_attribute(main+"?layers="+unescape(id));
                //setUrlThumb(Config.proxy_domain + wms[0].url);
                ows = true
            } else if (schemas.filter(x => x.url.includes('wms?')).length > 0) {
                if (!ows) {
                    var wms = schemas.filter(x => x.url.includes('wms?') && !x.url.includes('legend') && x.url.includes('png'));
                    console.log(wms[0].url.split("&")[0]);
                    var main = wms[0].url.split("&")[0].split("?")[0]
                    var layer = wms[0].url.split("&")[0].split("?")[1].replace("layers=", "")
                    setUrlWMS(main);
                    setLayerWMS(unescape(layer));
                    //setUrlThumb(Config.proxy_domain + wms[0].url);
                    //alert(wms[0].url.split("&")[0])
                    load_info_attribute(wms[0].url.split("&")[0]);
                }
            } else {
                var ogc = json_obj.filter(p => p.scheme === 'OGC:WMS');
                //console.log(ogc)
    
                if (ogc.length > 0) {
                    //console.log(ogc[0].url + 'layers=' + row.identifier)
                    setUrlWMS(ogc[0].url)
                    setLayerWMS(row.identifier);
                    setUrlThumb(no_thumb);
                    load_info_attribute(ogc[0].url + 'layers=' + row.identifier);
                } else {
                    var thumbs = schemas.filter(x => x.url.includes('thumbs'))
                    if (thumbs.length > 0) {
                        setUrlWMS("");
                        setLayerWMS("");
                        setUrlThumb(Config.proxy_domain + thumbs[0].url);
                    } else {
                        setUrlWMS("");
                        setLayerWMS("");
                        setUrlThumb(no_thumb);
                    }
                }
    
            }
            if (schemas.filter(x => x.url.includes('kml?')).length > 0) {
                var kml = schemas.filter(x => x.url.includes('download'));
                setLayerKML(kml[0].url);
            } else {
                setLayerKML("");
            }
    
            if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                var gml = schemas.filter(x => x.url.includes('gml2'));
                setLayerGML(gml[0].url);
            } else {
                setLayerGML("");
            }
            if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                var shp = schemas.filter(x => x.url.includes('SHAPE-ZIP'));
                setLayerSHP(shp[0].url);
            } else {
                setLayerSHP("");
            }
            if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                var csv = schemas.filter(x => x.url.includes('csv'));
                setLayerCSV(csv[0].url);
            } else {
                setLayerCSV("");
            }
            if (schemas.filter(x => x.url.includes('wfs?')).length > 0) {
                var excel = schemas.filter(x => x.url.includes('excel'));
                setLayerExcel(excel[0].url);
            } else {
                setLayerExcel("");
            }
            */
        }
    }

    function load_info_attribute(url) {

        const requestOptions = {
            method: 'GET'
        };
        //http://sumbarprov.ina-sdi.or.id:8080/geoserver/wfs?SERVICE=WfS&REQUEST=GetFeature&VERSION=2.0.0&typeName=ADMIN:administrasi_ar_250k_130020201203152021&featureID=1&outputFormat=application/json
        var url_replace = url.replace("GetFeature", "DescribeFeatureType").replace("json", "application/json")
        //http://landscapeportal.org/geoserver/wfs?typename=geonode%3Akenya_nyando_basin_landtenure1964&outputFormat=application/json&version=1.0.0&request=DescribeFeatureType&service=WFS
        console.log(url_replace)
        fetch(Config.proxy_domain + url_replace, requestOptions).then(res => res.json()).then(data => {
            if (data) {
                console.log(data)
                //    console.log(data.featureTypes[0])
                console.log(data.featureTypes[0].properties)
                setDataAttribute(data.featureTypes[0].properties);
            } else {
                setDataAttribute()
            }
        })

        /*
        console.log(url);
      
        var part = url.split("?")
        var main = part[0]
        var layer = part[1]
        //console.log(part)
        //console.log(url)
        //https://geonode.cifor.org/geoserver/ows?service=WFS&version=1.0.0&request=DescribeFeatureType&typename=geonode%3AIDN_Bungo_Landcover1999_CIFOR_20100&outputFormat=Application/json&srs=EPSG%3A4326&srsName=EPSG%3A4326&
        var urlnya = main + '?SERVICE=WMS&REQUEST=DescribeLayer&VERSION=1.1.1&' + layer + '&outputFormat=application/json';
        //console.log(urlnya);
        fetch(Config.proxy_domain + urlnya, requestOptions).then(res => res.json()).then(data => {
            //console.log(data)
            //console.log(data.layerDescriptions[0])
            //console.log(data.layerDescriptions[0].owsURL)
            //console.log(data.layerDescriptions[0].typeName)
            if (data) {
                //http://sumbarprov.ina-sdi.or.id:8080/geoserver/wfs?SERVICE=WfS&REQUEST=GetFeature&VERSION=2.0.0&typeName=ADMIN:administrasi_ar_250k_130020201203152021&featureID=1&outputFormat=application/json

                var urlnya2 = data.layerDescriptions[0].owsURL + "?SERVICE=WFS&REQUEST=DescribeFeatureType&VERSION=1.0.0&typeName=" + data.layerDescriptions[0].typeName + "&outputFormat=application/json"
                fetch(Config.proxy_domain + urlnya2, requestOptions).then(res => res.json()).then(data => {
                    console.log(data)
                    //    console.log(data.featureTypes[0])
                    console.log(data.featureTypes[0].properties)
                    setDataAttribute(data.featureTypes[0].properties);
                })
            } else {
                setDataAttribute()
            }
            //http://sumbarprov.ina-sdi.or.id:8080/geoserver/wfs?SERVICE=WfS&REQUEST=DescribeFeatureType&VERSION=1.1.1&typeName=ADMIN:administrasi_ar_250k_130020201203152021&outputFormat=application/json
            //var urlnya2 = data.layerDescriptions[0].owsURL + "?SERVICE=WfS&REQUEST=DescribeFeatureType&VERSION=1.1.1&typeName=" + data.layerDescriptions[0].typeName + "&outputFormat=application/json"
            //fetch(urlnya2, requestOptions).then(res => res.json()).then(data => {
            //    console.log(data)
            //    console.log(data.featureTypes[0])
            //    console.log(data.featureTypes[0].properties)
            //   setDataAttribute(data.featureTypes[0].properties)
            //})

        }).catch(err => { setDataAttribute(); console.log(err) });

        /*
        var ext = '&SERVICE=WMS&&REQUEST=DescribeLayer&VERSION=1.1.1&outputFormat=application/json'
        console.log(Config.api_domain +'/proxy/p/landscapeportal.org/geoserver/wms?layers=geonode%3Akenya_nyando_basin_landtenure1964'+ext);
        fetch(Config.api_domain +'/proxy/p/landscapeportal.org/geoserver/wms?layers=geonode%3Akenya_nyando_basin_landtenure1964'+ext , requestOptions).then(res => res.json()).then(data => {
            console.log(data)
        });
        /
        /*
        var urlnya = 'http://sumbarprov.ina-sdi.or.id:8080/geoserver/wms?SERVICE=WMS&REQUEST=DescribeLayer&VERSION=1.1.1&LAYERS=ADMIN:administrasi_ar_250k_130020201203152021&outputFormat=application/json';
        fetch(urlnya, requestOptions).then(res => res.json()).then(data => {
            console.log(data)
            console.log(data.layerDescriptions[0])
            console.log(data.layerDescriptions[0].owsURL)
            console.log(data.layerDescriptions[0].typeName)
            //http://sumbarprov.ina-sdi.or.id:8080/geoserver/wfs?SERVICE=WfS&REQUEST=DescribeFeatureType&VERSION=1.1.1&typeName=ADMIN:administrasi_ar_250k_130020201203152021&outputFormat=application/json
            var urlnya2 = data.layerDescriptions[0].owsURL + "?SERVICE=WfS&REQUEST=DescribeFeatureType&VERSION=1.1.1&typeName=" + data.layerDescriptions[0].typeName + "&outputFormat=application/json"
            fetch(urlnya2, requestOptions).then(res => res.json()).then(data => {
                console.log(data)
                console.log(data.featureTypes[0])
                console.log(data.featureTypes[0].properties)
                setDataAttribute(data.featureTypes[0].properties)
            })

        });
        */



        //            //https://geonode.cifor.org/geoserver/wms?SERVICE=WMS&REQUEST=DescribeLayer&VERSION=1.1.1&LAYERS=geonode:borneo_intactloggedforest_2013&outputFormat=application/json


    }


    function getRowsData() {
        if (typeof (data) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (data !== null) {

                if (data.length > 0) {

                    return data.map((row, index) => {
                        //console.log(row)
                        if (index === 0)
                            return <Row key={index} className="mx-0 border-bottom bg-kuning font-11" onClick={(e) => setDataAktif(e, row)}><Col xs={8} className="px-1 breaking ">{row.title}</Col><Col xs={4} className="px-2">{row.publication_date}</Col></Row>
                        else
                            return <Row key={index} className="mx-0 border-bottom font-11" onClick={(e) => setDataAktif(e, row)}><Col xs={8} className="px-1 breaking">{row.title}</Col><Col xs={4} className="px-2">{row.publication_date}</Col></Row>

                        ///cr = cr + 1
                        //return <tr><td className="p-2">{cr}</td><td className="p-2">{row.name}</td><td className="p-2">{row.sj}</td><td className="p-2">{row.kategori}</td><td className="p-2">{row.katalog}</td><td className="p-2 pointer"> <FileEarmarkText size={14} onClick={() => showMetadata(row)} className="mr-2" /> {' '} {row.viewable === 'true' ? <Eye onClick={() => showView(row)} className="mr-2" size={14} /> : ""} {' '} {row.downloadable === 'true' ? <Download size={12}  onClick={() => showDownload(row)} /> : ""}  </td></tr>
                    })
                } else {
                    return null
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }

    function getRowsAttribute() {
        if (typeof (dataAttribute) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (dataAttribute !== null) {

                if (dataAttribute.length > 0) {

                    return dataAttribute.map((row, index) => {
                        //console.log(row)
                        return (
                            <Row className="px-3" key={"att" + index}>
                                <Col xs={1} className="px-1 border-bottom"> </Col>
                                <Col xs={4} className="px-1 border-bottom">{row.name}</Col>
                                <Col xs={4} className="px-1 border-bottom">{row.localType}</Col>
                                <Col xs={3} className="px-1 border-bottom"></Col>
                            </Row>
                        )
                        ///cr = cr + 1
                        //return <tr><td className="p-2">{cr}</td><td className="p-2">{row.name}</td><td className="p-2">{row.sj}</td><td className="p-2">{row.kategori}</td><td className="p-2">{row.katalog}</td><td className="p-2 pointer"> <FileEarmarkText size={14} onClick={() => showMetadata(row)} className="mr-2" /> {' '} {row.viewable === 'true' ? <Eye onClick={() => showView(row)} className="mr-2" size={14} /> : ""} {' '} {row.downloadable === 'true' ? <Download size={12}  onClick={() => showDownload(row)} /> : ""}  </td></tr>
                    })
                } else {
                    return (
                        <Row className="px-3">
                            <Col className="px-1"> No attribute found</Col>
                        </Row>
                    )
                }
            } else {
                return (
                    <Row className="px-3">
                        <Col className="px-1"> No attribute found</Col>
                    </Row>
                )
            }
        } else {
            return (
                <Row className="px-3">
                    <Col className="px-1"> No attribute found</Col>
                </Row>
            )
        }
    }

    function getOrganizations() {
        if (typeof (listOrganizations) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listOrganizations !== null) {
                if (listOrganizations.length > 0) {
                    return listOrganizations.map((row, index) => {
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

    function getFlagship() {
        if (typeof (listFlagship) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listFlagship !== null) {
                if (listFlagship.length > 0) {
                    return listFlagship.map((row, index) => {
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

    function getThemes() {
        if (typeof (listThemes) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listThemes !== null) {
                if (listThemes.length > 0) {
                    return listThemes.map((row, index) => {
                        //console.log(row.id, index)
                        return <option key={index} value={row.name}>{row.name}</option>
                    })
                }
            } else {
                return <option></option>
            }
        } else {
            return <option></option>
        }
    }


    function getYears() {
        if (typeof (listYears) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listYears !== null) {
                if (listYears.length > 0) {
                    return listYears.map((row, index) => {
                        //console.log(row.id, index)
                        return <option key={index} value={row.year}>{row.year}</option>
                    })
                }
            } else {
                return <option></option>
            }
        } else {
            return <option></option>
        }
    }

    function getKeywords() {
        if (typeof (listKeywords) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (listKeywords !== null) {
                if (listKeywords.length > 0) {
                    return listKeywords.map((row, index) => {
                        //console.log(row.id, index)
                        return <option key={index} value={row.name}>{row.name}</option>
                    })
                }
            } else {
                return <option></option>
            }
        } else {
            return <option></option>
        }
    }


    function addAndGo() {
        props.setBrowse(false)
        props.setMapLayer(oldArray => [...oldArray, { id: identifier, title: layerName, server: 'geoserver', tipe: 'wms', url: urlWMS, layer: layerWMS, original: layerOriginal, pdf: layerPdf, geojson: layerGeojson, kml: layerKML, gml: layerGML, shp: layerSHP, csv: layerCSV, excel: layerExcel, metadata: true, table: layerGeojson ? true : false, visible: true, opacity: 1 }])
    }

    function addAndKeep() {
        props.setMapLayer(oldArray => [...oldArray, { id: identifier, title: layerName, server: 'geoserver', tipe: 'wms', url: urlWMS, layer: layerWMS, original: layerOriginal, pdf: layerPdf, geojson: layerGeojson, kml: layerKML, gml: layerGML, shp: layerSHP, csv: layerCSV, excel: layerExcel, metadata: true, table: layerGeojson ? true : false, visible: true, opacity: 1 }])
    }


    function handlingThemes(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdTheme(e.target.value);
        console.log(e.target.value);
        setIdOrganization(0);
        setIdYear(0);
        setIdKeywords("All");
        setIdFlagship(0)
        setQuery("")
        if (e.target.value === "0" || e.target.value === "All") {
            setData(props.dataAll);//.slice(0, 10));
            setNumberData(props.dataAll.length);
            setDataAktif(null, props.dataAll.slice(0, 1)[0])
        } else {
            //console.log(e.target);
            load_theme(e.target.value)
        }

    }

    function handlingOrganizations(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdOrganization(e.target.value);
        setIdYear(0);
        setIdKeywords("All");
        setIdFlagship(0)
        setQuery("")
        if (e.target.value === "0" || e.target.value === "All") {
            //console.log(data)

            //setData(dataAll);//.slice(0, 10));
            //setNumberData(dataAll.length);
            //setDataAktif(null, dataAll.slice(0, 1)[0])
            //var result = dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
            //setData(result);//.slice(0, 10));
            //setNumberData(result.length);
            //setDataAktif(null, result.slice(0, 1)[0])
            load_theme(idTheme)
            //alert(idTheme)
            //alert(e.target.value)
        } else {
            load_organizations(e.target.value)
        }
    }



    function handlingYears(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdYear(e.target.value);
        setIdKeywords("All");
        setIdFlagship(0)
        setQuery("")
        if (e.target.value === "0" || e.target.value === "All") {
            //console.log(data)
            //setData(dataAll);//.slice(0, 10));
            //setNumberData(dataAll.length);
            //setDataAktif(null, dataAll.slice(0, 1)[0])
            //var themes = dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
            //var organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
            load_organizations(idOrganization)
        } else {
            load_years(e.target.value)
        }
    }

    function handlingKeywords(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdKeywords(e.target.value);
        setIdFlagship(0)
        setQuery("")
        load_keywords(e.target.value)
        if (e.target.value === "0" || e.target.value === "All") {
            //console.log(data)
            //setData(dataAll);//.slice(0, 10));
            //setNumberData(dataAll.length);
            //setDataAktif(null, dataAll.slice(0, 1)[0])
            load_years(idYear)
        } else {
            load_keywords(e.target.value)
        }
    }
    function handlingFlagship(e) {
        //console.log(e.target.value + " " + e.target.selectedOptions[0].text );
        setIdFlagship(e.target.value);
        setQuery("")
        if (e.target.value === "0" || e.target.value === "All") {
            //console.log(data)
            //setData(dataAll);//.slice(0, 10));
            //setNumberData(dataAll.length);
            //setDataAktif(null, dataAll.slice(0, 1)[0])
            load_keywords(idKeywords)
        } else {
            load_flagship(e.target.value)
        }
    }

    function load_theme(key) {
        //console.log(dataAll, ' ', key);

        //var result = data.filter(p => {
        //console.log(data);

        //var result = dataAll.filter(p => p.organizations.id === id);
        var result;
        if (key === 0 || key === "All") {
            result = props.dataAll;
        } else {
            result = props.dataAll.filter(p => p.keywords.toLowerCase().includes(key.toLowerCase()));
        }

        setData(result);//.slice(0, 10));
        setNumberData(result.length);

        if (result.length > 0) {
            setDataAktif(null, result.slice(0, 1)[0])
        } else {
            emptyDataset();
        }

    }


    function load_organizations(id) {
        //console.log(data);

        //var result = data.filter(p => {
        //console.log(data);
        var themes;
        if (idTheme === 0 || idTheme === "All") {
            themes = props.dataAll;
        } else {
            //alert(idTheme)
            themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
        }
        var result
        if (id === 0 || id === "All") {
            result = themes;
        } else {
            result = themes.filter(p => p.organizations.id === parseInt(id));
        }


        setData(result);//.slice(0, 10));
        setNumberData(result.length);

        if (result.length > 0) {
            setDataAktif(null, result.slice(0, 1)[0])
        } else {
            emptyDataset();
        }
    }

    function load_years(val) {
        //console.log(data);

        //var result = data.filter(p => {
        //console.log(data);
        var themes;
        var organizations;
        if (idTheme === 0 || idTheme === "All") {
            themes = props.dataAll;
        } else {
            //alert(idTheme)
            themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
        }

        if (idOrganization === 0 || idOrganization === "All") {
            organizations = themes;
        } else {
            organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
        }

        //var result = themes.filter(p => p.organizations.id === parseInt(id));
        var result;
        if (val === 0 || val === "All") {
            result = organizations;
        } else {
            result = organizations.filter(p => p.publication_date.substring(0, 4) === val);
        }

        setData(result);//.slice(0, 10));
        setNumberData(result.length);

        if (result.length > 0) {
            setDataAktif(null, result.slice(0, 1)[0])
        } else {
            emptyDataset();
        }
    }
    function load_keywords(val) {
        //console.log(data);

        //var result = data.filter(p => {
        //console.log(data);
        var themes;
        var organizations;
        var years;
        if (idTheme === 0 || idTheme === "All") {
            themes = props.dataAll;
        } else {
            //alert(idTheme)
            themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
        }

        if (idOrganization === 0 || idOrganization === "All") {
            organizations = themes;
        } else {
            organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
        }

        if (idYear === 0 || idYear === "All") {
            years = organizations;
        } else {
            years = organizations.filter(p => p.publication_date.substring(0, 4) === idYear);
        }
        //alert(idYear)
        var result;
        if (val === 0 || val === "All") {
            result = years;
        } else {
            result = years.filter(p => p.keywords.toLowerCase().includes(val.toLowerCase()));
        }

        setData(result);//.slice(0, 10));
        setNumberData(result.length);

        if (result.length > 0) {
            setDataAktif(null, result.slice(0, 1)[0])
        } else {
            emptyDataset();
        }
    }


    function load_flagship(id) {
        //console.log(data);

        //var result = data.filter(p => {
        //console.log(data);
        var q = "flagship";
        var themes;
        var organizations;
        var years;
        var keywords;
        if (idTheme === 0 || idTheme === "All") {
            themes = props.dataAll;
        } else {
            //alert(idTheme)
            themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
        }

        if (idOrganization === 0 || idOrganization === "All") {
            organizations = themes;
        } else {
            organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
        }

        if (idYear === 0 || idYear === "All") {
            years = organizations;
        } else {
            years = organizations.filter(p => p.publication_date.substring(0, 4) === idYear);
        }
        //alert(idYear)
        var keywords;
        if (idKeywords === 0 || idKeywords === "All") {
            keywords = years;
        } else {
            keywords = years.filter(p => p.keywords.toLowerCase().includes(idKeywords.toLowerCase()));
        }

        var result;
        if (id == 1) {
            result = keywords.filter(p => p.keywords.toLowerCase().includes(q.toLowerCase()));
        } else {
            result = keywords.filter(p => !p.keywords.toLowerCase().includes(q.toLowerCase()));
        }
        setData(result);//.slice(0, 10));
        setNumberData(result.length);

        if (result.length > 0) {
            setDataAktif(null, result.slice(0, 1)[0])
        } else {
            emptyDataset();
        }
    }


    function emptyDataset() {
        setIdentifier("");
        setTitle("");
        setAbstract("");
        setLayerName("");
        setType("");
        setUrlThumb(no_thumb);
        setSubjects("");
        setOrganization("");
    }



    function handleSearch(key) {
        // console.log(key);
        if (key.length < 2) {
            //alert('cari')
            //setData(dataAll);
            //setNumberData(dataAll.length);

            var themes;
            var organizations;
            var years;
            var keywords;
            if (idTheme === 0 || idTheme === "All") {
                themes = props.dataAll;
            } else {
                //alert(idTheme)
                themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
            }

            if (idOrganization === 0 || idOrganization === "All") {
                organizations = themes;
            } else {
                organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
            }

            if (idYear === 0 || idYear === "All") {
                years = organizations;
            } else {
                years = organizations.filter(p => p.publication_date.substring(0, 4) === idYear);
            }
            //alert(idYear)
            var keywords;
            if (idKeywords === 0 || idKeywords === "All") {
                keywords = years;
            } else {
                keywords = years.filter(p => p.keywords.toLowerCase().includes(idKeywords.toLowerCase()));
            }

            var result;
            var q = "flagship";
            if (idFlagship == 0) {
                result = keywords
            } else if (idFlagship == 1) {
                result = keywords.filter(p => p.keywords.toLowerCase().includes(q.toLowerCase()));
            } else {
                result = keywords.filter(p => !p.keywords.toLowerCase().includes(q.toLowerCase()));
            }


            setData(result);//.slice(0, 10));
            setNumberData(result.length);
        } else {
            var q = "flagship";
            var themes;
            var organizations;
            var years;
            var keywords;
            if (idTheme === 0 || idTheme === "All") {
                themes = props.dataAll;
            } else {
                //alert(idTheme)
                themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
            }

            if (idOrganization === 0 || idOrganization === "All") {
                organizations = themes;
            } else {
                organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
            }

            if (idYear === 0 || idYear === "All") {
                years = organizations;
            } else {
                years = organizations.filter(p => p.publication_date.substring(0, 4) === idYear);
            }
            //alert(idYear)
            var keywords;
            if (idKeywords === 0 || idKeywords === "All") {
                keywords = years;
            } else {
                keywords = years.filter(p => p.keywords.toLowerCase().includes(idKeywords.toLowerCase()));
            }

            var result;
            if (idFlagship == 0) {
                result = keywords
            } else if (idFlagship == 1) {
                result = keywords.filter(p => p.keywords.toLowerCase().includes(q.toLowerCase()));
            } else {
                result = keywords.filter(p => !p.keywords.toLowerCase().includes(q.toLowerCase()));
            }

            var resultQ = result.filter(p => p.title.toLowerCase().includes(key.toLowerCase()));

            setData(resultQ);//.slice(0, 10));
            setNumberData(resultQ.length);

            if (resultQ.length > 0) {
                setDataAktif(null, resultQ.slice(0, 1)[0])
            } else {
                emptyDataset();
            }

            setQuery(key);
        }

        setQuery(key);
    }

    function do_search() {
        // console.log(key);
        var key = query;

        if (key.length < 2) {
            //alert('cari')
            //setData(dataAll);
            //setNumberData(dataAll.length);
            var q = "flagship";
            var themes;
            var organizations;
            var years;
            var keywords;
            if (idTheme === 0 || idTheme === "All") {
                themes = props.dataAll;
            } else {
                //alert(idTheme)
                themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
            }

            if (idOrganization === 0 || idOrganization === "All") {
                organizations = themes;
            } else {
                organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
            }

            if (idYear === 0 || idYear === "All") {
                years = organizations;
            } else {
                years = organizations.filter(p => p.publication_date.substring(0, 4) === idYear);
            }
            //alert(idYear)
            var keywords;
            if (idKeywords === 0 || idKeywords === "All") {
                keywords = years;
            } else {
                keywords = years.filter(p => p.keywords.toLowerCase().includes(idKeywords.toLowerCase()));
            }

            var result;
            if (idFlagship == 1) {
                result = keywords.filter(p => p.keywords.toLowerCase().includes(q.toLowerCase()));
            } else {
                result = keywords.filter(p => !p.keywords.toLowerCase().includes(q.toLowerCase()));
            }
            setData(result);//.slice(0, 10));
            setNumberData(result.length);
        } else {
            var q = "flagship";
            var themes;
            var organizations;
            var years;
            var keywords;
            if (idTheme === 0 || idTheme === "All") {
                themes = props.dataAll;
            } else {
                //alert(idTheme)
                themes = props.dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
            }

            if (idOrganization === 0 || idOrganization === "All") {
                organizations = themes;
            } else {
                organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
            }

            if (idYear === 0 || idYear === "All") {
                years = organizations;
            } else {
                years = organizations.filter(p => p.publication_date.substring(0, 4) === idYear);
            }
            //alert(idYear)
            var keywords;
            if (idKeywords === 0 || idKeywords === "All") {
                keywords = years;
            } else {
                keywords = years.filter(p => p.keywords.toLowerCase().includes(idKeywords.toLowerCase()));
            }

            var result;
            if (idFlagship == 1) {
                result = keywords.filter(p => p.keywords.toLowerCase().includes(q.toLowerCase()));
            } else {
                result = keywords.filter(p => !p.keywords.toLowerCase().includes(q.toLowerCase()));
            }

            var resultQ = result.filter(p => p.title.toLowerCase().includes(key.toLowerCase()));

            setData(resultQ);//.slice(0, 10));
            setNumberData(resultQ.length);

            if (resultQ.length > 0) {
                setDataAktif(null, resultQ.slice(0, 1)[0])
            } else {
                emptyDataset();
            }

            setQuery(key);
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
        if (elmnt.id === "browse") {

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

    function viewSubject(){
        if(subjects){
            var s = JSON.parse(subjects);
            if (s){
                var list = []
                s.forEach(function(x) {
                    //console.log(x.keywords);
                    x.keywords.forEach(function(y){
                        list.push(y)
                    });
                });
                //console.log(s[0].keywords);
                //console.log(s[0].keywords.join(", "));
                //console.log(list)
                if (list)
                    return list.join(", ");
                else
                    return "";
            }
        }
    }


    return (
        <div id="browse" className={props.browse ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Data Browser<button type="button" className="close" onClick={() => props.setBrowse(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3 font-11">
                <Col lg={6} className="pt-1 px-1" id="browse-content">
                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Study Area</Col>
                        <Col xs={6} className="pl-1">
                            <Form.Control type="text" size="sm" value={props.areaName} className="font-11" disabled />
                        </Col>
                        <Col xs={2} className="px-0">
                            <Button size="sm" block variant="secondary" className="font-11 px-0" onClick={() => { setQuery(""); props.setArea(true) }} >Change</Button>
                        </Col>
                    </Row>
                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Theme</Col>
                        <Col xs={8} className="px-1">
                            <Form.Control size="sm" className="font-11" as="select" value={idTheme} onChange={e => handlingThemes(e)} >
                                {
                                    getThemes()
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Organizations</Col>
                        <Col xs={8} className="px-1">
                            <Form.Control size="sm" className="font-11" as="select" value={idOrganization} onChange={e => handlingOrganizations(e)} >
                                {
                                    getOrganizations()
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Year</Col>
                        <Col xs={8} className="px-1">
                            <Form.Control size="sm" className="font-11" as="select" value={idYear} onChange={e => handlingYears(e)} >
                                {
                                    getYears()
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Keywords</Col>
                        <Col xs={8} className="px-1">
                            <Form.Control size="sm" className="font-11" as="select" value={idKeywords} onChange={e => handlingKeywords(e)} >
                                {
                                    getKeywords()
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Flagship Status</Col>
                        <Col xs={8} className="px-1">
                            <Form.Control as="select" className="font-11" size="sm" value={idFlagship} onChange={e => handlingFlagship(e)} >
                                {
                                    getFlagship()
                                }
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1 pt-1">Title Search (any text) </Col>
                        <Col xs={8} className="px-1">
                            <Form.Control id="query_any" type="text" className="font-11" size="sm" placeholder="type here" value={query} onChange={e => handleSearch(e.target.value)} >
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="pt-1 px-3">
                        <Col xs={4} className="px-1"></Col>
                        <Col xs={8} className="px-1">
                            <Button size="sm" variant="secondary" className="font-11 py-0 float-right" onClick={() => do_search()} >Search</Button>
                        </Col>
                    </Row>
                </Col>
                <Col lg={4} className="px-1" id="description-content">
                    <div className="px-2 text-dark breaking"><b>Title</b>: {title}</div>
                    <div className="px-2 text-dark"><b>Type</b>: {type}</div>
                    <div className="px-2 text-dark"><b>Organization</b>: {organization}</div>
                    <div className="px-2 text-dark">
                        <b>Keywords</b>:
                        <div style={{ maxHeight: "60px", overflowY: "auto" }}>
                            {
                               viewSubject()
                            }
                        </div>
                    </div>
                    <div className="px-2 text-dark">
                        <b>Abstract</b>:<br />
                        <div style={{ maxHeight: "60px", overflowY: "auto" }}>
                            {abstract}
                        </div>
                    </div>
                </Col>
                <Col lg={2} className="text-center border-left p-2">
                    <b>Map Thumbnail</b>:
                    <br />
                    <img src={urlThumb} width="100%" alt="thumbnail" style={{ maxHeight: "150px", overflow: "hidden" }} />
                </Col>
            </Row>
            <Row className="px-2 font-11">
                <Col xs={12} lg={6} className="pt-1" id="available-content">
                    <div className="bg-light px-2 text-secondary font-weight-bold font-13">Available Dataset ({numberData})</div>
                    <Row className="px-3">
                        <Col xs={8} className="px-1 bg-light border-right">Title</Col>
                        <Col xs={4} className="px-1 bg-light">Modified</Col>
                    </Row>

                    <div style={{ maxHeight: "150px", overflowY: "auto", overflowX: "hidden" }} className="pointer">

                        {
                            getRowsData()
                        }

                    </div>
                    {
                        /*
                        <Row className="px-3">
                        <Col xs={4} className="px-1">A</Col>
                        <Col xs={4} className="px-1">Organization</Col>
                        <Col xs={2} className="px-1">Start Date</Col>
                        <Col xs={2} className="px-1">End Date</Col>
                    </Row>
                    <Row className="px-3">
                        <Col xs={4} className="px-1">B</Col>
                        <Col xs={4} className="px-1">Organization</Col>
                        <Col xs={2} className="px-1">Start Date</Col>
                        <Col xs={2} className="px-1">End Date</Col>
                    </Row>
                    <Row className="px-3">
                        <Col xs={4} className="px-1">C</Col>
                        <Col xs={4} className="px-1">Organization</Col>
                        <Col xs={2} className="px-1">Start Date</Col>
                        <Col xs={2} className="px-1">End Date</Col>
                    </Row>
                    <Row className="px-3">
                        <Col xs={4} className="px-1">D</Col>
                        <Col xs={4} className="px-1">Organization</Col>
                        <Col xs={2} className="px-1">Start Date</Col>
                        <Col xs={2} className="px-1">End Date</Col>
                    </Row>
                    <Row className="px-3">
                        <Col xs={4} className="px-1">E</Col>
                        <Col xs={4} className="px-1">Organization</Col>
                        <Col xs={2} className="px-1">Start Date</Col>
                        <Col xs={2} className="px-1">End Date</Col>
                    </Row>
                        */
                    }
                </Col>
                <Col xs={12} lg={6} className="pt-1 pr-3" id="attribute-content">
                    <div className="bg-light px-2 text-secondary font-weight-bold font-13">Dataset Attributes</div>
                    <Row className="px-3">
                        <Col xs={1} className="px-1 bg-light border-right"> </Col>
                        <Col xs={4} className="px-1 bg-light border-right">Name</Col>
                        <Col xs={4} className="px-1 bg-light">Type</Col>
                        <Col xs={3} className="px-1 bg-light"></Col>
                    </Row>
                    <div style={{ maxHeight: "150px", overflowY: "auto", overflowX: "hidden" }}>
                        {
                            getRowsAttribute()
                        }
                    </div>
                    {
                        /*
                                            <p className="text-center">attributes not found</p>

                         <Row className="px-3">
                         <Col xs={1} className="px-1"> </Col>
                         <Col xs={4} className="px-1">Attribute</Col>
                         <Col xs={3} className="px-1">Name</Col>
                         <Col xs={3} className="px-1">Type</Col>
                     </Row>
                         */
                    }

                </Col>
            </Row>
            <Row className="font-11 mt-2 mx-2 border-top">
                <Col xs={2} className="pt-1 px-1" id="available-content">

                </Col>
                <Col xs={2} className="pt-2 px-1" id="attribute-content">
                    <span className="float-right">Save as</span>
                </Col>
                <Col xs={8} className="pt-1 px-1" id="attribute-content">
                    <Form.Control type="text" size="sm" className="font-11" value={layerName} onChange={(e) => setLayerName(e.target.value)} >
                    </Form.Control>
                </Col>
            </Row>

            <div className="pointer pt-1 pr-2 font-weight-bold text-secondary">
                <Row>
                    <Col lg={6} className="d-none d-sm-block"></Col>
                    <Col className="ml-1"><Button size="sm" variant="secondary" className="font-11 py-0" block onClick={() => addAndKeep()} >Add and Continue Browsing</Button></Col>
                    <Col><Button size="sm" variant="secondary" block className="font-11 py-0" onClick={() => addAndGo()} >Add and Finish Browsing</Button></Col>

                </Row>

            </div>

        </div>
    );
}