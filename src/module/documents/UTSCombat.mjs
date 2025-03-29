import Player from "../data/combatant/player.mjs";
import {systemPath} from "../constants.mjs";

/**
 * A simple extension that adds a hook at the end of data prep
 */
export default class UTSCombat extends foundry.documents.Combat {
  /** @inheritdoc */
  prepareDerivedData() {

    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCombat} combat      The combat preparing derived data.
     */
    Hooks.callAll("UTS.prepareCombatData", this);
  }

  /**
   * Adds a player combatant to the current combat
   * @returns {Promise<import("./UTSCombatant.mjs").default>} The created Combatant
   */
  async addPlayer() {
    const data = {
      type: "player",
      system: {}
    };
    const fdObject = await foundry.applications.api.DialogV2.input({
      window: {title: "UTS.Combat.AddPlayerCombatTracker"},
      content: Player.schema.getField("user").toFormGroup().outerHTML
    });
    foundry.utils.mergeObject(data, fdObject);
    const user = game.users.get(data.system.user);
    if (!user) return;
    data.name = user.name;
    data.img = user.avatar;
    const created = await this.createEmbeddedDocuments("Combatant", [data]);
    return created.shift();
  }

  /**
   * @remarks Variant createDialog that includes the Base type
   * @inheritdoc
   * @param {import("@common/types.mjs").CombatData} data
   * @param {import("@common/abstract/_types.mjs").DatabaseCreateOperation} createOptions
   * @param {context} context Options forwarded to DialogV2.prompt
   * @param {string[]} [context.types]   A restriction of the selectable sub-types of the Dialog.
   * @param {string} [context.template]  A template to use for the dialog contents instead of the default.
   * @returns {Promise<UTSCombat|null>}   A Promise which resolves to the created Document, or null if the dialog was
    *                                     closed.
   */
  static async createDialog(data = {}, createOptions = {}, {types, template, ...dialogOptions} = {}) {
    const applicationOptions = {
      top: "position", left: "position", width: "position", height: "position", scale: "position", zIndex: "position",
      title: "window", id: "", classes: "", jQuery: ""
    };

    for (const [k, v] of Object.entries(createOptions)) {
      if (k in applicationOptions) {
        foundry.utils.logCompatibilityWarning("The ClientDocument.createDialog signature has changed. "
          + "It now accepts database operation options in its second parameter, "
          + "and options for DialogV2.prompt in its third parameter.", {since: 13, until: 15, once: true});
        const dialogOption = applicationOptions[k];
        if (dialogOption) foundry.utils.setProperty(dialogOptions, `${dialogOption}.${k}`, v);
        else dialogOptions[k] = v;
        delete createOptions[k];
      }
    }

    const {parent, pack} = createOptions;
    const cls = this.implementation;

    // Identify allowed types
    const documentTypes = [];
    let defaultType = CONFIG[this.documentName]?.defaultType;
    let defaultTypeAllowed = false;
    let hasTypes = false;
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

    // Collect data
    const label = game.i18n.localize(this.metadata.label);
    const title = game.i18n.format("DOCUMENT.Create", {type: label});
    const type = data.type || defaultType;

    // Render the document creation form
    template ??= systemPath("templates/combat/create-dialog.hbs");
    const html = await renderTemplate(template, {
      hasTypes, type,
      name: data.name || "",
      defaultName: cls.defaultName({type, parent, pack}),
      hasFolders: false,
      types: documentTypes
    });

    // Render the confirmation dialog window
    return foundry.applications.api.DialogV2.prompt(foundry.utils.mergeObject({
      content: html,
      window: {title},
      position: {width: 360},
      ok: {
        label: title,
        callback: (event, button) => {
          const fd = new foundry.applications.ux.FormDataExtended(button.form);
          foundry.utils.mergeObject(data, fd.object);
          if (!data.name?.trim()) data.name = cls.defaultName({type: data.type, parent, pack});
          return cls.create(data, {renderSheet: false, ...createOptions});
        }
      }
    }, dialogOptions));
  }
}
