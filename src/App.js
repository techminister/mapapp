import React, {Component} from "react";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import "./App.css";
import Maps from "./Map";
import styled from 'styled-components';
//import {run} from './allocate_db';




//try map component 
const AppWrapper = styled.div`
    justify-content: center;
    margin: 2em
    
`;
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: blue;
`;


export default class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            checked: false,
        }
    }
  


    render(){
        return(
            <div>
                <Title>
                        SUTD Capstone Campus Map
                    </Title>
                <AppWrapper> 
                    <form onSubmit>
                    <button type="submit">
                      Run Alogrithm
                    </button>
                    </form> 
                    <button>
                      Allocate Slots
                    </button>
                    <button>
                      View Database
                    </button>
                    <Maps />
                </AppWrapper>
            </div>
            
                
                
        );
    }

}


/*
export default function App(){

    return (
    <Map center = {[1.3413, 103.9638]} zoom={12}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>
    );
}
*/

/*
export default class FirstComponent extends Component {

    constructor(props) {
        super(props)
        }
    
    render() {
        const element = (<div>Text from Element</div>)
        return (<div className="comptext">
        <h3>First Component</h3>
            <Map center = {[1.3413, 103.9638]} 
            zoom={12} 
            bounds= {[[0,0],[100,1000]]} 
            crs={L.CRS.Simple}
            
            minZoom={5}>
            <TileLayer
            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              image={L.imageOverlay('logo192.png')} 
             />
            </Map>
            {element}
        </div>)
    }
}
*/
    




/*
class App extends Component {

    state = {
      zoom: 13
    }
  
    render(){
      return (
        <Map className="map" center={[1.3413, 103.9638]} zoom={this.state.zoom}>
          <TileLayer
            //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            imageUrl='http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg'
            imageBounds={[[40.712216, -74.22655], [40.773941, -74.12544]]}
            L.imageOverlay(imageUrl, imageBounds)
          />
        </Map>
      );
    }
  }
  
  export default App;
  */ 