import React from 'react';
import './App.css';
import Parishes from './parishes.json';
import { Container, Row, Col } from 'reactstrap';

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'

function ParishMap() {
    const [map, setMap] = React.useState<Map | undefined>();
    const [featuresLayer, setFeaturesLayer] = React.useState<VectorLayer|undefined>()

    const mapRef = React.useRef<HTMLElement|undefined>();
    mapRef.current = map;

    React.useEffect( () => {
        const featuresLayer = new VectorLayer({
          source: new VectorSource()
        })
    
        const newMap = new Map({
          target: mapRef.current,
          layers: [
            // Google Maps Terrain
            new TileLayer({
              source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
              })
            }),
            featuresLayer
          ],
          view: new View({
            projection: 'EPSG:3857',
            center: [0, 0],
            zoom: 2
          }),
          controls: []
        })
    
        // save map and vector layer references to state
        setMap(newMap)
        setFeaturesLayer(featuresLayer)
    
      },[])

    return <>
    </>;
}


function App() {
    return <Container>
        <Row>
            <Col>
                <h1>Anglican Church Diocese of Perth – Digital Parish Boundaries</h1>
                <p>
                    These boundaries are an unofficial draft. 
                    Under no circumstances make any decisions based upon them.
                    Any queries, please contact <a href="mailto:grahame@oreamnos.com.au">Grahame Bowland</a>.
                </p>
            </Col>
        </Row>
        <ParishMap />
    </Container>;
}

export default App;
