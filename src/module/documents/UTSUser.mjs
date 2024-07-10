export default class UTSUser extends User {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {UTSUser} user      The user preparing derived data.
     */
    Hooks.callAll("UTS.prepareUserData", this);
  }
}
