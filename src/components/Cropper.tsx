import { LatLngTuple, Point } from 'leaflet';
import React, { useState } from 'react';
import { Rectangle, useMap, useMapEvents } from 'react-leaflet';
import { TILE_SIZE } from '../utils/constants';
import Download from './Download';

let dragging = false;

const Cropper = () => {
    const [path, setPath] = useState<[LatLngTuple, LatLngTuple]>([[0, 0], [0, 0]]);

    const map = useMap();

    useMapEvents({
        mousedown: (e) => {
            if (dragging || map.dragging.enabled()) {
                return;
            }
            dragging = true;
            const { lat, lng } = e.latlng;
            setPath([[lat, lng], [lat, lng]]);
        },
        mousemove: (e) => {
            if (!dragging) {
                return;
            }
            const { lat, lng } = e.latlng;
            setPath([path[0], [lat, lng]]);
        },
        mouseup: (e) => {
            if (!dragging) {
                return;
            }
            dragging = false;
            const { lat, lng } = e.latlng;
            setPath([path[0], [lat, lng]]);
        }
    })

    const p1 = map.project(path[0], map.getMaxZoom());
    const p2 = map.project(path[1], map.getMaxZoom());
    const nw = new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)).floor();
    const se = new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)).floor();
    const { x: width, y: height } = se.subtract(nw);
    const xOffset = nw.x % TILE_SIZE;
    const yOffset = nw.y % TILE_SIZE;
    const tileCount = Math.ceil(width / TILE_SIZE) * Math.ceil(height / TILE_SIZE);
    let metaJSX = null;
    if (width !== 0 && height !== 0) {
        metaJSX = (
            <div className='leaflet-bar leaflet-control' style={{ zIndex: 1200, position: 'absolute', right: 0, top: 0, backgroundColor: 'white', padding: 10 }}>
                ({width}x{height}) {tileCount} tiles ({(tileCount * 0.015).toFixed(2)}MB) {xOffset} {yOffset}
                <Download nw={nw} se={se} xOffset={xOffset} yOffset={yOffset} width={width} height={height} tileCount={tileCount} />
            </div>
        );
    }

    return (
        <React.Fragment>
            <Rectangle bounds={path} />
            { metaJSX}
        </React.Fragment>
    )
}

export default Cropper;