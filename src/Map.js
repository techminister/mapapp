import React from 'react';
import L, { Bounds, popup } from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import mappic from '/Users/suhassahu/Desktop/ReactStuff/mapapp/src/spaceupdat.jpg';
import { object } from 'prop-types';
import axios from 'axios'

const Wrapper = styled.div`
    width: $(props => props.width);
    height: $(props => props.height);
`; 
//Json File
var dimensions = require('/Users/suhassahu/Desktop/ReactStuff/mapapp/src/dicts.json');
//console.log(data);
 //dimensions of the various booths
var booths = {};
export default class Maps extends React.Component{
    constructor(props) {
        super(props);
        this.state = ({
            boothID: '',
            width: '',
            breadth: '',
            ready: '',
            entries: [],
            dimensions: {},
        });
        this.handleChange = this.handleChange.bind(this);
      }
    handleChange(evt){
        this.setState({[evt.target.name]: evt.target.value})
    }
    handleSubmit = event => {
        event.preventDefault()
        this.setState({ready: "yes"});
        alert([this.state.width, this.state.breadth, this.state.boothID]);
    }
    //L.rectangle([[Number(this.state.height), Number(this.state.width)],[55,110]]));
    getProducts = _ => {
        fetch('http://localhost:4000/registration')
        .then(response => response.json())
        .then(response => this.setState({entries: response.data}))
        .catch(err => console.error(err))
        
    }
    


    componentDidMount(){
        this.getProducts();
        setTimeout(() => {
            if(this.state.entries != null){
                for(const key of this.state.entries.keys()){
                    this.setState({
                        dimensions:{ 
                            ...this.state.dimensions, [this.state.entries[key]["id"]]:
                            [[this.state.entries[key]["PosX"], this.state.entries[key]["PosY"]], [this.state.entries[key]["height"], this.state.entries[key]["width"]]]
                        }
                        
                    })
                }
            }
            console.log(this.state.dimensions);
            dimensions = this.state.dimensions;
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
            });
            booth.bindPopup("Booth No: " +  key + " " + "Dimensions: " + dimensions[key][1]);
            booths[key] = booth; 
            booth.addTo(this.map);
            //If point is edited 
            booth.on('pm:edit', e => {
                
                    var sWlat = e.target._bounds._southWest.lat;
                    var sWlng = e.target._bounds._southWest.lng;
                    var nElat = e.target._bounds._northEast.lat;
                    var nElng = e.target._bounds._northEast.lng;
                    //get booth no. and convert to int
                    //topleft1 is dimensions[key][0][0], topleft2 is dimensions[key][0][1]
                    var boothno = e.target._popup._content.slice(10,13);
                    var topleft1 = Math.round((sWlng/92)*132); 
                    var topleft2 = Math.round((-nElat/91)*132);
                    var dim1 = Math.round(((nElng/92)*132)-topleft1);
                    var dim2 = Math.round(((-sWlat/91)*132)-topleft2);
                    booths[boothno].setPopupContent("Booth No: " +  key + " " + "Dimensions: " + [dim1,dim2]);
                    console.log(boothno)
                //need to debug, booth number only comes up once, after that reverts to 56
                //console.log(boothno, "old", dimensions[boothno], "new", [[topleft1, topleft2], [dim1,dim2]]);
              });

    
            }
        }, 100);
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
        
        //top left and bottom right 
        //dimensions of full map [[-100,540], [100,-180]]
        //console.log(booths);
        this.map.setMaxBounds(bounds);
        this.map.pm.setGlobalOptions({allowSelfIntersection: false});
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
            if(e.layer._content != null){
                var boothno = e.layer._content.slice(10,13);
                console.log(boothno);
            }     
        });
    

        
    } 

    
    render(){
        //console.log((this.state.entries.valuesOf(2)));
        return (
            <div>
                <form onSubmit = {this.handleSubmit} >
                    <label>
                        Booth ID: 
                    </label>
                    <input 
                    type="text" name="boothID" onChange={this.handleChange}/>
                    <label>
                        Breadth: 
                    </label>
                    <input
                    type="text" name="breadth" onChange={this.handleChange}/>
                    <label>
                        Width: 
                    </label>
                    <input
                    type="text" name="width" onChange={this.handleChange}/>
                    <button type="submit">Submit</button>
                </form>
                
                <Wrapper width="512px" height="512px" id="map" />
            </div>
        )
    }
}

