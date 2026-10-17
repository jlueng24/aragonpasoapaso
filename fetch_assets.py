import urllib.request,urllib.parse,json,hashlib,concurrent.futures,time,re
from pathlib import Path
root=Path('/workspace/sites/aragon-paso-a-paso')
names=['La_Ginebrosa','Aguaviva','La_Cañada_de_Verich','Torrevelilla','Calanda','Foz-Calanda']
files=[t+'_de_'+n+'.svg' for n in names for t in ['Bandera','Escudo']]
def get(f):
 h=hashlib.md5(f.encode()).hexdigest();u='https://upload.wikimedia.org/wikipedia/commons/'+h[0]+'/'+h[:2]+'/'+urllib.parse.quote(f)+'?download=1'
 try:
  b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=18).read()
  if b'<svg' not in b: return [f,'NOT SVG']
  (root/'dist/assets'/f).write_bytes(b)
  return [f,len(b)]
 except Exception as e: return [f,str(e)]
print(json.dumps(list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(get,files)),ensure_ascii=False))
u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','titles':'|'.join('File:'+f for f in files),'prop':'imageinfo','iiprop':'url|extmetadata','format':'json'})
try:
 b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=20).read();(root/'research/commons.json').write_bytes(b)
 j=json.loads(b); print('metadata',[(p['title'],p.get('missing','found')) for p in j['query']['pages'].values()])
except Exception as e: print('metadata',str(e))
