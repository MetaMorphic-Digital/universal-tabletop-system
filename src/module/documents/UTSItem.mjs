export default class UTSItem extends Item {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data
     */
    Hooks.callAll("UTS.prepareItemData", this);
  }
}
