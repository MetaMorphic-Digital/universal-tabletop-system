import UTS from "./src/module/config.mjs";
import UTSSocketHandler from "./src/module/helpers/sockets.mjs";
import * as documents from "./src/module/documents/index.mjs";
import * as dataModels from "./src/module/data/index.mjs";
import { localizeHelper } from "./src/module/helpers/utils.mjs";

Hooks.once("init", () => {
  CONFIG.UTS = UTS;
  game.system.socketHandler = new UTSSocketHandler();

  // Assign document classes
  for (const docCls of Object.values(documents)) {
    CONFIG[docCls.documentName].documentClass = docCls;
  }

  // Assign data models
  for (const [doc, models] of Object.entries(dataModels)) {
    for (const modelCls of Object.values(models)) {
      CONFIG[doc].dataModels[modelCls.metadata.type] = modelCls;
    }
  }

  // Necessary until foundry makes this default behavior
  CONFIG.ActiveEffect.legacyTransferral = false;
});

Hooks.once("i18nInit", () => {
  // Localizing the system's CONFIG object
  localizeHelper(CONFIG.UTS);
});
