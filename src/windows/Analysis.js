
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Analysis(props) {

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
        if (elmnt.id === "analysis") {
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


    const options = {
        chart: {
          type: 'spline',
          height: 200
        },
        title: {
          text: 'Distribution'
        },
        series: [
          {
            data: [1, 2, 1, 4, 3, 6]
          }
        ]
      };
    
      const options2 = {
        chart: {
          type: 'bar',
          height: 200
        },
        title: {
          text: 'Graphic Chart'
        },
        xAxis: {
          categories: [110, 80, 97],
          title: {
            text: 'Amount'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Coverage',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        series: [
          {
            name: 'the area of coverage',
            data: [500, 350, 657]
          }
        ]
      };

    return (
        <div id="analysis" className={props.analysis ? 'show' : 'hide'} >
            <div onMouseDown={handleMouseDown} className="move-cursor bg-light border-bottom py-2 pl-3 pr-2 font-weight-bold text-secondary font-14">Display Chart<button type="button" className="close" onClick={() => props.setAnalysis(false)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div>
            <Row className="px-3 pb-2">
                <Col className="pt-1 pl-3 font-13 font-weight-bold" id="attribute-content">
                    {props.title}
                </Col>
            </Row>
            <Row className="px-3">
                <Col className="bg-light border pt-2">
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Col>
                <Col className="bg-light border pt-2">
                    <HighchartsReact highcharts={Highcharts} options={options2} />
                </Col>
            </Row>
        </div>
    );
}