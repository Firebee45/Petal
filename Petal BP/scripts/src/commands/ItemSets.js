import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  const ISA=['casual','tmc','split','nonstackable','bulk']
  const ISS={
    casual:'mystructure:casual_IS',
    tmc:'mystructure:TMC_IS',
    split:'mystructure:split_IS',
    nonstackable:'mystructure:NSIS',
    bulk:'mystructure:Bulk_IS'
  }

  c.rC(
    i,
    "petal:itemset",
    "Loads a specific item set structure",
    c.CP.Any,
    [c.E("petal:itemsetname")],
    (o,isn)=>{
      const IV=ISA.includes(isn)

      switch(true){
        case o.sourceType==="Block"&&IV:{
          const {x,y,z}=o.sourceBlock.location
          c.S.run(()=>{
            c.W.structureManager.place(
              ISS[isn],
              o.sourceBlock.dimension,
              {x:x+1,y:y,z:z+1}
            )
          })
          break
        }
        case o.sourceType==="Block"&&!IV:{
          break
        }
        case o.sourceType==="Entity"&&IV:{
          const {x,y,z}=o.sourceEntity.location
          c.S.run(()=>{
            c.W.structureManager.place(
              ISS[isn],
              o.sourceEntity.dimension,
              {x:x+1,y:y,z:z+1}
            )
          })
          c.MS(o.sourceEntity,`Loaded item set ${isn}`)
          break
        }
        case o.sourceType==="Entity"&&!IV:{
          c.ME(o.sourceEntity,`${isn} is not a valid item set. Please try again`)
          break
        }
      }
    },
    true,
    {"petal:itemsetname":ISA}
  )
})