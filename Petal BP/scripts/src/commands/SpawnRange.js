import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  const A=new Map()
  
  const shSR=(p,sm)=>{
    const ex=A.get(p.id)
    if(ex)c.rS(ex.ln)
    
    const l=p.location
    const px=l.x,py=l.y+0.6,pz=l.z
    const cy=c.HxC(0x00ffff)
    const mg=c.HxC(0xff00ff)
    const or={red:1.0,green:0.5,blue:0.0}
    const ln=[]
    
    const mnR=24
    const dsR=sm===4?44:128
    
    c.dSp(px,py,pz,mnR,cy,ln)
    c.dSp(px,py,pz,dsR,sm===4?mg:or,ln)
    
    A.set(p.id,{ln,sm})
    
    if(sm===4){
      c.MS(p,"spawn sphere: §bcyan=24§f (min spawn), §dmagenta=44§f (despawn)")
    }else{
      c.MS(p,"spawn sphere: §bcyan=24§f (min spawn), §6orange=128§f (despawn)")
    }
  }
  
  c.rC(
    i,
    "petal:spawnrange",
    "Show mob spawn sphere ranges",
    c.CP.Any,
    [c.E("petal:spawnrangeoptions")],
    (o,ac)=>{
      const p=o.sourceEntity
      if(!p)return
      const a=ac.toLowerCase()
      if(a==="show")shSR(p,4)
      else if(a==="clear"){
        const ex=A.get(p.id)
        if(ex){
          c.rS(ex.ln)
          A.delete(p.id)
          c.MS(p,"spawnrange cleared")
        }else{
          c.MI(p,"No spawnrange to clear")
        }
      }
      else if(["4","6","8","10","12"].includes(a))shSR(p,parseInt(a))
      else c.ME(p,"Invalid action. Use show/clear/4/6/8/10/12.")
    },
    false,
    {"petal:spawnrangeoptions":["show","clear","4","6","8","10","12"]},
    false
  )
})