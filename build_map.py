"""Build a compact display map and shared-edge graph from IGEAR WFS data."""
import json, math, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent
raw = json.loads((ROOT / 'research/Municipio.json').read_text())['features']
prov = json.loads((ROOT / 'research/Provincia.json').read_text())['features']

def rings(feature):
    g = feature['geometry']
    return g['coordinates'] if g['type'] == 'Polygon' else [r for p in g['coordinates'] for r in p]

points = [p for f in raw for r in rings(f) for p in r]
coslat = math.cos(math.radians(41.5))
xmin, xmax = min(p[0] for p in points), max(p[0] for p in points)
ymin, ymax = min(p[1] for p in points), max(p[1] for p in points)
scale = 1000 / ((xmax - xmin) * coslat)
def xy(p): return [round((p[0] - xmin) * coslat * scale, 2), round((ymax - p[1]) * scale, 2)]

def simplify(pts, tolerance=.0006):
    if len(pts) < 4: return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0]-a[0], b[1]-a[1]
    den = dx*dx + dy*dy
    best, idx = 0, 0
    for i, p in enumerate(pts[1:-1], 1):
        t = max(0, min(1, ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den)) if den else 0
        d = (p[0]-a[0]-t*dx)**2 + (p[1]-a[1]-t*dy)**2
        if d > best: best, idx = d, i
    if best > tolerance*tolerance:
        return simplify(pts[:idx+1], tolerance)[:-1] + simplify(pts[idx:], tolerance)
    return [a, b]

def geom(f):
    rr = rings(f)
    ps = [xy(p) for r in rr for p in r]
    box = [min(p[0] for p in ps), min(p[1] for p in ps), max(p[0] for p in ps), max(p[1] for p in ps)]
    # Polygon area centroid, with largest exterior ring for multipart municipalities.
    ring = max(rr, key=lambda r: abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(r,r[1:]))))
    area = sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(ring,ring[1:]))
    centroid = [sum((a[k]+b[k])*(a[0]*b[1]-b[0]*a[1]) for a,b in zip(ring,ring[1:]))/(3*area) for k in [0,1]] if area else ring[0]
    path = ' '.join('M'+'L'.join(','.join(str(v) for v in xy(p)) for p in simplify(r))+'Z' for r in rr)
    return {'path':path,'bbox':box,'point':xy(centroid)}

segments = collections.defaultdict(set)
for f in raw:
    code = str(f['properties']['c_muni_ine'])
    for r in rings(f):
        for a,b in zip(r,r[1:]):
            key=tuple(sorted([tuple(round(x,6) for x in a[:2]),tuple(round(x,6) for x in b[:2])]))
            if key[0] != key[1]: segments[key].add(code)
neighbors = collections.defaultdict(set)
for ids in segments.values():
    if len(ids)>1:
        for code in ids: neighbors[code].update(ids-{code})
features=[]
for f in raw:
    p=f['properties'];code=str(p['c_muni_ine'])
    features.append({'id':code,'name':p['d_muni_ine'],'comarca':p['d_comarca'],'province':p['provincia'],'neighbors':sorted(neighbors[code]),**geom(f)})
out={'bounds':[-35,-35,1070,round((ymax-ymin)*scale+70,2)],'municipalities':features,'provinces':[{'name':f['properties']['provincia'],**geom(f)} for f in prov], 'source':'https://icearagon.aragon.es/portal/wfs.jsp','retrieved':'2026-10-15'}
(ROOT/'dist/map-data.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
print(json.dumps({'municipalities':len(features),'provinces':len(prov),'bytes':(ROOT/'dist/map-data.json').stat().st_size,'originNeighbors':next(f['neighbors'] for f in features if f['id']=='44118')}))
