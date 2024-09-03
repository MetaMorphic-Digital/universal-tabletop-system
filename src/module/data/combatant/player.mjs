/**
 * A "turns belong to users rather than tokens" variant of combat
 */
export default class Player extends foundry.abstract.TypeDataModel {
  /**
   * Metadata that describes this subtype.
   * @type {object}
   */
  static metadata = Object.freeze({
    type: "player"
  });

  /** @override */
  static LOCALIZATION_PREFIXES = ["UTS.Combat.player"];

  static defineSchema() {
    return {
      user: new foundry.data.fields.ForeignDocumentField(User)
    };
  }
}
