/**
 * A simple extension that adds a hook at the end of data prep
 */
export default class UTSCards extends foundry.documents.Cards {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSCards} cards      The cards preparing derived data.
     */
    Hooks.callAll("UTS.prepareCardsData", this);
  }
}
