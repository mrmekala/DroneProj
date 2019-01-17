function simulateLiveData() {
  var data = [];
  
  var series = {
    "values": []
  };
  
  const API_URL = "https://react-assessment-api.herokuapp.com/api/drone/";
  
  fetch(API_URL)
            .then(response => {
                if (response.ok) {
                    return  response.json()
                }
                else {
                    throw new Error ('something went wrong')
                }
            })
            .then(response => {
                  response.data.map(function(metricObject, index){
                    data.push(new Date(metricObject.timestamp).toLocaleTimeString("en-US"));
                  })
                }
            )
 
  return data;
}

window.onload = () => {
  var DataStore1 = React.createClass({
    getInitialState: function() {
      return {
        chartJSON:  {
          id: "id1",
          "type": "line",
          "title": { //Chart Title
            "text": 'Sample Drone Temperature'
          },
          "plot": {
            "aspect":"spline", 
             "line-color":"blue",
            "tooltip": {
              "visible": true,
              "placement": "node:top",
              "text": "%node-value"
            },
            "selection-mode": "multiple",
            "selected-state": {
              "backgroundColor": "#ada8a6"
            },
            "hover-mode": "node",
            "hover-state": {
              "background-color": "#ada8a6"
            }
          },
          "plotarea": {
            "adjust-layout": true
          },
          "scale-x": {
            // "zooming":true,
            // "zoom-to":[0,50],
            "item": {
              "font-size": 10
            },
            "label": { /* Scale Title */
              "text": "X Label",
            },
            "labels": [] /* Scale Labels */
          },
          "scale-y": {
            "label": { /* Scale Title */
              "text": "Y Label",
            }
          },
          "series":[]
        },
        chartSeries:[
          {
            values: simulateLiveData(),
            backgroundColor: "#5b514d"
          }
        ]
      }
    },
    render: function() {

      return (
        <div>
          <ZingChart id="chart1" height="400" width="100%" data={this.state.chartJSON} seriesData={this.state.chartSeries}/>
        </div>
      );
    },
    componentDidMount: function() {
      setInterval(this.modifyData, 2000);
    },
    //Simulates a change of data.
    modifyData: function() {
      this.setState({
        chartSeries:[
          {
            values:simulateLiveData()
          }
        ]
      });
    }
  });


  var ZingChart = React.createClass({
    render: function() {
      // ZC.LICENSE = ['fakelicensehereworks'];
      return (
        <div id={this.props.id}></div>
      );
    },
    //Called after the render function.
    componentDidMount: function() {
      if (this.props.seriesData) {
        this.props.data.series = this.props.seriesData;
      } 
      zingchart.render({
        id: this.props.id,
        width: (this.props.width || 600),
        height: (this.props.height || 400),
        data: this.props.data
      });
    },
    //Used to check the values being passed in to avoid unnecessary changes.
    shouldComponentUpdate: function(nextProps, nextState) {

      if (nextProps.seriesData) {
        return !(JSON.stringify(nextProps.seriesData[0]) === JSON.stringify(this.props.seriesData[0]))
      }
      //Lazy object comparison
      return !(JSON.stringify(nextProps.data) === JSON.stringify(this.props.data));
    },
    componentWillUpdate: function(nextProps) {
      if (this.props.seriesData) {
        this.props.data.series = this.props.seriesData;
      } 
      zingchart.exec(this.props.id, 'setdata', {
        data: nextProps.data
      })
    }
  });

  ReactDOM.render(<DataStore1 />, document.getElementById('container1'));
}

