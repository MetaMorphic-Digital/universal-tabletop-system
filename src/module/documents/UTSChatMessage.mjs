export default class UTSChatMessage extends ChatMessage {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data
     */
    Hooks.callAll("UTS.prepareChatMessageData", this);
  }
}
