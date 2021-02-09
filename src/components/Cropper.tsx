import { LatLngTuple, Point } from 'leaflet';
import React, { useState } from 'react';
import { Rectangle, useMap, useMapEvents } from 'react-leaflet';
import { createTileRaster, getDimensions, xyz } from '../utils/utils';
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
    const { x, y } = p1.subtract(p2);
    let metaJSX = null;
    if (!isNaN(x) && !isNaN(y)) {
        const nw = new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
        const se = new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
        const xyzTiles = xyz({ nw, se, zoom: map.getMaxZoom() });
        if (xyzTiles.length > 0) {
            const tileUrl = `https://khms1.google.com/kh/v=874?x={x}&y={y}&z={z}`; //${process.env.REACT_APP_MAPBOX_KEY}`
            const raster = createTileRaster(xyzTiles, tileUrl);
            const { width, height } = getDimensions(raster);
            metaJSX = (
                <div className='leaflet-bar leaflet-control' style={{ zIndex: 1200, position: 'absolute', right: 0, top: 0, backgroundColor: 'white', padding: 10 }}>
                    ({width}x{height}) tiles: {raster.length}/{(raster.length * 0.017).toFixed(2)} MB
                    <Download raster={raster} width={width} height={height} />
                </div>
            );
        }
    }

    return (
        <React.Fragment>
            <Rectangle bounds={path} />
            { metaJSX}
        </React.Fragment>
    )
}

export default Cropper;