export default class UTSCard extends Card {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCard} card      The card preparing derived data.
     */
    Hooks.callAll("UTS.prepareCardData", this);
  }
}
