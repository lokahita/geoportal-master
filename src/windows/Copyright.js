
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import logo_cifor from './logo/CIFOR_green_vlr.png';
import logo_fta from './logo/logo-cgiarfta.png';

export default function Copyright(props) {
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
        if (elmnt.id === "copyright") {
            
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
        <div id="copyright" className={props.copyright ? 'show' : 'hide'} >
                <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Copyright<button type="button" className="close" onClick={() => props.setCopyright(false)}><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
                <Row className="mx-3 my-3">
                    <Col xs={3} className="pt-2 px-1" id="attribute-content">
                    <img src={logo_cifor} alt="cifor logo" width="40px" className="pt-1 logo_cifor unselectable" /> <br /><br />
                    <img src={logo_fta} alt="fta logo" width="120px" className="unselectable" />
                    </Col>
                    <Col xs={9} className="pt-1 px-1" id="attribute-content">
                    <p className="text-secondary font-11">
                    The CGIAR Research Program on Forests, Trees and Agroforestry (FTA) is the world's largest research for development program to enhance the role of forests, trees and agroforestry in sustainable development and food security and to address climate change. CIFOR leads FTA in partnership with ICRAF, the Alliance of Bioversity International and CIAT, CATIE, CIRAD, INBAR and TBI
                    </p>
                    </Col>
                </Row>
                <p className="text-center text-secondary font-11">
                © 2021 @ CGIAR Research Program - Forests, Trees and Agroforestry 
                </p>
            </div>
    );
}