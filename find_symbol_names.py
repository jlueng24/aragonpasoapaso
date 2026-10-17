exec(open('research/expand_symbols.py').read().split('keys=list(candidates)')[0])
def cat(p):
 u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','list':'categorymembers','cmtitle':'Category:'+p['name'],'cmlimit':500,'format':'json'})
 try:
  j=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30))
  return p['id'],[x['title'] for x in j['query']['categorymembers'] if re.search('escud|escut|bander|flag|arms|shield',x['title'],re.I)]
 except Exception as e:return p['id'],str(e)
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(cat,places))
json.dump(dict(r),open('research/symbol-categories.json','w'),ensure_ascii=False,indent=2)
print(json.dumps(dict(r),ensure_ascii=False,indent=2))
