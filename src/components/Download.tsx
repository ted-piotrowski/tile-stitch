import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { mergeImages } from '../utils/utils';

interface Props {
    raster: any;
    width: number;
    height: number;
}

const Download = (props: Props) => {
    const { raster, width, height } = props;

    const [inProgress, setInProgress] = useState(false);
    const [count, setCount] = useState(0);

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
        if (raster.length > 3000) {
            alert('Please choose an area that is less than 3000 tiles');
            return;
        }
        setInProgress(true);
        try {
            const imageURI = await mergeImages(raster, {
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
            {inProgress ? `${Math.floor(count / raster.length * 100)}%` : ''}
        </div>
    )
}

export default Download;