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

import { crc32 } from './crc32';
import { hslToRgb } from './hsl2rgb';

// this approach taken from monotone-viz
function StringToRGBA(str: string): number[] {
    const check = crc32(str);

    const h = check / 4294967296;
    const l = 0.55;
    const s = 0.8;

    return [...hslToRgb(h, s, l), 0.5];
}

function ParishStyle(parish: any) {
    const style = new Style({
        fill: new Fill({
            color: StringToRGBA(parish.code),
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


function ParishMap() {
    // get ref to div element - OpenLayers will render into this div
    const mapElement = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const StGeorges = olProj.transform([115.8612, -31.9557], 'EPSG:4326', 'EPSG:3857');
        const featuresLayer = new VectorLayer({
            source: undefined,
        })

        const viewObject = new View({
            projection: 'EPSG:3857',
            center: StGeorges,
            zoom: 10
        });

        const mapObject = new Map({
            target: mapElement.current || undefined,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
                    })
                }),
                featuresLayer
            ],
            view: viewObject,
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
            const feature = gj.readFeature(parish.geom, importOptions);
            const style = ParishStyle(parish);
            feature.setStyle(style);
            style.getText().setText(parish.code);
            features = [...features, feature];
        }
        mapObject.setTarget(mapElement.current || undefined);
        const parishSource = new VectorSource({
            features: features
        });
        featuresLayer.setSource(parishSource);

        // save map and vector layer references to state
        return () => {
            console.log('unmounted');
            mapObject.setTarget(undefined);
        } ;
    });

    return (
        <div ref={mapElement} className="map-container"></div>
    )
}

export { ParishMap };
