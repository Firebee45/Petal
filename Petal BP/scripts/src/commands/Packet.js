import {c} from './core.js'

c.S.beforeEvents.startup.subscribe(i=>{
  c.rC(
    i,
    "petal:packet",
    "Encode binary or hex data into a shulker box",
    c.CP.Any,
    [c.E("petal:packetmode"),c.Str("code")],
    (o,md,cA)=>{
      const pl=o.sourceEntity
      if(!pl)return

      const mS=md.toLowerCase()
      let cd=c.QS(cA).toUpperCase()

      if(mS!=="binary"&&mS!=="hex"){
        c.ME(pl,"Mode must be 'binary' or 'hex'.")
        return
      }

      if(mS==="hex"){
        if(!/^[0-9A-F]+$/.test(cd)){
          c.ME(pl,"Hex mode only accepts 0~9 or A~F.")
          return
        }
        cd=cd.split("")
          .map(x=>parseInt(x,16).toString(2).padStart(4,"0"))
          .join("")
      }else if(!c.BV(cd)){
        c.ME(pl,"Binary mode only accepts 0s and 1s.")
        return
      }

      const blk=c.GV(pl)
      if(!blk)return c.ME(pl,"No block in view.")

      const inv=c.GI(blk)
      if(!inv)return c.ME(pl,"Target block has no inventory (must be a shulker box).")

      const DM={
        "0000":"minecraft:wooden_shovel",
        "0001":"minecraft:music_disc_13",
        "0010":"minecraft:music_disc_cat",
        "0011":"minecraft:music_disc_blocks",
        "0100":"minecraft:music_disc_chirp",
        "0101":"minecraft:music_disc_far",
        "0110":"minecraft:music_disc_mall",
        "0111":"minecraft:music_disc_mellohi",
        "1000":"minecraft:music_disc_stal",
        "1001":"minecraft:music_disc_strad",
        "1010":"minecraft:music_disc_ward",
        "1011":"minecraft:music_disc_11",
        "1100":"minecraft:music_disc_wait",
        "1101":"minecraft:music_disc_pigstep",
        "1110":"minecraft:music_disc_otherside",
        "1111":"minecraft:music_disc_5"
      }

      const MB=108
      if(cd.length>MB)cd=cd.slice(0,MB)

      c.S.run(()=>{
        c.CI(inv)
        try{
          if(mS==="binary"){
            for(let i=0;i<Math.min(cd.length,27);i++){
              const id=cd[i]==="1"?"minecraft:potion":"minecraft:wooden_shovel"
              c.SI(inv,i,id)
            }
            c.MS(pl,`Loaded ${cd.length} binary bits into shulker.`)
          }else if(mS==="hex"){
            const NC=Math.floor(cd.length/4)
            for(let i=0;i<NC&&i<27;i++){
              const bt=cd.slice(i*4,i*4+4)
              const dI=DM[bt]
              if(!dI)continue
              c.SI(inv,i,dI)
            }
            c.MS(pl,`Loaded ${Math.min(NC,27)} hex nibbles (${Math.min(NC*4,108)} bits).`)
          }
        }catch(e){
          console.warn("[petal:packet] Encoding failed:",e)
          c.ME(pl,"Encoding failed. Check logs.")
        }
      })
    },
    true,
    {"petal:packetmode":["binary","hex"]}
  )
})