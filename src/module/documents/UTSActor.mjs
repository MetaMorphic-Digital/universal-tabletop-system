export default class UTSActor extends Actor {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data
     */
    Hooks.callAll("UTS.prepareActorData", this);
  }
}
