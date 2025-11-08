import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{

  const DS=arr=>({shovels:arr[0]||0,items:arr[1]||0})

  const N01=DS([0,1]),N60=DS([1,60]),N55=DS([3,55]),N51=DS([5,51])
  const N46=DS([7,46]),N42=DS([9,42]),N37=DS([11,37]),N32=DS([13,32])
  const N28=DS([15,28]),N23=DS([17,23]),N19=DS([19,19]),N14=DS([21,14])
  const N10=DS([23,10]),N5=DS([25,5]),N0=DS([27,0])

  const SC=[null,N01,N60,N55,N51,N51,N46,N42,N32,N28,N23,N19,N14,N10,N5,N0]
  const SF=[null,N01,DS([0,14]),DS([0,28]),DS([0,42]),DS([0,55]),DS([1,5]),DS([1,19]),
                      DS([1,32]),DS([1,46]),DS([1,60]),DS([2,10]),DS([2,23]),DS([2,37]),DS([2,51]),DS([3,0])]
  const SD=[null,N01,DS([0,42]),DS([1,19]),N60,DS([2,37]),DS([3,14]),N55,DS([4,32]),
                        DS([5,10]),N51,DS([6,28]),DS([7,5]),N46,DS([8,23]),N0]
  const SH=[null,N01,DS([0,23]),DS([0,45]),DS([1,5]),DS([1,28]),DS([1,51]),DS([2,10]),DS([2,32]),
                     DS([2,55]),DS([3,14]),DS([3,37]),DS([3,60]),DS([4,19]),DS([4,42]),N0]
  const SM=[null,1,2,3,4,5,6,null,8]
  const SL=[null,1,2,3,4,5,6]
  const CB={2:6,4:5,6:4,8:3,10:2,12:1,14:0}

  const fI=(inv,shv,itm)=>{
    if(!inv)return
    c.S.run(()=>{
      c.CI(inv)
      let sl=0
      for(let i=0;i<shv&&sl<inv.size;i++,sl++)inv.setItem(sl,new c.IS("minecraft:wooden_shovel",1))
      if(itm>0&&sl<inv.size)inv.setItem(sl,new c.IS("minecraft:barrier",itm))
    })
  }

  const gBI=b=>{try{return b?.typeId||b?.type?.id||""}catch{return""}}
  const cFC=(dt,ssN,dN)=>{
    const shv=dt.shovels||0,itm=dt.items||0
    return `To get SS${ssN} from ${dN} Add ${shv} nonstackables and ${itm} items.`
  }

  c.rC(
    i,
    "petal:ss",
    "Set comparator Signal Strength (SS) for the target container/block",
    c.CP.Any,
    [c.F("ss")],
    (o,ssN=1)=>{
      const pl=o.sourceEntity
      if(!pl)return
      ssN=Math.round(ssN)
      if(isNaN(ssN)||ssN<1||ssN>15)return c.ME(pl,"Usage: /petal:ss <1-15>")

      const blk=c.GV(pl)
      if(!blk)return c.ME(pl,"No block in view.")
      const id=gBI(blk).toLowerCase(),inv=c.GI(blk)
      const dim=pl.dimension
      const {x,y,z}=blk.location
      let ap=false,dFC=null,dN=id
      const isAdmin=pl.hasTag("PetalAdmin")

      const mp=[
        {ids:["chest","barrel","shulker_box"],map:SC,name:"chest"},
        {ids:["furnace","smoker","blast_furnace"],map:SF,name:"furnace"},
        {ids:["dispenser","dropper"],map:SD,name:"dispenser"},
        {ids:["hopper"],map:SH,name:"hopper"}
      ]

      for(const e of mp){
        if(e.ids.some(x=>id.includes(x))){
          dFC=e.map[ssN]
          dN=e.name
          if(isAdmin&&inv&&dFC){
            fI(inv,dFC.shovels,dFC.items)
            ap=true
          }
        }
      }

      if(id.includes("composter")){
        const lv=SM[ssN]
        if(lv!=null){
          if(isAdmin){
            c.S.run(()=>{
              dim.runCommand(`setblock ${x} ${y} ${z} minecraft:composter["composter_fill_level":${lv}] replace`)
            })
            ap=true
          }else{
            c.MI(pl,`To get SS${ssN} from composter: Fill composter to level ${lv}.`)
            return
          }
        }
      }
      else if(id.includes("cauldron")){
        const lv=SL[ssN]
        if(lv){
          if(isAdmin){
            c.S.run(()=>{
              dim.runCommand(`setblock ${x} ${y} ${z} minecraft:cauldron["fill_level":${lv}] replace`)
            })
            ap=true
          }else{
            c.MI(pl,`To get SS${ssN} from cauldron: Fill cauldron to level ${lv}.`)
            return
          }
        }
      }
      else if(id.includes("cake")){
        const bt=CB[ssN]
        if(bt!==undefined){
          if(isAdmin){
            c.S.run(()=>{
              dim.runCommand(`setblock ${x} ${y} ${z} minecraft:cake["bite_counter":${bt}] replace`)
            })
            ap=true
          }else{
            const bitesLeft=6-bt
            if(bt===0){
              c.MI(pl,`To get SS${ssN} from cake: Use a fresh cake (no bites taken).`)
            }else{
              c.MI(pl,`To get SS${ssN} from cake: take ${bt} bite${bt===1?'':'s'}.`)
            }
            return
          }
        }
      }

      if(ap)c.MS(pl,`Set ${dN} SS${ssN}.`)
      else if(dFC)c.MI(pl,cFC(dFC,ssN,dN))
      else c.ME(pl,"Unsupported block type or SS not defined.")
    },
    false,
    {},
    true
  )

  if(!c._rC)c._rC=[]
  var ex=null
  for(var j=0;j<c._rC.length;j++){
    if(c._rC[j].name==="ss"){
      ex=c._rC[j]
      break
    }
  }

  if(ex){
    ex.requiresTag=true
    ex.dualMode=true
    ex.dualMessage="Shows how many nonstackables and items are needed to reach the desired SS if you do not have the PetalAdmin tag."
  }else{
    c._rC.push({
      name:"ss",
      description:"Set comparator Signal Strength (SS) for the target container/block",
      requiresTag:true,
      dualMode:true,
      dualMessage:"Shows how many nonstackables and items are needed to reach the desired SS if you do not have the PetalAdmin tag."
    })
  }
})