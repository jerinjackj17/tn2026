const ECI_HOME = 'https://results.eci.gov.in/';

function json(statusCode, body){
  return {statusCode, headers:{'content-type':'application/json','access-control-allow-origin':'*','cache-control':'no-store'}, body:JSON.stringify(body)};
}
function clean(s){return String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}

exports.handler = async function(){
  try{
    const home = await fetch(ECI_HOME, {headers:{'user-agent':'Mozilla/5.0 election-dashboard'}}).then(r=>r.text());
    const links = [...home.matchAll(/href=["']([^"']+)["']/gi)].map(m=>m[1]);
    const likely = links.filter(x => /AcResultGen|Constituencywise|partywiseresult|Result/i.test(x));
    const absolute = likely.map(x => x.startsWith('http') ? x : new URL(x, ECI_HOME).href);

    const pages = [];
    for(const url of absolute.slice(0,18)){
      try{
        const html = await fetch(url, {headers:{'user-agent':'Mozilla/5.0 election-dashboard'}}).then(r=>r.text());
        pages.push({url, html});
      }catch(e){}
    }

    const constituencies = [];
    for(const p of pages){
      const rows = [...p.html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1]);
      for(const row of rows){
        const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]));
        if(cells.length < 5) continue;
        const joined = cells.join(' | ');
        if(!/DMK|AIADMK|BJP|INC|NTK|TVK|Leading|Won|Votes/i.test(joined)) continue;
        const acNo = Number(cells.find(c=>/^\d{1,3}$/.test(c)) || 0);
        const name = cells.find(c=>/[A-Za-z]/.test(c) && !/DMK|AIADMK|BJP|INC|Bharatiya|Votes|Leading|Won/i.test(c)) || '';
        const party = cells.find(c=>/DMK|AIADMK|BJP|INC|NTK|TVK|CPI|VCK|PMK|AMMK|DMDK/i.test(c)) || 'Others';
        const nums = cells.map(c=>Number(c.replace(/,/g,''))).filter(n=>Number.isFinite(n) && n>1000);
        if(name) constituencies.push({id:acNo || undefined, name, status:'Live parsed from ECI', candidates:[{party, candidate:'ECI candidate', votes:nums[0]||0, color:'#b40000'}]});
      }
    }

    if(constituencies.length){
      return json(200, {source:'ECI live parsed from results.eci.gov.in', updatedAt:new Date().toISOString(), constituencies});
    }
    const notStarted = /Results trends will start/i.test(home);
    return json(200, {source:'ECI checked. Live constituency tables not available yet.', message:notStarted?'Trends begin at 8:00 AM on 4 May 2026.':'ECI page found but result tables were not parseable yet.', constituencies:[]});
  }catch(error){
    return json(200, {source:'ECI fetch failed. Using bundled fallback data.', error:error.message, constituencies:[]});
  }
}
