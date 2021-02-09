import { Point } from 'leaflet';
import { TILE_SIZE } from './constants';

export interface XYZ {
    x: number;
    y: number;
    z: number;
}

export interface XYZParams {
    nw: Point;
    se: Point;
    zoom: number;
}

export const xyz = (params: XYZParams): XYZ[] => {
    const { nw, se, zoom } = params;

    const min = nw.divideBy(TILE_SIZE).floor();
    const max = {
        x: Math.floor((se.x + TILE_SIZE) / TILE_SIZE),
        y: Math.floor((se.y + TILE_SIZE) / TILE_SIZE),
    }
    const xyz = [];

    for (var i = min.x; i <= max.x; i++) {
        for (var j = min.y; j <= max.y; j++) {
            xyz.push({ x: i, y: j, z: zoom });
        }
    }
    return xyz;
}

export interface XYZRaster {
    xOffset: number;
    yOffset: number;
    src: string;
}

export const createTileRaster = (xyzTiles: XYZ[], tileUrl: string): XYZRaster[] => {
    const getUrl = (xyz: XYZ) => {
        const { x, y, z } = xyz;
        return tileUrl.replace('{x}', x.toString()).replace('{y}', y.toString()).replace('{z}', z.toString());
    }

    // get dimensions in X and Y directions
    xyzTiles.sort((a, b) => {
        if (a.y !== b.y) {
            return a.y - b.y;
        }
        return a.x - b.x;
    })

    // get upper right tile
    const minX = xyzTiles.reduce((prev, cur) => {
        return (cur.x < prev.x) ? cur : prev;
    }).x;
    const minY = xyzTiles.reduce((prev, cur) => {
        return (cur.y < prev.y) ? cur : prev;
    }).y;

    const merged = xyzTiles.map((tile) => {
        const mod = Math.pow(2, tile.z);
        const tileX = (tile.x % mod + mod) % mod;
        const tileY = (tile.y % mod + mod) % mod;
        return {
            src: getUrl({ x: tileX, y: tileY, z: tile.z }),
            xOffset: (tile.x - minX) * TILE_SIZE,
            yOffset: (tile.y - minY) * TILE_SIZE,
        }
    })

    return merged
}

export const getDimensions = (data: XYZRaster[]) => {
    const width = data.reduce((prev, cur) => {
        return (cur.xOffset > prev.xOffset) ? cur : prev;
    }).xOffset + TILE_SIZE;
    const height = data.reduce((prev, cur) => {
        return (cur.yOffset > prev.yOffset) ? cur : prev;
    }).yOffset + TILE_SIZE;
    return { width, height }
}

interface MergeImageOptions {
    width: number;
    height: number;
    crossOrigin?: string;
}

const canvas = document.createElement("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

export const mergeImages = async (tiles: XYZRaster[], options: MergeImageOptions, cb: Function) => {
    const { width, height, crossOrigin } = options;
    canvas.width = width;
    canvas.height = height;
    if (ctx) {
        const loader = tiles.map(async (tile) => {
            return new Promise((res, rej) => {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, tile.xOffset, tile.yOffset, 256, 256);
                    res(null);
                    cb();
                };
                img.onerror = res;
                img.crossOrigin = crossOrigin || null;
                img.src = tile.src;
            });
        })
        await Promise.all(loader);
        return canvas.toDataURL('image/jpeg');
    }

    throw new Error('Could not get canvas context for merging tile images')
    return '';
}