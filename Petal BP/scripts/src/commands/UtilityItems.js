import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  c.rC(
    i,
    "petal:utilityitems",
    "Spawns useful utility items structure",
    c.CP.Any,
    [],
    (o)=>{
      switch(o.sourceType){
        case "Block":{
          const {x,y,z}=o.sourceBlock.location
          c.S.run(()=>{
            c.W.structureManager.place(
              'mystructure:usefulitems',
              o.sourceBlock.dimension,
              {x:x,y:y+1,z:z}
            )
          })
          break
        }
        case "Entity":{
          const {x,y,z}=o.sourceEntity.location
          c.S.run(()=>{
            c.W.structureManager.place(
              'mystructure:usefulitems',
              o.sourceEntity.dimension,
              {x:x,y:y-1,z:z}
            )
          })
          c.MS(o.sourceEntity,'Loaded utility items')
          break
        }
      }
    },
    true
  )
})