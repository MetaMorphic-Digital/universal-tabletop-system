import UTS from "./src/module/config.mjs";
import UTSSocketHandler from "./src/module/helpers/sockets.mjs";
import * as apps from "./src/module/apps/_module.mjs";
import * as documents from "./src/module/documents/_module.mjs";
import * as dataModels from "./src/module/data/_module.mjs";
import {localizeHelper} from "./src/module/helpers/utils.mjs";

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

  // Document Sheets
  foundry.documents.collections.Actors.registerSheet("uts", apps.Actor.UTSActorSheet, {
    makeDefault: true, label: "UTS.Sheets.Labels.ActorSheet"
  });
  foundry.documents.collections.Items.registerSheet("uts", apps.Item.UTSItemSheet, {
    makeDefault: true, label: "UTS.Sheets.Labels.ActorSheet"
  });

  // Sidebar tabs
  CONFIG.ui.combat = apps.Combat.UTSCombatTracker;
});

Hooks.once("i18nInit", () => {
  // Localizing the system's CONFIG object
  localizeHelper(CONFIG.UTS);
});

Hooks.on("renderCombatantConfig", apps.Combatant.hooks.renderCombatantConfig);
