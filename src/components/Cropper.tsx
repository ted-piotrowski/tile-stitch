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

    let zoom = map.getMaxZoom();
    let newZoom = zoom;
    let nw, se, width, height, xOffset, yOffset, tileCount, fileSize;
    do {
        zoom = newZoom;
        const p1 = map.project(path[0], zoom);
        const p2 = map.project(path[1], zoom);
        nw = new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)).floor();
        se = new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)).floor();
        const { x, y } = se.subtract(nw);
        width = x;
        height = y;
        xOffset = nw.x % TILE_SIZE;
        yOffset = nw.y % TILE_SIZE;
        tileCount = Math.ceil(width / TILE_SIZE) * Math.ceil(height / TILE_SIZE);
        fileSize = tileCount * 0.017;
        newZoom--;
    } while (fileSize > 50);

    let metaJSX = null;
    if (width !== 0 && height !== 0) {
        metaJSX = (
            <div className='leaflet-bar leaflet-control' style={{ zIndex: 1200, position: 'absolute', right: 0, top: 0, backgroundColor: 'white', padding: 10 }}>
                ({width}x{height}) zoom:{zoom} {tileCount} tiles (~{fileSize.toFixed(2)}MB)
                <Download nw={nw} se={se} xOffset={xOffset} yOffset={yOffset} width={width} height={height} tileCount={tileCount} zoom={zoom} />
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