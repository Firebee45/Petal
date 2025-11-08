import {ItemStack as IS,system as S,CommandPermissionLevel as CP,CustomCommandParamType as CT,world as W,BlockComponentTypes as BCT} from '@minecraft/server'
import {debugDrawer as DD,DebugLine as DL} from '@minecraft/debug-utilities'

export const c={
  IS,
  S,
  CP,
  CT,
  W,
  DD,
  DL,
  BCT,
  
  rC:(i,n,ds,p,m,cb,tr=false,enums={},dM=false,op=[])=>{
    if(Object.keys(enums).length>0){
      for(const[eN,eV]of Object.entries(enums)){
        try{
          i.customCommandRegistry.registerEnum(eN,eV)
        }catch(e){
        }
      }
    }
    i.customCommandRegistry.registerCommand({
      name:n,
      description:ds,
      permissionLevel:p,
      mandatoryParameters:m,
      optionalParameters:op
    },(o,...args)=>{
      if(tr){
        const pl=o.sourceEntity
        if(!pl||!pl.hasTag("PetalAdmin")){
          if(pl)c.ME(pl,"You need the PetalAdmin tag to use this command")
          return
        }
      }
      cb(o,...args)
    })
    try{
      if(!c._rC)c._rC=[]
      c._rC.push({
        name:n.replace(/^petal:/,""),
        description:ds,
        requiresTag:tr,
        dualMode:dM
      })
    }catch(e){
      console.warn("Petal help tracking failed:",e)
    }
  },

  rSE:(n,ds,params)=>{
    try{
      if(!c._rSE)c._rSE=[]
      c._rSE.push({
        name:n,
        description:ds,
        params:params
      })
    }catch(e){
      console.warn("Petal script event tracking failed:",e)
    }
  },
  
  IT:(n)=>({type:CT.ItemType,name:n}),
  I:(n)=>({type:CT.Integer,name:n}),
  L:(n)=>({type:CT.Location,name:n}),
  Str:(n)=>({type:CT.String,name:n}),
  ET:(n)=>({type:CT.EntityType,name:n}),
  F:(n)=>({type:CT.Float,name:n}),
  E:(n)=>({type:CT.Enum,name:n}),
  
  sI:(d,i,a,l)=>d.spawnItem(new IS(i,a),l).clearVelocity(),

  NS:(nm)=>{
    if(!nm||typeof nm!=="string")return nm
    return nm
      .replace(/^minecraft:/,"")
      .replace(/_/g," ")
      .replace(/\b\w/g,l=>l.toUpperCase())
  },

  GV:(p,d=6)=>{try{return p?.getBlockFromViewDirection({maxDistance:d})?.block||null}catch{return null}},
  GI:(b)=>{try{return b?.getComponent("minecraft:inventory")?.container||null}catch{return null}},
  gBI:(b)=>{try{return b?.getComponent(c.BCT.Inventory)?.container||null}catch{return null}},
  CI:(inv)=>{if(!inv)return;for(let i=0;i<inv.size;i++)inv.setItem(i,undefined)},
  SI:(inv,i,id,n=1)=>{try{if(inv&&i<inv.size)inv.setItem(i,new c.IS(id,n))}catch{}},
  BV:(cd)=>/^[01]+$/.test(cd),
  QS:(s)=>{
    if(!s)return s
    s=String(s).trim()
    if((s.startsWith('"')&&s.endsWith('"'))||(s.startsWith("'")&&s.endsWith("'")))return s.slice(1,-1)
    return s
  },

  MI:(p,m)=>p.sendMessage("§5Petal§f §e"+m+"§r"),
  MS:(p,m)=>p.sendMessage("§5Petal§f §a"+m+"§r"),
  ME:(p,m)=>p.sendMessage("§5Petal§f §c"+m+"§r"),

  HxC:(h)=>({
    red:((h>>16)&255)/255,
    green:((h>>8)&255)/255,
    blue:(h&255)/255
  }),

  rS:(arr)=>{
    for(const sh of arr){
      try{c.DD.removeShape(sh)}catch{}
    }
  },

  dCO:(x,z,y,cl,ln,cs=16)=>{
    const p=[
      {x,y,z},
      {x:x+cs,y,z},
      {x:x+cs,y,z:z+cs},
      {x,y,z:z+cs}
    ]
    const e=[[0,1],[1,2],[2,3],[3,0]]
    for(const[a,b]of e){
      const l=new c.DL(p[a],p[b])
      l.color=cl
      l.duration=0
      c.DD.addShape(l)
      ln.push(l)
    }
  },

  dBx:(co,cl,ln,dr=0)=>{
    const b={x:co.x,y:co.y,z:co.z}
    const cr=[
      {x:b.x,y:b.y,z:b.z},
      {x:b.x+1,y:b.y,z:b.z},
      {x:b.x+1,y:b.y,z:b.z+1},
      {x:b.x,y:b.y,z:b.z+1},
      {x:b.x,y:b.y+1,z:b.z},
      {x:b.x+1,y:b.y+1,z:b.z},
      {x:b.x+1,y:b.y+1,z:b.z+1},
      {x:b.x,y:b.y+1,z:b.z+1}
    ]
    const e=[
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ]
    for(const[i,j]of e){
      const l=new c.DL(cr[i],cr[j])
      l.color=cl
      l.duration=dr
      c.DD.addShape(l)
      ln.push(l)
    }
  },

  dCr:(cX,cY,cZ,r,ax,cl,sg,ln)=>{
    const aS=(Math.PI*2)/sg
    for(let i=0;i<sg;i++){
      const a1=i*aS,a2=(i+1)*aS
      let p1,p2
      if(ax==='y'){
        p1={x:cX+r*Math.cos(a1),y:cY,z:cZ+r*Math.sin(a1)}
        p2={x:cX+r*Math.cos(a2),y:cY,z:cZ+r*Math.sin(a2)}
      }else if(ax==='x'){
        p1={x:cX,y:cY+r*Math.cos(a1),z:cZ+r*Math.sin(a1)}
        p2={x:cX,y:cY+r*Math.cos(a2),z:cZ+r*Math.sin(a2)}
      }else if(ax==='z'){
        p1={x:cX+r*Math.cos(a1),y:cY+r*Math.sin(a1),z:cZ}
        p2={x:cX+r*Math.cos(a2),y:cY+r*Math.sin(a2),z:cZ}
      }
      const l=new c.DL(p1,p2)
      l.color=cl
      l.duration=0
      c.DD.addShape(l)
      ln.push(l)
    }
  },

  dSp:(cX,cY,cZ,r,cl,ln,sg=48)=>{
    c.dCr(cX,cY,cZ,r,'y',cl,sg,ln)
    c.dCr(cX,cY,cZ,r,'x',cl,sg,ln)
    c.dCr(cX,cY,cZ,r,'z',cl,sg,ln)
  },

  clD:(m,pId)=>{
    const e=m.get(pId)
    if(!e)return false
    c.rS(e.lines||e.L||[])
    m.delete(pId)
    return true
  }
}