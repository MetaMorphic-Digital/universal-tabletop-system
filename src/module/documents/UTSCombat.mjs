import {systemPath} from "../constants.mjs";
import Player from "../data/combatant/player.mjs";

export default class UTSCombat extends Combat {
  /** @override */
  prepareDerivedData() {

    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCombat} combat      The combat preparing derived data.
     */
    Hooks.callAll("UTS.prepareCombatData", this);
  }

  /** @override */
  static async createDialog(data = {}, {parent = null, pack = null, types, ...options} = {}) {
    const cls = this.implementation;

    // Identify allowed types
    let documentTypes = [];
    let defaultType = CONFIG[this.documentName]?.defaultType;
    let defaultTypeAllowed = false;
    let hasTypes = false;
    if (this.TYPES.length > 1) {
      if (types?.length === 0) throw new Error("The array of sub-types to restrict to must not be empty");

      // Register supported types
      for (const type of this.TYPES) {
        if (types && !types.includes(type)) continue;
        let label = CONFIG[this.documentName]?.typeLabels?.[type];
        label = label && game.i18n.has(label) ? game.i18n.localize(label) : type;
        documentTypes.push({value: type, label});
        if (type === defaultType) defaultTypeAllowed = true;
      }
      if (!documentTypes.length) throw new Error("No document types were permitted to be created");

      if (!defaultTypeAllowed) defaultType = documentTypes[0].value;
      // Sort alphabetically
      documentTypes.sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
      hasTypes = true;
    }

    // Identify destination collection
    let collection;
    if (!parent) {
      if (pack) collection = game.packs.get(pack);
      else collection = game.collections.get(this.documentName);
    }

    // Collect data
    const label = game.i18n.localize(this.metadata.label);
    const title = game.i18n.format("DOCUMENT.Create", {type: label});
    const type = data.type || defaultType;

    // Render the document creation form
    const html = await renderTemplate(systemPath("templates/combat/combat-create.hbs"), {
      type,
      types: documentTypes
    });

    // Render the confirmation dialog window
    return foundry.applications.api.DialogV2.prompt({
      window: {title},
      content: html,
      ok: {
        label: title,
        callback: (event, button, dialog) => {
          const fd = new FormDataExtended(button.form);
          foundry.utils.mergeObject(data, fd.object, {inplace: true});
          return cls.create(data, {parent, pack});
        }
      },
      rejectClose: false,
      options
    });
  }

  /**
   * Adds a player combatant to the current combat
   */
  async addPlayer() {
    const data = {
      type: "player",
      system: {}
    };
    data.system.user = await foundry.applications.api.DialogV2.prompt({
      window: {title: game.i18n.localize("UTS.Combat.AddPlayerCombatTracker")},
      content: Player.schema.getField("user").toFormGroup().outerHTML,
      rejectClose: true,
      ok: {
        callback: (event, button, dialog) => button.form.elements["system.user"].value
      }
    });
    const user = game.users.get(data.system.user);
    if (!user) return;
    data.name = user.name;
    data.img = user.avatar;
    await this.createEmbeddedDocuments("Combatant", [data]);
  }
}
