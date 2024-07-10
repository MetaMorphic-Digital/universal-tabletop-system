export default class UTSActiveEffect extends ActiveEffect {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSActiveEffect} effect      The effect preparing derived data.
     */
    Hooks.callAll("UTS.prepareActiveEffectData", this);
  }
}
