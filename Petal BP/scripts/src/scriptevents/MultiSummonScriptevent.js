import {c} from '../commands/core.js'

c.S.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id !== "petal:multisummon") return;

  try {
    const [entityId, amountStr, xStr, yStr, zStr] = ev.message.split(" ");
    
    if (!entityId) {
      console.warn("[petal:multisummon] Missing entity ID");
      return;
    }
    
    let sourceLocation;
    if (ev.sourceType === "Block") {
      sourceLocation = ev.sourceBlock.location;
    } else if (ev.sourceType === "Entity") {
      sourceLocation = ev.sourceEntity.location;
    } else {
      console.warn("[petal:multisummon] No valid source for relative coordinates");
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
    
    const x = parseCoord(xStr, sourceLocation.x);
    const y = parseCoord(yStr, sourceLocation.y);
    const z = parseCoord(zStr, sourceLocation.z);
    
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.warn("[petal:multisummon] Invalid coordinates:", xStr, yStr, zStr);
      return;
    }
    
    let amount = parseInt(amountStr) || 1;
    amount = Math.max(0, Math.min(amount, 1000));

    const dim =
      ev.sourceType === "Block"
        ? ev.sourceBlock.dimension
        : ev.sourceEntity.dimension;

    for (let i = 0; i < amount; i++) {
      dim.spawnEntity(entityId, { x, y, z });
    }

  } catch (e) {
    console.warn("[petal:multisummon] ScriptEvent error:", e);
  }
});

c.rSE("petal:multisummon", "Summon multiple entities at coordinates", "<entity> <amount> <x> <y> <z>")