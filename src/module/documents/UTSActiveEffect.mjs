export default class UTSActiveEffect extends ActiveEffect {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data
     */
    Hooks.callAll("UTS.prepareActiveEffectData", this);
  }
}
