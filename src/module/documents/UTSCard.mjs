export default class UTSCard extends foundry.documents.Card {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCard} card      The card preparing derived data.
     */
    Hooks.callAll("UTS.prepareCardData", this);
  }
}
