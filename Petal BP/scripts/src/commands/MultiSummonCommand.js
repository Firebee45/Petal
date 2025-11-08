import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i => {
  c.rC(i, "petal:multisummon", "Summon multiple entities at a location", c.CP.Any,
    [c.ET("entity"), c.I("amount"), c.L("location")],
    (o, entity, amount, location) => {
      const amt = Math.max(1, Math.min(amount || 1, 1000))
      const entityId = entity?.id || entity

      switch (o.sourceType) {
        case "Block": {
          const dim = o.sourceBlock?.dimension
          if (!dim) return
          for (let j = 0; j < amt; j++) {
            c.S.run(() => dim.spawnEntity(entityId, location))
          }
          break
        }

        case "Entity": {
          const pl = o.sourceEntity
          const dim = pl?.dimension
          if (!pl || !dim) return
          for (let j = 0; j < amt; j++) {
            c.S.run(() => dim.spawnEntity(entityId, location))
          }
          c.MS(pl, `Summoned ${amt} ${c.NS(entityId)}`)
          break
        }
      }
    },
    true
  )
})