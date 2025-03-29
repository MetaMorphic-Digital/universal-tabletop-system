/**
 * A simple extension that adds a hook at the end of data prep
 */
export default class UTSCombatant extends foundry.documents.Combatant {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCombatant} combatant      The combatant preparing derived data.
     */
    Hooks.callAll("UTS.prepareCombatantData", this);
  }
}
