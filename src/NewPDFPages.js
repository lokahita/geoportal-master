import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';

import north from './north2.PNG';
import Config from './config.json';

import logo_1 from './logo/CIFOR_green_vlr.png';
import logo_2 from './logo/agroforestry.png';
import logo_3 from './logo/Alliance_logos-ENGLISH.png';
import logo_4 from './logo/logo-cirad.png';
import logo_5 from './logo/catie.png';
import logo_6 from './logo/logo-inbar.png';
import logo_7 from './logo/logo-tropenbos-small.png';

import { ImageWMS as ImageWMSSource } from 'ol/source/';

export default function NewPDFPages(props) {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#ffffff'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

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
                        console.log(graphicUrl)

                        if (row.layer) {
                            //<img src={main + "?" + request} alt="alt" />
                            return (
                                <>
                                    <Text key={"text" + index} style={{ fontSize: '10px', marginBottom: 10 }} >{row.title}</Text>
                                    <Image crossOrigin="anonymous" referrerPolicy="origin" source={graphicUrl} key={"img" + index} />
                                </>
                            )
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

    return (
        <Document>
            <Page size={props.size} orientation={props.orientation} style={styles.page}>
                <View style={{
                    flex: 1,
                    height: '90vh',
                    marginTop: 30,
                    marginHorizontal: 10,
                    flexGrow: 4,
                    borderTop: 2, borderBottom: 2, borderLeft: 2, borderRight: 2, borderColor: '#22618F', borderStyle: 'solid'
                }}>
                    <View style={{
                        flex: 1,
                        height: 30,
                        paddingLeft: '10px',
                        paddingTop: '10px'
                    }}>
                        <Text style={{ fontSize: '24pt' }}>{props.title}</Text>
                    </View>
                    <View key="description" style={{
                        flex: 1,
                        height: 50,
                        paddingLeft: '10px'
                    }}>
                        <Text style={{ fontSize: '12pt' }}>{props.description}</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        flexGrow: 7
                    }}>
                        {props.data ? <Image source={props.data} width="100%" /> : <Text>please capture map first</Text>}
                    </View>
                    <View style={{
                        flex: 1,
                        height: 100,
                        flexDirection:'row',
                        marginLeft: "20px"
                    }}>
                        <View key="logo-1" style={{
                            flex: 1,
                            width: 80,
                            height: 80
                        }}>
                            <Image source={logo_1} style={{width:"30px"}}  />
                        </View>
                        <View key="logo-2" style={{
                            flex: 1,
                            width: 80,
                            height: 80
                        }}>
                            <Image source={logo_2} style={{width:"30px"}} />
                        </View>
                        <View key="logo-3" style={{
                            flex: 1,
                            width: 80,
                            height: 80,
                        }}>
                            <Image source={logo_3} style={{width:"60px"}}  />
                        </View>
                        <View key="logo-4" style={{
                            flex: 1,
                            width: 80,
                            height: 80,
                        }}>
                            <Image source={logo_4} style={{width:"60px"}}  />
                        </View>
                        <View key="logo-5" style={{
                            flex: 1,
                            width: 80,
                            height: 80,
                        }}>
                            <Image source={logo_5} style={{width:"60px"}}  />
                        </View>
                        <View key="logo-6" style={{
                            flex: 1,
                            width: 80,
                            height: 80,
                        }}>
                            <Image source={logo_6} style={{width:"40px"}}  />
                        </View>
                        <View key="logo-7" style={{
                            flex: 1,
                            width: 80,
                            height: 80,
                        }}>
                            <Image source={logo_7} style={{width:"30px"}}  />
                        </View>

                    </View>
                </View>
                <View style={{
                    flex: 1,
                    width: 100,
                    height: '90vh',
                    flexGrow: 1,
                    marginTop: 30,
                    marginRight: 10,
                    borderTop: 2, borderBottom: 2, borderLeft: 2, borderRight: 2, borderColor: '#22618F', borderStyle: 'solid'
                }}>
                    <View style={{
                        flex: 1,
                        width: 100,
                        height: 100,
                        margin: 'auto'

                    }}>
                        <Image source={north} style={{paddingTop:"10px", width:"80px", height: "80px"}} />
                    </View>
                    <View key="right" style={{
                        flex: 1,
                        width: 100,
                        height: 'auto',
                        flexGrow: 5,
                        marginTop: 10,
                        paddingLeft: '10px'
                    }} >
                        {
                            props.legend ? <Text style={{ fontSize: '12px', marginBottom: '5' }}>Legend</Text> : null
                        }
                        {
                            props.legend ? <Image source={props.dataClegend} width="100%" /> : null
                        }
                    </View>
                </View>
                {
                    /*
                    <View style={{
                        flex: 1,
                        flexGrow: 8,
                        margin: 10,
                        padding: 10,
                        border:'solid 3px #000'
                    }} >

                        {props.data ? <Image source={props.data} /> : <Text>please capture map first</Text>}
                    </View>
                    <View style={{
                        flex: 1,
                        flexGrow: 2,
                        border: 'solid 1px #000'
                    }}>
                        <View style={{
                            flex: 1,
                            margin: 10,
                            flexGrow: 3,
                        }}>
                            <Image source={north} width="100" height="100"  />
                        </View>
                        <View style={{
                            flex: 1,
                            marginTop: 0,
                            marginBottom: 10,
                            flexGrow: 0
                        }}>
                            <Text>{props.title}</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            marginTop: 20,
                            marginBottom: 10,
                            flexGrow: 2,
                        }}>
                            <Text style={{fontSize:'12px'}}>{props.description}</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            marginHorizontal: 10,
                            marginTop: 0,
                            flexGrow: 4,
                        }} />
                    </View>
                
                    *<View style={styles.section}>
                        <Text>{props.title}</Text>
                    </View>
                    <View style={styles.section}>
                        {props.data?<Image source={props.data} />:<Text>please capture map first</Text>}
                    </View>
                    <View style={styles.section}>
                        <Text>{props.description}</Text>
                    </View>
                    */
                }
            </Page>
        </Document>
    )
}