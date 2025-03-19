export class UTSCombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {
  /** @inheritdoc */
  _getCombatContextOptions() {
    const options = super._getCombatContextOptions();
    options.unshift({
      name: "UTS.Combat.AddPlayer",
      icon: "<i class=\"fa-solid fa-user\"></i>",
      condition: () => game.user.isGM,
      callback: () => this.viewed.addPlayer()
    });
    return options;
  }

  /** @inheritdoc */
  async _onCombatCreate(event, target) {
    if (Combat.TYPES.length > 1) {
      const combat = await getDocumentClass("Combat").createDialog();
      if (combat) combat.activate({render: false});
    }
    else super._onCombatCreate(event, target);
  }
}
