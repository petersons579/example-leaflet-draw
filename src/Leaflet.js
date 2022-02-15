import React, { useRef, useState } from 'react';
import { polygon } from 'leaflet';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';

const Leaflet = () => {
    const editableFG = useRef(null);
    const [points, setPoints] = useState([]);

    const format = positions => {
        return positions.map(pos => {
            return [
                pos.lat,
                pos.lng
            ];
        });
    };

    const onCreated = e => {
        const { layerType, layer } = e;

        if (layerType === 'polygon') {
            const values = format(layer.getLatLngs()[0]);
            values.push(values[0]);

            setPoints(values);
        }

        const drawnItems = editableFG.current._layers;

        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editableFG.current.removeLayer(layer);
            });
        }
    };

    const onEdited = e => {
        const { layers: { _layers } } = e;

        Object.values(_layers).map(({ editing }) => {
            const values = Object.values(editing.latlngs[0]).map(v => { return v; });
            const valueFormat = format(values[0]);
            valueFormat.push(valueFormat[0]);

            editableFG.current.clearLayers();
            const newPolygon = polygon(valueFormat);
            editableFG.current.addLayer(newPolygon);

            setPoints(valueFormat);
        })
    }

    const onDelete = () => {
        editableFG.current.clearLayers();

        setPoints([]);
    };

    const setLocations = () => {
        editableFG.current.clearLayers();

        const layerArr = [
            [
                -18.841656351709,
                -44.058733886719
            ],
            [
                -18.831258407277,
                -43.207293457031
            ],
            [
                -19.376273191215,
                -43.201800292969
            ],
            [
                -19.339994931294,
                -44.069720214844
            ],
            [
                -18.841656351709,
                -44.058733886719
            ]
        ];

        const newPolygon = polygon(layerArr);

        editableFG.current.addLayer(newPolygon);
        setPoints(layerArr);
    };

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex'
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: '70%'
                }}
            >
                <MapContainer
                    center={[-13.6632305, -69.6410913]}
                    zoom={3}
                    style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <FeatureGroup
                        ref={editableFG}
                    >
                        <EditControl
                            position="topright"
                            onCreated={onCreated}
                            onEdited={onEdited}
                            onDeleted={onDelete}
                            draw={{
                                circle: false,
                                circlemarker: false,
                                marker: false,
                                polyline: false,
                                rectangle: false
                            }}
                        />
                    </FeatureGroup>
                </MapContainer>
            </div>
            <div
                style={{
                    height: '100%',
                    width: '30%',
                    marginLeft: '10px'
                }}
            >
                <button onClick={() => setLocations()}>SETAR</button><br />
                <pre>{JSON.stringify(points, 0, 2)}</pre>
            </div>
        </div>
    );
};

export default Leaflet;