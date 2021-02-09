import L, { Point } from 'leaflet';

declare module 'leaflet' {
    interface Bounds {
        getTopLeft(): Point;
        getBottomRight(): Point;
    }
}
