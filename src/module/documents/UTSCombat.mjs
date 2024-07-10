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
}
