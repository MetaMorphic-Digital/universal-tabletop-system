export default class UTSCombatant extends Combatant {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCombatant} combatant      The combatant preparing derived data.
     */
    Hooks.callAll("UTS.prepareCombatantData", this);
  }
}
