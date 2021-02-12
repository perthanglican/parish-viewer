import React from 'react';
import { Parishes } from './ParishInfo';
import Select from 'ol/interaction/Select';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Text, Fill, Stroke } from 'ol/style';
import { click } from 'ol/events/condition';
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

function ParishPopover() {
    return <>
        <div id="map-info"><div id="map-info-inner"><p>Click on a parish for more information.</p></div></div>
    </>;
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
                        url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
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
        for (const [idx, parish] of Parishes.parishes.entries()) {
            const feature = gj.readFeature(parish.geom, importOptions);
            const style = ParishStyle(parish);
            feature.setStyle(style);
            feature.set('parishIndex', idx);
            style.getText().setText(parish.code);
            features = [...features, feature];
        }
        mapObject.setTarget(mapElement.current || undefined);
        const parishSource = new VectorSource({
            features: features
        });
        featuresLayer.setSource(parishSource);

        // select interaction working on "click"
        const selectClick = new Select({
            condition: click,
        });

        mapObject.addInteraction(selectClick);
        selectClick.on('select', function (e) {
            var elem = document.getElementById('map-info-inner');
            if (!elem) {
                return;
            }
            var feature = e.target.getFeatures().item(0);
            if (feature) {
                const idx: (number | undefined) = feature.get('parishIndex');
                if (idx !== undefined) {
                    const parish = Parishes.parishes[idx];
                    const definition = parish.definition.join(' ');
                    const problems = parish.problems.join('');
                    elem.innerHTML = `
<table class="table">
    <tbody>
        <tr><th class="w-25" scope="row">Code</th><td>${parish.code}</td></tr>
        <tr><th class="w-25" scope="row">Definition</th><td>${definition}</td></tr>
        <tr><th class="w-25" scope="row">Problems</th><td>${problems}</td></tr>
    </tbody>
</table>`;
                    return;
                }
            }
            elem.innerHTML = `<p>Click on a parish for more information.</p>`;
        });

        // save map and vector layer references to state
        return () => {
            mapObject.setTarget(undefined);
        };
    });

    return <>
        <div ref={mapElement} className="map-container"></div>
        <ParishPopover />
    </>;
    
}

export { ParishMap };
