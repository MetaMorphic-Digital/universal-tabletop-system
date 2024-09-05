export class UTSCombatTracker extends CombatTracker {

  /** @override */
  activateListeners(html) {
    const controls = html.find(".encounter-controls.combat");
    controls.prepend(`<a class="combat-button combat-control" aria-label="${game.i18n.localize("UTS.Combat.AddPlayer")}"
      role="button" data-tooltip="UTS.Combat.AddPlayer" data-control="addPlayer">
      <i class="fas fa-plus"></i></a>`);
    super.activateListeners(html);
  }

  /** @override */
  async _onCombatCreate(event) {
    event.preventDefault();
    const scene = game.scenes.current;
    await getDocumentClass("Combat").createDialog({scene: scene?.id, active: true});
  }
}
