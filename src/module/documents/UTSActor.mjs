export default class UTSActor extends foundry.documents.Actor {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSActor} actor      The actor preparing derived data.
     */
    Hooks.callAll("UTS.prepareActorData", this);
  }
}
