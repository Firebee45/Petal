import {c} from './core.js'

const HT={
  SwampHut:{
    mobs:['minecraft:witch'],
    probability:0.3,
    light:7,
    conditions:b=>b[0]?.isSolid&&!b[1]?.isSolid,
    color:{red:0.2,green:1.0,blue:0.3}
  },
  NetherFortress:{
    mobs:['minecraft:wither_skeleton','minecraft:blaze','minecraft:zombie_pigman'],
    probability:0.45,
    light:7,
    conditions:b=>b[0]?.isSolid&&!b[1]?.isSolid,
    color:{red:1.0,green:0.2,blue:0.2}
  },
  PillagerOutpost:{
    mobs:['minecraft:pillager'],
    probability:0.4,
    conditions:b=>(b[0]&&!b[0].isAir)&&!b[1]?.isSolid,
    event:e=>Math.random()<0.3&&e?.runCommand?.('event entity @s minecraft:promote_to_illager_captain'),
    color:{red:0.2,green:0.4,blue:1.0}
  },
  OceanMonument:{
    mobs:['minecraft:guardian'],
    probability:0.3,
    conditions:b=>b[1]?.isLiquid,
    color:{red:0.2,green:0.9,blue:0.9}
  }
}

class HSS{
  constructor({hssId,location,dimension,speed}){
    const t=HT[hssId]
    if(!t)throw new Error('Unknown HSS type: '+hssId)
    this.hssId=hssId
    this.template=t
    this.location=location
    this.dimension=dimension
    this.speed=speed||1
  }

  spawn(){
    c.S.runTimeout(()=>{
      const dim=this.dimension
      const hss=this.template
      if(!c.W.gameRules.doMobSpawning)return

      const loc=this.location
      const p128=dim.getPlayers({location:loc,maxDistance:128})
      const p16=dim.getPlayers({location:loc,maxDistance:16})
      if(p16.length>0||p128.length<=0)return
      if(Math.random()>(hss.probability??1))return

      const b=[
        dim.getBlock({x:loc.x,y:loc.y,z:loc.z}),
        dim.getBlock({x:loc.x,y:loc.y+1,z:loc.z}),
        dim.getBlock({x:loc.x,y:loc.y+2,z:loc.z})
      ]

      let ll=0
      try{ll=dim.getLightLevel(loc)??0}catch{ll=7}

      if(typeof hss.light==='number'&&ll>hss.light)return
      if(!hss.conditions(b))return

      const id=hss.mobs[Math.floor(Math.random()*hss.mobs.length)]
      const e=dim.spawnEntity(id,loc)
      if(e&&typeof hss.event==='function')try{hss.event(e)}catch{}
    },2)
  }
}

const DS=new Map()

function dDB(loc,color,type){
  const {x,y,z}=loc
  const min={x:Math.floor(x),y:Math.floor(y)+1,z:Math.floor(z)}
  const max={x:min.x+1,y:min.y+2,z:min.z+1}

  const cn=[
    {x:min.x,y:min.y,z:min.z},
    {x:max.x,y:min.y,z:min.z},
    {x:max.x,y:min.y,z:max.z},
    {x:min.x,y:min.y,z:max.z},
    {x:min.x,y:max.y,z:min.z},
    {x:max.x,y:max.y,z:min.z},
    {x:max.x,y:max.y,z:max.z},
    {x:min.x,y:max.y,z:max.z}
  ]
  const eg=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
  const ln=[]

  for(const[a,b]of eg){
    const l=new c.DL(cn[a],cn[b])
    l.color=color
    l.duration=999999
    c.DD.addShape(l)
    ln.push(l)
  }

  if(!DS.has(type))DS.set(type,[])
  DS.get(type).push(...ln)
}

function cDB(type){
  const sh=DS.get(type)
  if(!sh)return
  for(const s of sh){
    try{c.DD.removeShape(s)}catch{}
  }
  DS.delete(type)
}

const AH=new Map()

c.S.beforeEvents.startup.subscribe(i=>{
  c.rC(i,"petal:hss","Manage HSS spawn points",c.CP.Any,
    [c.E("petal:action"),c.E("petal:hsstype")],
    (o,act,typ,spd=1)=>{
      const src=o.sourceEntity
      if(!src)return

      const dim=src.dimension
      const loc={...src.location}
      const col=HT[typ]?.color??{red:1,green:1,blue:1}

      switch(act){
        case "add":{
          if(spd<1||spd>500){
            c.ME(src,"Speed multiplier must be between 1 and 500")
            return
          }

          const hss=new HSS({hssId:typ,location:loc,dimension:dim,speed:spd})
          if(!AH.has(typ))AH.set(typ,[])
          AH.get(typ).push(hss)

          dDB(loc,col,typ)

          const lp=()=>{
            const lst=AH.get(typ)
            if(!lst||!lst.includes(hss))return
            
            for(let i=0;i<hss.speed;i++){
              hss.spawn()
            }
            
            c.S.runTimeout(lp,200)
          }
          lp()

          c.MS(src,`Added ${typ} HSS at (${Math.floor(loc.x)}, ${Math.floor(loc.y)}, ${Math.floor(loc.z)})`)
          c.MI(src,`Speed: ${spd}x (1 second = ${spd} simulated seconds)`)
          break
        }

        case "remove":{
          const lst=AH.get(typ)
          if(lst&&lst.length>0){
            AH.delete(typ)
            cDB(typ)
            c.MS(src,`Removed all ${typ} HSS points`)
          }else{
            c.MI(src,`No active ${typ} HSS points to remove`)
          }
          break
        }

        default:
          c.ME(src,"Usage: /petal:hss <add|remove> <type> <speed>")
      }
    },
    true,
    {
      "petal:action":["add","remove"],
      "petal:hsstype":["SwampHut","NetherFortress","PillagerOutpost","OceanMonument"]
    },
    false,
    [c.I("speed")]
  )
})