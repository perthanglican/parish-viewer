import React from 'react';
import Parishes from './parishes.json';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Text, Fill, Stroke } from 'ol/style';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';

function ParishStyle(parish: any) {
    const style = new Style({
        fill: new Fill({
            color: [255, 0, 0, 0.5],
        }),
        stroke: new Stroke({
            color: [0, 0, 0, 1],
            width: 2,
        }),
        text: new Text({
            text: "CATS",
            font: '18px "Open Sans", "Arial Unicode MS", "sans-serif"',
            fill: new Fill({
                color: 'black',
            })
        })
    });
    return style;
}


function ParishMap({ showSummary, setShowSummary }: { showSummary: boolean, setShowSummary: any }) {
    const StGeorges = olProj.transform([115.8612, -31.9557], 'EPSG:4326', 'EPSG:3857');
    const [map, setMap] = React.useState<Map>()

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
        var gj = new GeoJSON();
        // spool in the parishes
        for (const parish of Parishes.parishes) {
            if (!parish.geom) {
                continue;
            }
            const feature = gj.readFeature(parish.geom, importOptions);
            const style = ParishStyle(parish);
            feature.setStyle(style);
            style.getText().setText(parish.code);
            features = [...features, feature];
        }
        const parishSource = new VectorSource({
            features: features
        });
        initialFeaturesLayer.setSource(parishSource);

        // save map and vector layer references to state
        setMap(initialMap);
    }, [StGeorges, map])

    return (
        <div ref={mapElement} className="map-container"></div>
    )
}

export { ParishMap };
