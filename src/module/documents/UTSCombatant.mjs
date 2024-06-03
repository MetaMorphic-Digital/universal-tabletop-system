export default class UTSCombatant extends Combatant {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data
     */
    Hooks.callAll("UTS.prepareCombatantData", this);
  }
}
