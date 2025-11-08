import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  const A=new Map()
  
  c.rC(
    i,
    "petal:hoppercheck",
    "Find unlocked hoppers in area",
    c.CP.Any,
    [c.E("petal:hc_action")],
    (o,ac,x1,y1,z1,x2,y2,z2)=>{
      const p=o.sourceEntity
      if(!p)return
      
      const a=ac.toLowerCase()
      
      if(a==="clear"){
        const ex=A.get(p.id)
        if(ex){
          c.rS(ex.ln)
          A.delete(p.id)
          c.MS(p,"Hopper visualization cleared.")
        }else{
          c.MI(p,"No hopper visualization to clear.")
        }
        return
      }
      
      if(a!=="show"){
        c.ME(p,"Invalid action. Use show or clear.")
        return
      }
      
      // Check if coordinates were provided
      if(x1===undefined||y1===undefined||z1===undefined||x2===undefined||y2===undefined||z2===undefined){
        c.ME(p,"Please provide coordinates: /petal:hoppercheck show <x1> <y1> <z1> <x2> <y2> <z2>")
        return
      }
      
      const ex=A.get(p.id)
      if(ex)c.rS(ex.ln)
      
      c.MI(p,"Scanning area for hoppers...")
      
      const dm=c.W.getDimension("overworld")
      if(!dm)return
      
      const mnX=Math.floor(Math.min(x1,x2))
      const mxX=Math.floor(Math.max(x1,x2))
      const mnY=Math.floor(Math.min(y1,y2))
      const mxY=Math.floor(Math.max(y1,y2))
      const mnZ=Math.floor(Math.min(z1,z2))
      const mxZ=Math.floor(Math.max(z1,z2))
      
      const vl=(mxX-mnX+1)*(mxY-mnY+1)*(mxZ-mnZ+1)
      const MV=300000
      if(vl>MV){
        c.ME(p,`Area too large (${vl} blocks). Reduce the region.`)
        return
      }
      
      let fA=false
      const ln=[]
      
      let tH=0
      let lC=0
      
      for(let hx=mnX;hx<=mxX;hx++){
        for(let hy=mnY;hy<=mxY;hy++){
          for(let hz=mnZ;hz<=mxZ;hz++){
            const b=dm.getBlock({x:hx,y:hy,z:hz})
            if(!b||b.typeId!=="minecraft:hopper")continue
            
            tH++
            
            let tS
            try{
              tS=b.permutation.getState("toggle_bit")
            }catch(e){
              tS=undefined
            }
            
            if(tS===false){
              fA=true
              
              const ix=Math.floor(b.location.x)
              const iy=Math.floor(b.location.y)
              const iz=Math.floor(b.location.z)
              
              p.sendMessage(`§cUnlocked hopper at (${ix}, ${iy}, ${iz})`)
              
              c.dBx({x:ix,y:iy,z:iz},{red:1.0,green:0.0,blue:0.0},ln,0)
              
              const st={x:ix+0.5,y:iy-50,z:iz+0.5}
              const en={x:ix+0.5,y:iy+50,z:iz+0.5}
              const vln=new c.DL(st,en)
              vln.color={red:1.0,green:0.0,blue:0.0}
              vln.duration=0
              c.DD.addShape(vln)
              ln.push(vln)
            }else if(tS===true){
              lC++
            }
          }
        }
      }
      
      if(!fA){
        c.MI(p,"No unlocked hoppers found in that area.")
      }else{
        A.set(p.id,{ln})
      }
      
      if(tH>0){
        const pc=((lC/tH)*100).toFixed(2)
        c.MS(p,`Hopper lock report: ${lC}/${tH} locked (${pc}%)`)
      }
    },
    false,
    {"petal:hc_action":["show","clear"]},
    false,
    [c.I("x1"),c.I("y1"),c.I("z1"),c.I("x2"),c.I("y2"),c.I("z2")]
  )
})