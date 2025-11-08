import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  c.rC(
    i,
    "petal:petal",
    "Show all available commands",
    c.CP.Any,
    [],
    (o)=>{
      const p=o.sourceEntity
      if(!p)return

      const cm=c._rC||[]
      const se=c._rSE||[]

      c.MI(p,"§l§fNormal Commands:")
      for(const cmd of cm){
        if(!cmd.requiresTag){
          const dN=cmd.dualMode?" §e*":""
          p.sendMessage(`§d/${cmd.name} §7${cmd.description}${dN}`)
        }
      }

      const ad=cm.filter(cmd=>cmd.requiresTag)
      if(ad.length>0){
        c.MI(p,"§l§fPetalAdmin Commands:")
        for(const cmd of ad){
          const dN=cmd.dualMode?" §e*":""
          p.sendMessage(`§d/${cmd.name} §7${cmd.description}${dN}`)
        }
      }

      if(se.length>0){
        c.MI(p,"§l§fScript Events:")
        for(const s of se){
          p.sendMessage(`§d/scriptevent ${s.name} ${s.params}`)
          p.sendMessage(`§7  ${s.description}`)
        }
      }

      const dl=cm.filter(cmd=>cmd.dualMode&&cmd.dualMessage)
      if(dl.length>0){
        c.MI(p,"§lDual-Mode Explanation:")
        for(const cmd of dl){
          p.sendMessage(`§d/${cmd.name} §7${cmd.dualMessage}`)
        }
      }
    }
  )
})