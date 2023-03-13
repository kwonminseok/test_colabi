import React from 'react';
import {Line} from 'react-chartjs-2';


const options = {
    title: {
        display: false,
    },
    tooltips: {
        enabled: false
    },
    legend: {
        display: false,
        
    },
    scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            gridLines: {
                display:false
            },
            ticks: {
               display:false
            }
        }   
        ]
    }

}

class LineCharting extends React.Component{



    render(){
        return (
            <div>
                <Line data={this.props.data}
                options={options}
                />
            </div>

        )
    }
}


export default LineCharting;
