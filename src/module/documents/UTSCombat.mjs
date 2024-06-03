export default class UTSCombat extends Combat {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data
     */
    Hooks.callAll("UTS.prepareCombatData", this);
  }
}
