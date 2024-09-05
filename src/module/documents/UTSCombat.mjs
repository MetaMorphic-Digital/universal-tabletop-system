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

  /**
   * Adds a player combatant to the current combat
   * @returns {Promise<import("./UTSCombatant.mjs").default>} The created Combatant
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
    const created = await this.createEmbeddedDocuments("Combatant", [data]);
    return created.shift();
  }
}
