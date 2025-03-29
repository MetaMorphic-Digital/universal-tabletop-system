/**
 * A "turns belong to users rather than tokens" variant of combatant
 */
export default class Player extends foundry.abstract.TypeDataModel {
  /**
   * Metadata that describes this subtype.
   * @type {object}
   */
  static metadata = Object.freeze({
    type: "player"
  });

  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["UTS.Combat.player"];

  /** @inheritdoc */
  static defineSchema() {
    return {
      user: new foundry.data.fields.ForeignDocumentField(foundry.documents.User)
    };
  }
}
