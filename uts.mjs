import UTS from "./src/module/config.mjs";
import UTSSocketHandler from "./src/module/sockets.mjs";
import * as documents from "./src/module/documents/index.mjs";

Hooks.once("init", () => {
  CONFIG.UTS = UTS;
  game.system.socketHandler = new UTSSocketHandler();

  // Assign document classes
  for (const docCls of Object.values(documents)) {
    CONFIG[docCls.documentName].documentClass = docCls;
  }

  CONFIG.ActiveEffect.legacyTransferral = false;
});
