/**
 * A simple extension that adds a hook at the end of data prep
 */
export default class UTSActiveEffect extends foundry.documents.ActiveEffect {
  /**
   * Automatically deactivate effects with expired durations
   * @inheritdoc
   */
  get isSuppressed() {
    if (Number.isNumeric(this.duration.remaining)) return this.duration.remaining <= 0;
    // Checks `system.isSuppressed`
    else return super.isSuppressed;
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSActiveEffect} effect      The effect preparing derived data.
     */
    Hooks.callAll("UTS.prepareActiveEffectData", this);
  }
}
