/**
 * Simple data model for game tokens as a type of actor
 */
export default class GameTokenModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["UTS.GameToken"];

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    return {
      count: new foundry.data.fields.NumberField()
    };
  }

  /* -------------------------------------------------- */

  async _preCreate(data, options, user) {
    this.parent.updateSource({
      prototypeToken: {
        bar1: {
          attribute: "count"
        }
      }
    });
  }
}
