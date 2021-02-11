import React from 'react';
import './App.css';
import Parishes from './parishes.json';
import { Navbar, NavbarBrand, ButtonToggle, NavItem, Row, Col } from 'reactstrap';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import GeoJSON from 'ol/format/GeoJSON';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';

function ParishMap({showSummary, setShowSummary}: {showSummary: boolean, setShowSummary: any}) {
    const StGeorges = olProj.transform([115.8612, -31.9557], 'EPSG:4326', 'EPSG:3857');
    const [map, setMap] = React.useState<Map>()
    const [view, setView] = React.useState<View>()
    const [featuresLayer, setFeaturesLayer] = React.useState<VectorLayer>()

    // get ref to div element - OpenLayers will render into this div
    const mapElement = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (map) {
            return;
        }

        const initialFeaturesLayer = new VectorLayer({
            source: undefined,
        })

        const initialView = new View({
            projection: 'EPSG:3857',
            center: StGeorges,
            zoom: 10
        });

        const initialMap = new Map({
            target: mapElement.current || undefined,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
                    })
                }),
                initialFeaturesLayer
            ],
            view: initialView,
            controls: []
        });

        var features: Feature<Geometry>[] = [];
        const importOptions = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }
        // spool in the parishes
        for (const parish of Parishes.parishes) {
            if (!parish.geom) {
                continue;
            }
            features = [...features, ...new GeoJSON().readFeatures(parish.geom, importOptions)];
        }
        const parishSource = new VectorSource({
            features: features
        });
        initialFeaturesLayer.setSource(parishSource);

        // save map and vector layer references to state
        setMap(initialMap);
        setView(initialView);
        setFeaturesLayer(initialFeaturesLayer);
    }, [])

    return (
        <div ref={mapElement} className="map-container"></div>
    )
}

function TopBar({showSummary, setShowSummary}: {showSummary: boolean, setShowSummary: any}) {
    return <Navbar color="dark" dark>
        <NavbarBrand>Draft Digital Parish Boundaries</NavbarBrand>
        <ButtonToggle
            className={showSummary? 'active': undefined}
            onClick={() => setShowSummary(!showSummary)}>Show summary</ButtonToggle>
    </Navbar>;
}


function App() {
    const [showSummary, setShowSummary] = React.useState<boolean>(false);
    return <>
        <TopBar showSummary={showSummary} setShowSummary={setShowSummary} />
        <ParishMap showSummary={showSummary} setShowSummary={setShowSummary} />
    </>;
}

export default App;
