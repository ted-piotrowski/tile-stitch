import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';

const Tools = () => {
    const ref = useRef<HTMLDivElement>();
    const [drag, setDrag] = useState(true);

    useEffect(() => {
        if (ref.current) {
            L.DomEvent.disableClickPropagation(ref.current);
            L.DomEvent.disableScrollPropagation(ref.current);
        }
    });

    const map = useMap();

    const toggleDrag = () => {
        if (drag) {
            map.dragging.disable();
        } else {
            map.dragging.enable();
        }
        setDrag(prev => !prev);
    }

    const dragClass = drag ? 'leaflet-disabled' : '';
    const cropClass = drag ? '' : 'leaflet-disabled';

    return (
        <div className='leaflet-top leaflet-left' style={{ top: 80 }}>
            <div className='leaflet-bar leaflet-control'>
                <a href='#' onClick={drag ? () => { } : toggleDrag} className={dragClass} role='button'>Drag</a>
                <a href='#' onClick={drag ? toggleDrag : () => { }} className={cropClass} role='button'>Crop</a>
            </div>
        </div>
    )
}

export default Tools;