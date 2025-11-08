import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  const A=new Map()
  const CS=16
  
  const iR=(dx,dz,sz)=>{
    const m=Math.abs(dx)+Math.abs(dz)
    return m<=sz||(m===sz+1&&Math.abs(dx)>=1&&Math.abs(dz)>=1)
  }
  
  const d7S=(bX,bZ,y,dg,ln)=>{
    const cx=bX+8,cz=bZ+8,sH=3,sW=2
    const cl=c.HxC(0xffff00)
    
    const pt={
      0:['a','b','c','d','e','f'],
      1:['b','c'],
      2:['a','b','g','e','d'],
      4:['b','c','f','g'],
      6:['a','c','d','e','f','g'],
      8:['a','b','c','d','e','f','g']
    }
    
    const drD=(cx,cz,v)=>{
      const sg={
        a:[{x:cx-sW/2,z:cz-sH},{x:cx+sW/2,z:cz-sH}],
        b:[{x:cx+sW/2,z:cz-sH},{x:cx+sW/2,z:cz}],
        c:[{x:cx+sW/2,z:cz},{x:cx+sW/2,z:cz+sH}],
        d:[{x:cx-sW/2,z:cz+sH},{x:cx+sW/2,z:cz+sH}],
        e:[{x:cx-sW/2,z:cz},{x:cx-sW/2,z:cz+sH}],
        f:[{x:cx-sW/2,z:cz-sH},{x:cx-sW/2,z:cz}],
        g:[{x:cx-sW/2,z:cz},{x:cx+sW/2,z:cz}]
      }
      const r=pt[v]
      if(!r)return
      for(const n of r){
        const[pa,pb]=sg[n]
        const l=new c.DL({x:pa.x,y,z:pa.z},{x:pb.x,y,z:pb.z})
        l.color=cl
        c.DD.addShape(l)
        ln.push(l)
      }
    }
    
    if(dg<10)drD(cx,cz,dg)
    else{
      const t=Math.floor(dg/10),o=dg%10,sp=3.5
      drD(cx-sp,cz,t)
      drD(cx+sp,cz,o)
    }
  }
  
  const dLt=(x,z,y,lt,ln)=>{
    const cl=c.HxC(0xffffff),sc=1.5
    const fr={
      N:[[[{x:0,z:4},{x:0,z:0}],[{x:0,z:0},{x:3,z:4}],[{x:3,z:4},{x:3,z:0}]]],
      S:[[[{x:3,z:0},{x:0,z:0}],[{x:0,z:0},{x:0,z:2}],[{x:0,z:2},{x:3,z:2}],[{x:3,z:2},{x:3,z:4}],[{x:3,z:4},{x:0,z:4}]]],
      E:[[[{x:3,z:4},{x:0,z:4}],[{x:0,z:4},{x:0,z:0}],[{x:0,z:0},{x:3,z:0}],[{x:0,z:2},{x:2.5,z:2}]]],
      W:[[[{x:0,z:0},{x:1,z:4}],[{x:1,z:4},{x:2,z:2}],[{x:2,z:2},{x:3,z:4}],[{x:3,z:4},{x:4,z:0}]]]
    }
    const ls=fr[lt]
    if(!ls)return
    for(const[pa,pb]of ls[0]){
      const l=new c.DL(
        {x:x+pa.x*sc,y,z:z+pa.z*sc},
        {x:x+pb.x*sc,y,z:z+pb.z*sc}
      )
      l.color=cl
      c.DD.addShape(l)
      ln.push(l)
    }
  }
  
  const aCd=(bX,bZ,sz,y,ln)=>{
    const of=2
    const nZ=bZ-(sz+1)*CS,sZ=bZ+(sz+1)*CS
    const eX=bX+(sz+1)*CS,wX=bX-(sz+1)*CS
    dLt(bX+6,nZ+of,y,'N',ln)
    dLt(bX+6,sZ+of,y,'S',ln)
    dLt(eX+of,bZ+6,y,'E',ln)
    dLt(wX+of,bZ+6,y,'W',ln)
  }
  
  const dSO=(x,z,dx,dz,sz,y,iC,oC,cC,ln)=>{
    const p=[
      {x,y,z},
      {x:x+CS,y,z},
      {x:x+CS,y,z:z+CS},
      {x,y,z:z+CS}
    ]
    const e=[
      [p[0],p[1],dx,dz-1],
      [p[1],p[2],dx+1,dz],
      [p[2],p[3],dx,dz+1],
      [p[3],p[0],dx-1,dz]
    ]
    for(const[pa,pb,nx,nz]of e){
      const cl=(nx===0&&nz===0)?cC:iR(nx,nz,sz)?iC:oC
      const l=new c.DL(pa,pb)
      l.color=cl
      c.DD.addShape(l)
      ln.push(l)
    }
  }
  
  const shSm=(p,sm)=>{
    const ex=A.get(p.id)
    if(ex)c.rS(ex.ln)
    
    const lc=p.location
    const bX=Math.floor(lc.x/CS)*CS
    const bZ=Math.floor(lc.z/CS)*CS
    const y=Math.floor(lc.y)-1
    const ln=[]
    
    for(let dz=-sm;dz<=sm;dz++){
      for(let dx=-sm;dx<=sm;dx++){
        if(!iR(dx,dz,sm))continue
        const X=bX+dx*CS,Z=bZ+dz*CS
        if(dx===0&&dz===0){
          c.dCO(X,Z,y,c.HxC(0x00ff00),ln,CS)
          d7S(bX,bZ,y,sm,ln)
        }else{
          dSO(X,Z,dx,dz,sm,y,c.HxC(0xffffff),c.HxC(0xff0000),c.HxC(0x00ff00),ln)
        }
      }
    }
    
    aCd(bX,bZ,sm,y,ln)
    A.set(p.id,{ln,sm})
    c.MS(p,"simrange enabled "+sm)
  }
  
  c.rC(
    i,
    "petal:simrange",
    "Show simulation range",
    c.CP.Any,
    [c.E("petal:simrangeoptions")],
    (o,ac)=>{
      const p=o.sourceEntity
      if(!p)return
      const a=ac.toLowerCase()
      if(a==="show")shSm(p,4)
      else if(a==="clear"){
        const ex=A.get(p.id)
        if(ex){
          c.rS(ex.ln)
          A.delete(p.id)
          c.MS(p,"simrange cleared")
        }else{
          c.MI(p,"No simrange to clear")
        }
      }
      else if(["4","6","8","10","12"].includes(a))shSm(p,parseInt(a))
      else c.ME(p,"Invalid action. Use show/clear/4/6/8/10/12.")
    },
    false,
    {"petal:simrangeoptions":["show","clear","4","6","8","10","12"]},
    false
  )
})