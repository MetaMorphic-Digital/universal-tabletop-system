/** @import CombatantConfig from "@client/applications/sheets/combatant-config.mjs" */
/** @import UTSCombatant from "../../documents/UTSCombatant.mjs" */

/**
 *
 * @param {CombatantConfig} app
 * @param {HTMLDivElement[]} jquery
 * @param {object} context
 */
export function renderCombatantConfig(app, [html], context) {
  /** @type {UTSCombatant} */
  const combatant = app.document;
  if (combatant.type === "player") {
    const form = html.querySelector("form");
    const userGroup = combatant.system.schema.getField("user").toFormGroup({}, {value: combatant.system.user.id});
    form.prepend(userGroup);
    app.setPosition({height: app.position.height + 30});
  }
}
