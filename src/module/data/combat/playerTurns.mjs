/**
 * A "turns belong to users rather than tokens" variant of combat
 */
export default class PlayerTurns extends foundry.abstract.TypeDataModel {
  /**
   * Metadata that describes this subtype.
   * @type {object}
   */
  static metadata = Object.freeze({
    type: "player"
  });

  static defineSchema() {
    return {};
  }
}
