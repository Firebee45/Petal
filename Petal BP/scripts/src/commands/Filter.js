import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{

  const FC={2:{fs:[0],fc:1,bs:[1,2,3,4],bc:[18,1,1,1]},3:{fs:[0],fc:41,bs:[1,2,3,4],bc:[1,1,1,1]}}
  const PF=new Map()
  const PB=new Map()

  const gId=b=>{try{return b?.typeId?.toLowerCase()||b?.type?.id?.toLowerCase()||""}catch{return""}}
  const gIt=p=>{try{return p.getComponent("minecraft:inventory")?.container?.getItem(p.selectedSlotIndex)||null}catch{return null}}
  const gIn=p=>p.getComponent("minecraft:inventory")?.container
  const cIt=(p,id)=>{try{const inv=gIn(p);if(!inv)return 0;let t=0;for(let i=0;i<inv.size;i++){const it=inv.getItem(i);if(it&&it.typeId===id)t+=it.amount;}return t}catch{return 0}}
  const rmIt=(p,id,n)=>{try{const inv=gIn(p);if(!inv)return false;let r=n;for(let i=0;i<inv.size&&r>0;i++){const it=inv.getItem(i);if(it&&it.typeId===id){if(it.amount<=r){r-=it.amount;inv.setItem(i,undefined)}else{it.amount-=r;inv.setItem(i,it);r=0}}}return r===0}catch{return false}}

  const apH=(p,b,ss,sr)=>{
    const id=gId(b)
    if(!id.includes("hopper"))return false
    const inv=c.GI(b)
    if(!inv)return false
    const it=gIt(p)
    if(!it){c.ME(p,"Hold an item to use as filter");return false}

    const cf=FC[ss]
    const pid=p.id

    if(sr){
      const blk=PB.get(pid)
      if(!blk){c.ME(p,"Set blocker first using /petal:filter blocker");return false}
      const fN=cf.fc,bN=cf.bc.reduce((a,b)=>a+b,0)
      const fC=cIt(p,it.typeId),bC=cIt(p,blk)
      if(fC<fN){c.ME(p,`Need ${fN} filters, have ${fC}`);return false}
      if(bC<bN){c.ME(p,`Need ${bN} blockers, have ${bC}`);return false}

      if(!rmIt(p,it.typeId,fN)){c.ME(p,"Failed to remove filter items");return false}
      if(!rmIt(p,blk,bN)){c.ME(p,"Failed to remove blocker items");return false}

      for(let i=0;i<inv.size;i++)inv.setItem(i,undefined)

      cf.fs.forEach(s=>inv.setItem(s,new c.IS(it.typeId,cf.fc)))
      for(let i=0;i<cf.bs.length;i++)inv.setItem(cf.bs[i],new c.IS(blk,cf.bc[i]))

      c.MS(p,`Set hopper filter to SS${ss}. Used ${fN} filters and ${bN} blockers`)
      return true
    }else{
      for(let i=0;i<inv.size;i++)inv.setItem(i,undefined)

      cf.fs.forEach(s=>inv.setItem(s,new c.IS(it.typeId,cf.fc)))
      for(let i=0;i<cf.bs.length;i++)inv.setItem(cf.bs[i],new c.IS("minecraft:barrier",cf.bc[i]))

      c.MS(p,`Set hopper filter to SS${ss} using barriers`)
      return true
    }
  }

  const hC=(o,a="",s=2)=>{
    const p=o.sourceEntity
    if(!p)return
    a=a.toLowerCase()
    if(a!=="set"&&a!=="blocker")return c.ME(p,"Usage: /petal:filter <set|blocker> [2|3]")
    const pid=p.id
    const sr=!p.hasTag("PetalAdmin")

    if(a==="blocker"){
      if(!sr)return c.ME(p,"Blocker only for survival players")
      const it=gIt(p)
      if(!it)return c.ME(p,"Hold an item to set blocker")
      PB.set(pid,it.typeId)
      return c.MS(p,`Blocker set to ${it.typeId.replace("minecraft:","")}`)
    }

    if(a==="set"){
      const ss=Math.round(s)
      if(!FC[ss])return c.ME(p,"Usage: /petal:filter set <2|3>")
      
      const current=PF.get(pid)
      if(current?.a && current.ss===ss){
        PF.delete(pid)
        return c.MS(p,`Filter SS${ss} deactivated`)
      }
      
      PF.set(pid,{a:true,ss,isSurv:sr})
      return c.MS(p,`Filter SS${ss} active, open hopper to apply`)
    }
  }

  c.W.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    const p=e.player,b=e.block
    const st=PF.get(p.id)
    if(!st?.a)return
    if(!gId(b).includes("hopper"))return
    e.cancel=true
    c.S.run(()=>{
      try{
        apH(p,b,st.ss,st.isSurv)
      }catch(er){
        console.warn("[petal:filter] error:",er)
        c.ME(p,"Failed to apply filter. See server console")
      }
    })
  })

  c.rC(i,"petal:filter","Manage hopper filters (set <ss> or blocker)",c.CP.Any,[c.Str("action"),c.F("ss")],hC,false,{},true)

  if(!c._rC)c._rC=[]
  let ex=null
  for(let j=0;j<c._rC.length;j++){if(c._rC[j].name==="filter"){ex=c._rC[j];break}}
  if(ex){
    ex.requiresTag=true
    ex.dualMode=true
    ex.dualMessage="In survival, consumes your held and blocker items to set hopper filters. In creative (PetalAdmin), uses barriers instead."
  }else{
    c._rC.push({
      name:"filter",
      description:"Manage hopper filters (set <ss> or blocker)",
      requiresTag:true,
      dualMode:true,
      dualMessage:"In survival, consumes your held and blocker items to set hopper filters. In creative (PetalAdmin), uses barriers instead."
    })
  }

})