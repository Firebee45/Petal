import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i => {
  c.rC(i, "petal:itemsummon", "summons item entities", c.CP.Any, 
    [c.IT("i"), c.I("a"), c.L("l")],
    (o, it, am, lc) => {
      const d = o.sourceType === "Block" ? o.sourceBlock?.dimension : o.sourceEntity?.dimension
      const p = o.sourceEntity
      
      if (!d) {
        if (p) c.ME(p, "Invalid dimension")
        return
      }
      
      if (!p) return
      
      c.S.run(() => {
        try {
          c.sI(d, it, am, lc)
          c.MS(p, `Summoned ${c.NS(it.id)} ${am}x`)
        } catch (e) {
          c.ME(p, `Failed to summon item: ${e}`)
        }
      })
    },
    true
  )
})