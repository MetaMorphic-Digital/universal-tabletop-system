export class UTSCombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    const controls = this.element.querySelector(".encounter-controls.combat");
    controls.insertAdjacentHTML("afterbegin", `<button class="inline-control combat-control icon fa-solid fa-user"
      aria-label="${game.i18n.localize("UTS.Combat.AddPlayer")}"
      type="button" data-tooltip="UTS.Combat.AddPlayer" data-action="addPlayer">
      </button>`);
  }

  /** @override */
  async _onCombatCreate(event, target) {
    const combat = await getDocumentClass("Combat").createDialog();
    combat.activate({render: false});
  }
}
