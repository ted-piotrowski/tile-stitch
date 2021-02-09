import L from 'leaflet';
import React, { useEffect, useRef } from 'react';
import { mergeImages } from '../utils/utils';

interface Props {
    raster: any;
    width: number;
    height: number;
}

const Download = (props: Props) => {
    const { raster, width, height } = props;

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            L.DomEvent.disableClickPropagation(ref.current);
            L.DomEvent.disableScrollPropagation(ref.current);
        }
    });

    const download = async () => {
        if (raster.length > 3000) {
            alert('Please choose an area that is less than 3000 tiles');
            return;
        }
        const imageURI = await mergeImages(raster, {
            width,
            height,
            crossOrigin: 'Anonymous'
        });

        const link = document.createElement("a");
        link.download = 'map-high-res.jpg';
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
    };

    return (
        <div ref={ref}>
            <button role='button' onClick={download}>Download</button>
        </div>
    )
}

export default Download;