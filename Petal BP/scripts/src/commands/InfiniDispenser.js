import {c} from './core.js'

const ID=new Map()

function gLK(loc,dimId){
  return `${dimId}:${Math.floor(loc.x)},${Math.floor(loc.y)},${Math.floor(loc.z)}`
}

function sM(dim,loc,lk,sI){
  const ex=ID.get(lk)
  if(ex?.iId){
    c.S.clearRun(ex.iId)
  }

  const iId=c.S.runInterval(()=>{
    try{
      const blk=dim.getBlock(loc)
      if(!blk||blk.typeId!=='minecraft:dispenser'){
        stM(lk)
        return
      }

      const inv=c.gBI(blk)
      if(!inv)return

      const cnt=inv
      if(!cnt)return

      const dt=ID.get(lk)
      if(!dt)return

      for(let sl=0;sl<cnt.size;sl++){
        const cI=cnt.getItem(sl)
        const sI=dt.items[sl]
        
        if(sI){
          if(!cI||cI.amount<sI.amount){
            cnt.setItem(sl,new c.IS(sI.typeId,sI.amount))
          }
        }
      }
    }catch(e){
    }
  },1)

  ID.set(lk,{
    items:sI,
    iId:iId,
    dimension:dim,
    location:loc
  })
}

function stM(lk){
  const dt=ID.get(lk)
  if(dt?.iId){
    c.S.clearRun(dt.iId)
  }
  ID.delete(lk)
}

c.S.beforeEvents.startup.subscribe(i=>{
  c.rC(i,"petal:infidispenser","Make dispensers have infinite items",c.CP.Any,
    [c.E("petal:infidispenser_action")],
    (o,act)=>{
      const src=o.sourceEntity
      if(!src)return

      const blk=src.getBlockFromViewDirection({maxDistance:10})
      if(!blk||blk.block.typeId!=='minecraft:dispenser'){
        c.ME(src,"Look at a dispenser to use this command")
        return
      }

      const dsp=blk.block
      const lk=gLK(dsp.location,dsp.dimension.id)

      switch(act){
        case "set":{
          const inv=c.gBI(dsp)
          if(!inv){
            c.ME(src,"Failed to access dispenser inventory")
            return
          }

          const cnt=inv
          if(!cnt){
            c.ME(src,"Failed to access dispenser container")
            return
          }

          const sI={}
          let hI=false
          for(let sl=0;sl<cnt.size;sl++){
            const itm=cnt.getItem(sl)
            if(itm){
              sI[sl]={
                typeId:itm.typeId,
                amount:itm.amount
              }
              hI=true
            }
          }

          if(!hI){
            c.ME(src,"Dispenser is empty")
            return
          }

          ID.set(lk,sI)
          sM(dsp.dimension,dsp.location,lk,sI)

          c.MS(src,"Dispenser set to infinite mode")
          break
        }

        case "reset":{
          if(!ID.has(lk)){
            c.MI(src,"This dispenser is not in infinite mode")
            return
          }

          stM(lk)
          c.MS(src,"Dispenser reset to normal mode")
          break
        }

        default:
          c.ME(src,"Usage: /petal:infidispenser <set|reset>")
      }
    },
    true,
    {
      "petal:infidispenser_action":["set","reset"]
    }
  )
})