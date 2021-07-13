
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Table(props) {
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
        if (elmnt.id === "table") {
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
        <div id="table" className={props.table ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">View Table<button type="button" className="close" onClick={() => props.setTable(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3 pb-2">
                <Col className="pt-1 pl-3 font-13 font-weight-bold" id="attribute-content">
                    {props.title}
                </Col>
            </Row>
            <Row className="px-3 font-11">
                <Col className="bg-light border">
                    Year        
                </Col>
                <Col className="bg-light border">
                    Area        
                </Col>
                <Col className="bg-light border">
                    Amount        
                </Col>
                
            </Row>
            <Row className="px-3 font-11">
                <Col className="bg-light border">
                    2016        
                </Col>
                <Col className="bg-light border">
                    12,785 km2        
                </Col>
                <Col className="bg-light border">
                    2,487 ton        
                </Col>
            </Row>
            <Row className="px-3 font-11">
                <Col className="bg-light border">
                    2017        
                </Col>
                <Col className="bg-light border">
                    12,678 km2        
                </Col>
                <Col className="bg-light border">
                    2,345 ton        
                </Col>
            </Row>
            <Row className="px-3 font-11">
                <Col className="bg-light border">
                    2018        
                </Col>
                <Col className="bg-light border">
                   12,578 km2        
                </Col>
                <Col className="bg-light border">
                    2,245 ton        
                </Col>
            </Row>
            <Row className="px-3 font-11">
                <Col className="bg-light border">
                    2019        
                </Col>
                <Col className="bg-light border">
                    12,498 km2        
                </Col>
                <Col className="bg-light border">
                    2,119 ton        
                </Col>
            </Row>

        </div>
    );
}