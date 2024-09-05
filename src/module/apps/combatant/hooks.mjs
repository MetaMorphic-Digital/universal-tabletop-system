/**
 *
 * @param {CombatantConfig} app
 * @param {HTMLDivElement[]} jquery
 * @param {Record<string, unknown>} context
 */
export function renderCombatantConfig(app, [html], context) {
  /** @type {import("../../documents/UTSCombatant.mjs").default} */
  const combatant = app.document;
  if (combatant.type === "player") {
    const form = html.querySelector("form");
    const userGroup = combatant.system.schema.getField("user").toFormGroup({}, {value: combatant.system.user.id});
    form.prepend(userGroup);
    app.setPosition({height: app.position.height + 30});
  }
}