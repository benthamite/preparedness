"""Sample CHELSA V2.1 monthly mean temperature (1981-2010) at city points.

Called by tools/build-cities.mjs; run with `python3 -I`.

Usage: python3 -I tools/sample-chelsa.py CHELSA_DIR POINTS_JSON OUT_JSON

POINTS_JSON is a list of [id, lat, lon]. OUT_JSON maps each id to
{"months": [12 values in degrees C, one decimal], "cells": n}, where n is how
many cells (in the larger of the two directions) the value was taken from
the city's own cell. CHELSA V2.1 has values over the sea as well as land, so
n is normally 0; should the city's cell hold no data, the nearest cell with
data within MAX_CELLS (about 4.6 km at the equator) is used, and a city with
none that close gets {"months": null}.
"""

import json
import os
import sys

import numpy as np
import rasterio
from rasterio.windows import Window

MAX_CELLS = 5


def main(chelsa_dir, points_json, out_json):
    with open(points_json) as f:
        points = json.load(f)
    # Sort by position so neighbouring reads hit the same cached blocks.
    points.sort(key=lambda p: (round(-p[1], 1), p[2]))
    months = np.full((len(points), 12), np.nan)
    cells = np.full(len(points), -1)
    offsets = [(dr, dc) for dr in range(-MAX_CELLS, MAX_CELLS + 1)
               for dc in range(-MAX_CELLS, MAX_CELLS + 1)]
    offsets.sort(key=lambda o: (o[0] ** 2 + o[1] ** 2, o))
    # The nearest land cell is chosen from January's raster and reused for the
    # other months, so the twelve values always come from one cell.
    chosen = [None] * len(points)
    with rasterio.Env(GDAL_CACHEMAX=1024):
        for m in range(12):
            path = os.path.join(chelsa_dir, f"CHELSA_tas_{m + 1:02d}_1981-2010_V.2.1.tif")
            with rasterio.open(path) as d:
                scale = d.scales[0]
                offset = d.offsets[0]
                nodata = d.nodata
                for i, (_id, lat, lon) in enumerate(points):
                    row, col = d.index(lon, lat)
                    win = Window(col - MAX_CELLS, row - MAX_CELLS, 2 * MAX_CELLS + 1, 2 * MAX_CELLS + 1)
                    block = d.read(1, window=win, boundless=True, fill_value=nodata)
                    if m == 0:
                        for dr, dc in offsets:
                            if block[MAX_CELLS + dr, MAX_CELLS + dc] != nodata:
                                chosen[i] = (dr, dc)
                                cells[i] = max(abs(dr), abs(dc))
                                break
                    if chosen[i] is None:
                        continue
                    dr, dc = chosen[i]
                    raw = block[MAX_CELLS + dr, MAX_CELLS + dc]
                    if raw == nodata:
                        continue
                    months[i, m] = raw * scale + offset - 273.15
            print(f"  month {m + 1:2d} sampled", flush=True)
    result = {}
    for i, (pid, _lat, _lon) in enumerate(points):
        if np.isnan(months[i]).any():
            result[str(pid)] = {"months": None, "cells": None}
        else:
            result[str(pid)] = {"months": [round(float(v), 1) for v in months[i]], "cells": int(cells[i])}
    with open(out_json + ".part", "w") as f:
        json.dump(result, f)
    os.replace(out_json + ".part", out_json)


if __name__ == "__main__":
    main(*sys.argv[1:4])
