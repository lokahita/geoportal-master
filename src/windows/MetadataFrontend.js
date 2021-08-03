import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';

import Config from '../config.json';
import { useState, useEffect } from 'react';

export default function Metadata(props) {
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
        if (elmnt.id === "metadata") {
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

    useEffect(() => {

        if (props.identifierMetadata) {

            const requestOptions = {
                method: 'GET'
            };

            //alert(props.identifierMetadata)

            fetch(url_list_harvesting + props.identifierMetadata, requestOptions).then(res => res.json()).then(data => {
                console.log(data);
                console.log(data.data);
                setData(data.data)
            })
        }

    }, [props.identifierMetadata]);

    function viewSubjects(subjects){
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

    function viewReferences(subjects){
        if(subjects){
            var s = JSON.parse(subjects);
            if (s){
                var list = "";
                s.forEach(function(x) {
                    console.log(x);
                    console.log(x.name);
                    if (x.name !== null)
                        list +=  x.protocol + "<br /><a href='"+ x.url+ "' target='_blank' >" + x.name + "</a><hr />";
                    //+ <br /> + x.url + <hr /> + <br /> 
                    //x.keywords.forEach(function(y){
                    //    list.push(y)
                    //});
                });
                //console.log(s[0].keywords);
                //console.log(s[0].keywords.join(", "));
                //console.log(list)
                return <div dangerouslySetInnerHTML={{ __html: list }} />
                //return list
            }
        }
    }


    return (
        <div id="metadata" className={props.showMetadata ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Metadata<button type="button" className="close" onClick={() => props.setShowMetadata(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="mt-1 mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    Identifier
                </Col>
                <Col lg={9} className="py-2 px-1">
                    {
                        data ? data.identifier : null
                    }
                </Col>
            </Row>
            <Row className="mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    Title
                </Col>
                <Col lg={9} className="py-2 px-1">
                    {
                        data ? data.title : null
                    }
                </Col>
            </Row>
            <Row className="mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    Abstract
                </Col>
                <Col lg={9} className="pt-2 px-1" style={{maxHeight:"100px", overflowY:"auto"}}>
                    {
                        data ? data.abstract : null
                    }
                </Col>
            </Row>
            <Row className="mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    Organization
                </Col>
                <Col lg={9} className="pt-2 px-1">
                    {
                        data ? data.organizations.name : null
                    }
                </Col>
            </Row>
            <Row className="mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    Keywords
                </Col>
                <Col lg={9} className="pt-2 px-1">
                    {
                        data ? viewSubjects(data.keywords) : null
                    }
                </Col>
            </Row>
            <Row className="mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    Distributions
                </Col>
                <Col lg={9} className="pt-2 px-1" style={{maxHeight:"100px", overflowY:"auto"}}>
                    {
                        data ? viewReferences(data.distributions) : null
                    }
                </Col>
            </Row>
            <Row className="mx-1 font-11 border-bottom" >
                <Col lg={3} className="py-2 px-1">
                    
                </Col>
                <Col lg={9} className="pt-2 px-1">
                    <Button size="sm" block variant="secondary" className="font-11 pt-0 pb-1 mr-2" onClick={() => window.open(Config.api_domain + "/harvestings/identifier/" + data.identifier)} >URL Metadata</Button>
   
                </Col>
            </Row>
        </div>
    );
}