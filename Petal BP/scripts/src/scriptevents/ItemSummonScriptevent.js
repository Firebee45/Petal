import {c} from '../commands/core.js'

c.S.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id !== "petal:itemsummon") return;

  try {
    const [itemId, amountStr, xStr, yStr, zStr] = ev.message.split(" ");
    
    if (!itemId) {
      console.warn("[petal:itemsummon] Missing item ID");
      return;
    }
    
    let sourceLocation;
    if (ev.sourceType === "Block") {
      sourceLocation = ev.sourceBlock.location;
    } else if (ev.sourceType === "Entity") {
      sourceLocation = ev.sourceEntity.location;
    } else {
      console.warn("[petal:itemsummon] No valid source for relative coordinates");
      return;
    }
    
    const parseCoord = (str, base) => {
      if (!str || str === "~") return base;
      if (str.startsWith("~")) {
        const offset = parseFloat(str.slice(1)) || 0;
        return base + offset;
      }
      return parseFloat(str);
    };
    
    let x = parseCoord(xStr, sourceLocation.x);
    let y = parseCoord(yStr, sourceLocation.y);
    let z = parseCoord(zStr, sourceLocation.z);
    
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.warn("[petal:itemsummon] Invalid coordinates:", xStr, yStr, zStr);
      return;
    }
    
    const amount = parseInt(amountStr) || 1;
    
    x += 0.5;
    z += 0.5;

    const dim =
      ev.sourceType === "Block"
        ? ev.sourceBlock.dimension
        : ev.sourceEntity.dimension;

    const itemEntity = dim.spawnItem(new c.IS(itemId, amount), { x, y, z });
    itemEntity.clearVelocity();

  } catch (e) {
    console.warn("[petal:itemsummon] ScriptEvent error:", e);
  }
});

c.rSE("petal:itemsummon", "Summon item entity at coordinates", "<item> <amount> <x> <y> <z>")