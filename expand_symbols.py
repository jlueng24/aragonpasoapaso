import urllib.request,urllib.parse,json,concurrent.futures,re,unicodedata,time
from pathlib import Path
root=Path('/workspace/sites/aragon-paso-a-paso')
places=[p for p in json.load(open(root/'dist/map-data.json'))['municipalities'] if p['comarca'] in ['Bajo Aragón','Matarraña / Matarranya']]
old=json.load(open(root/'dist/pilot-content.json'))
candidates={}
for p in places:
 for kind,prefix in [('flag','Bandera'),('shield','Escudo')]:
  if old.get(p['id'],{}).get(kind):continue
  for n in [p['name'],re.sub(r'^(La|Las|Los) ','',p['name']),p['name'].lower()]:
   candidates[f'File:{prefix} de {n}.svg']=(p['id'],kind)
def fetch(titles):
 u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','titles':'|'.join(titles),'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':500,'redirects':1,'format':'json'})
 try:return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=40))
 except Exception as e:return {'error':str(e)}
keys=list(candidates)
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,[keys[x:x+40] for x in range(0,len(keys),40)]))
json.dump({'candidates':candidates,'results':results},open(root/'research/symbol-batch.json','w'),ensure_ascii=False,indent=2)
for r in results:
 for p in r.get('query',{}).get('pages',{}).values():
  if p.get('imageinfo'): print(p['title'],p['imageinfo'][0].get('extmetadata',{}).get('Artist'))
 if 'error'in r:print(r)
