import React from 'react';
import L, { Bounds } from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import mappic from '/Users/suhassahu/Desktop/ReactStuff/mapapp/src/spaceupdat.jpg';
import { useAlert } from 'react-alert';



const Wrapper = styled.div`
    width: $(props => props.width);
    height: $(props => props.height);
`; 
//dimensions of the various booths
var dimensions = {"2": [[22, 3], [4, 4]], "3": [[27, 4], [5, 5]], "4": [[33, 5], [6, 6]], "5": [[40, 6], [6, 6]], 
"6": [[32, 12], [4, 4]], "7": [[37, 13], [4, 4]], "8": [[33, 18], [4, 6]], "9": [[38, 20], [8, 4]], 
"10": [[32, 25], [4, 4]], "11": [[63, 57], [12, 16]], "12": [[28, 10], [3, 3]], "13": [[37, 25], [6, 6]], 
"14": [[31, 32], [8, 4]], "15": [[42, 13], [4, 2]], "16": [[31, 37], [6, 10]], "17": [[38, 37], [5, 5]], 
"18": [[25, 48], [6, 6]], "19": [[38, 43], [4, 4]], "20": [[32, 54], [10, 6]], "21": [[15, 55], [8, 8]], 
"22": [[32, 48], [4, 4]], "23": [[19, 2], [2, 2]], "24": [[105, 52], [4, 4]], "25": [[24, 55], [4, 4]], 
"26": [[19, 52], [4, 2]], "27": [[80, 56], [7, 7]], "28": [[88, 56], [6, 4]], "29": [[95, 56], [5, 4]], 
"30": [[110, 56], [5, 2]], "31": [[43, 58], [6, 6]], "32": [[50, 58], [8, 8]], "33": [[10, 59], [4, 4]], 
"34": [[2, 60], [6, 4]], "35": [[32, 61], [4, 4]], "36": [[24, 8], [2, 1]], "37": [[47, 7], [1, 1]], 
"38": [[2, 65], [10, 12]], "39": [[47, 9], [1, 1]], "40": [[76, 64], [8, 8]], "41": [[37, 61], [4, 4]], 
"42": [[115, 59], [4, 3]], "43": [[88, 61], [6, 6]], "44": [[118, 63], [4, 4]], "45": [[42, 65], [7, 7]],
 "46": [[26, 10], [1, 1]], "47": [[37, 73], [8, 6]], "48": [[123, 65], [4, 4]], "49": [[57, 76], [20, 6]], 
 "50": [[47, 11], [1, 1]], "51": [[38, 83], [23, 14]], "52": [[56, 67], [6, 6]], "53": [[85, 68], [4, 6]], 
 "54": [[81, 75], [10, 10]], "55": [[46, 73], [6, 6]], "56": [[50, 67], [4, 4]]}
var booths = {};
export default class Maps extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          inputValue: ''
        };
      }
    componentDidMount(){
        this.map = L.map('map',
        {
            crs: L.CRS.Simple,
            minZoom: 2,
            maxZoom: 3, 
            zoomControl: true,
            center: [0,0],
            zoom: 1,
        });
        //w and h based on the size of the image 
        var w = 363;
        var h = 370;
        var imageUrl = mappic;
        var southWest = this.map.unproject([ 0, h], this.map.getMaxZoom()-1);
        var northEast = this.map.unproject([ w, 0], this.map.getMaxZoom()-1);
        var bounds = new L.LatLngBounds( southWest, northEast);
        L.imageOverlay(imageUrl, bounds).addTo(this.map);
        
        //adds the various booths to the map
        for(var key in dimensions){
            var newlong = (((dimensions[key][0][0] + dimensions[key][1][0])/132)*92);
            var newlat = (((dimensions[key][0][1] + dimensions[key][1][1])/132)*91);
            var oldlong = ((dimensions[key][0][0]/132)*92);
            var oldlat = ((dimensions[key][0][1]/132)*91);
            //this.map.addLayer(L.rectangle([[-oldlat, oldlong], [-newlat, newlong]], {pmIgnore: false}));
            var booth = L.rectangle([[-oldlat, oldlong], [-newlat, newlong]], {pmIgnore: false});
            //var booth2 = L.rectangle([[-67.12121212121212, 26.484848],[-57.469,42.5]]).addTo(this.map);
            booth.pm.enable({
                allowSelfIntersection: false,
            })
            booth.bindPopup("Booth No: " +  key + " " + "Dimensions: " + dimensions[key][0]);
            booths[key] = booth; 
            booth.addTo(this.map);
            //If point is edited 
            booth.on('pm:edit', e => {
                var sWlat = e.target._bounds._southWest.lat;
                var sWlng = e.target._bounds._southWest.lng;
                var nElat = e.target._bounds._northEast.lat;
                var nElng = e.target._bounds._northEast.lng;
                //get booth no. and convert to int
                var boothno = e.target._popup._content.slice(10,12);
                boothno = parseInt(boothno);
                //topleft1 is dimensions[key][0][0], topleft2 is dimensions[key][0][1]
                var topleft1 = Math.round((sWlng/92)*132); 
                var topleft2 = Math.round((-nElat/91)*132);
                var dim1 = Math.round(((nElng/92)*132)-topleft1);
                var dim2 = Math.round(((-sWlat/91)*132)-topleft2);
                booths[boothno].bindPopup("Booth No: " +  key + " " + "Dimensions: " + [dim1,dim2]);

                /*
                dimensions[boothno][0][0] = topleft1;
                dimensions[boothno][0][1] = topleft2;
                dimensions[boothno][1][0] = dim1; 
                dimensions[boothno][1][1] = dim2;
                */
                console.log(boothno, dimensions[boothno], [topleft1, topleft2], [dim1,dim2]);
              });

    
        }
        //top left and bottom right 
        //dimensions of full map [[-100,540], [100,-180]]
        //console.log(booths);
        this.map.setMaxBounds(bounds);
        //Sets toolbar on the left map 
        this.map.pm.addControls({
            position: 'topleft',
            drawCircle: false,
            drawMarker: false,
            drawPolygon: false,
            drawPolyline: false,
            drawCircleMarker: false,
            cutPolygon: false,
          });
        this.map.on('layerremove', e =>{
            console.log(e.layer._content);
            if(e.layer._content != null){
                var boothno = e.layer._content.slice(10,12);
                boothno = parseInt(boothno);
                console.log(boothno);
            }
        });

        
    } 


    render(){
        return (  
            <div>
                <form >
                    <label>
                        Dimensions: 
                    </label>
                    <input 
                    value={this.state.inputValue} 
                    onChange={evt => this.updateInputValue(evt)}/>
                </form>
                <Wrapper width="512px" height="512px" id="map" />
            </div>
        )
    }
    updateInputValue(evt) {
        this.setState({
          inputValue: evt.target.value
        });
        console.log(this.state.inputValue);
      }
}

