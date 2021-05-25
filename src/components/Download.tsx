import L, { Point } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { createTileRaster, mergeImages, xyz } from '../utils/utils';

interface Props {
    nw: Point;
    se: Point;
    xOffset: number;
    yOffset: number;
    width: number;
    height: number;
    tileCount: number;
    zoom: number;
}

const Download = (props: Props) => {
    const { nw, se, xOffset, yOffset, width, height, tileCount, zoom } = props;

    const [inProgress, setInProgress] = useState(false);
    const [count, setCount] = useState(0);

    const map = useMap();

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            L.DomEvent.disableClickPropagation(ref.current);
            L.DomEvent.disableScrollPropagation(ref.current);
        }
    });

    const updateCount = () => {
        setCount(count => count + 1);
    }

    const download = async () => {
        if (inProgress) {
            return;
        }
        const xyzTiles = xyz({ nw, se, zoom });
        const tileUrl = `https://khms1.google.com/kh/v=874?x={x}&y={y}&z={z}`; //${process.env.REACT_APP_MAPBOX_KEY}`
        const raster = createTileRaster(xyzTiles, tileUrl);
        if (tileCount > 4000) {
            alert('Please choose an area that is less than 4000 tiles');
            return;
        }
        setInProgress(true);
        try {
            const imageURI = await mergeImages(raster, {
                xOffset,
                yOffset,
                width,
                height,
                crossOrigin: 'Anonymous'
            }, updateCount);

            const link = document.createElement("a");
            link.download = 'map-high-res.jpg';
            link.href = imageURI;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e) {
            alert('Something went wrong.');
        } finally {
            setCount(0);
            setInProgress(false);
        }
        // delete link;
    };

    return (
        <div ref={ref}>
            <button role='button' onClick={download} disabled={inProgress}>Download</button>
            {inProgress ? `${Math.floor(count / tileCount * 100)}%` : ''}
        </div>
    )
}

export default Download;