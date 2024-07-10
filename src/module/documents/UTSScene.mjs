export default class UTSScene extends Scene {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSScene} scene      The scene preparing derived data.
     */
    Hooks.callAll("UTS.prepareSceneData", this);
  }
}
