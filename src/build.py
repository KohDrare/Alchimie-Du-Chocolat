import json,re,os
here=os.path.dirname(os.path.abspath(__file__))
R=lambda f:open(os.path.join(here,f),encoding='utf8').read()
d=json.load(open('/home/claude/extract/data.json'))
logo=R('logo.svg') if os.path.exists(os.path.join(here,'logo.svg')) else open('/home/claude/extract/logo.svg').read()
logo=re.sub(r'\s+',' ',logo).replace('class="logo"','class="logo" focusable="false"')
light=re.sub(r"(fill|stroke)=\"#(4B2A00|010202)\"",r"\1=\"#F3ECE2\"",logo,flags=re.I)
data={
 'pralines':d['pralines']['CATS'],
 'palets':d['palets']['CATS'],'macarons':d['macarons']['CATS'],'thes':d['thes']['CATS'],
 'napo':[{k:v for k,v in i.items() if k!='art'} for i in d['napolitains']['ITEMS']],
}
js='const DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const LOGO_LIGHT='+json.dumps(light)+';\n'+R('app.js')+'\n'+R('acc.js')
html=f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f3ece2">
<title>L'alchimie du chocolat — Commander en ligne · Waterloo & Ixelles</title>
<meta name="description" content="Chocolaterie artisanale à Waterloo et Ixelles. Composez votre ballotin praline par praline, précommandez pour les fêtes et retirez en boutique.">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700;800&family=Allura&display=swap" rel="stylesheet">
<style>
{R('base.css')}
{R('extra.css')}
</style>
</head>
<body>
{R('body.html').replace('%%LOGO%%',logo)}
<script>
{js}
</script>
</body>
</html>
'''
open(os.path.join(here,'..','index.html'),'w',encoding='utf8').write(html)
print(len(html))
