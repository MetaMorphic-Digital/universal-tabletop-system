export class UTSCombatTracker extends CombatTracker {
  /** @override */
  async _onCombatCreate(event) {
    event.preventDefault();
    const scene = game.scenes.current;
    await getDocumentClass("Combat").createDialog({scene: scene?.id, active: true});
  }
}
