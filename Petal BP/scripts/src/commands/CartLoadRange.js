import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{

  const A=new Map(),C=16,DD=200,RW=40

  const dCR=(crt,vM,oT=c.S.currentTick,fY=null,pR=false)=>{
    const dY=fY??Math.floor(crt.location.y)-1
    const ch={bX:Math.floor(crt.location.x/C)*C,bZ:Math.floor(crt.location.z/C)*C,dY}
    const ln=[]
    const ag=c.S.currentTick-oT
    const sR=ag>=DD-RW
    
    for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){
      const chX=ch.bX+dx*C,chZ=ch.bZ+dz*C
      const co=[
        {x:chX,y:ch.dY,z:chZ},
        {x:chX+C,y:ch.dY,z:chZ},
        {x:chX+C,y:ch.dY,z:chZ+C},
        {x:chX,y:ch.dY,z:chZ+C}
      ]
      for(let k=0;k<4;k++){
        const l=new c.DL(co[k],co[(k+1)%4])
        l.color=sR?{red:1,green:0,blue:0}:{red:1,green:1,blue:0}
        l.duration=999999
        c.DD.addShape(l)
        ln.push(l)
      }
    }
    vM.set(crt.id,{lines:ln,createdTick:oT,lastChX:ch.bX,lastChZ:ch.bZ,baseY:dY,expired:false,red:sR})
  }

  const sC=(lns,r,g,b)=>{
    for(const l of lns)l.color={red:r,green:g,blue:b}
  }

  const rVE=(id,vM)=>{
    const e=vM.get(id)
    if(!e)return
    for(const l of e.lines)c.DD.removeShape(l)
    e.expired=true
    vM.set(id,e)
  }

  const uCR=pid=>{
    const pd=A.get(pid)
    if(!pd?.e)return
    const p=c.W.getEntity(pid)
    if(!p)return

    const crts=p.dimension.getEntities({type:"minecraft:minecart"})
    const cT=c.S.currentTick
    const cI=new Set()

    for(const crt of crts){
      cI.add(crt.id)
      const eE=pd.cV.get(crt.id)
      if(eE){
        const ag=cT-eE.createdTick
        if(eE.expired)continue
        if(ag>=DD){rVE(crt.id,pd.cV);continue}
        
        const currChX=Math.floor(crt.location.x/C)*C
        const currChZ=Math.floor(crt.location.z/C)*C
        const chunkChanged=currChX!==eE.lastChX||currChZ!==eE.lastChZ
        const turningRed=ag>=DD-RW&&!eE.red

        if(chunkChanged||turningRed){
          for(const l of eE.lines)c.DD.removeShape(l)
          dCR(crt,pd.cV,eE.createdTick,eE.baseY,turningRed||eE.red)
        }
      }else dCR(crt,pd.cV)
    }

    for(const[id,e]of pd.cV.entries())if(!cI.has(id)){for(const l of e.lines)c.DD.removeShape(l);pd.cV.delete(id)}
  }

  const eCR=pid=>{
    if(A.get(pid)?.e)return false
    const tI=c.S.runInterval(()=>uCR(pid),1)
    A.set(pid,{e:true,tI,cV:new Map()})
    return true
  }

  const dCR2=pid=>{
    const pd=A.get(pid)
    if(!pd?.e)return false
    c.S.clearRun(pd.tI)
    for(const[id,e]of pd.cV.entries())for(const l of e.lines)c.DD.removeShape(l)
    A.delete(pid)
    return true
  }

  c.rC(
    i,
    "petal:cartloadrange",
    "Show 5x5 chunk area around minecarts",
    c.CP.Any,
    [c.E("petal:cartloadrangeoptions")],
    (o,act)=>{
      const p=o.sourceEntity
      if(!p)return
      const a=act.toLowerCase()
      if(["enable","show","on"].includes(a)){
        if(eCR(p.id))c.MS(p,"cartloadrange enabled. This is designed to work with §2§lCanopy§r§a and its UniversalChunkLoading rule")
        else c.MI(p,"cartloadrange already enabled.")
      }else if(["disable","hide","off"].includes(a)){
        if(dCR2(p.id))c.MS(p,"cartloadrange disabled.")
        else c.MI(p,"cartloadrange already disabled.")
      }else c.ME(p,"Invalid action. Use enable/disable.")
    },
    false,
    {"petal:cartloadrangeoptions":["enable","disable"]},
    false
  )
})