/**
 * Simple data model for game tokens as a type of actor
 */
export default class ChessData extends foundry.abstract.TypeDataModel {
  /**
   * Metadata that describes this subtype.
   * @type {object}
   */
  static metadata = Object.freeze({
    type: "token"
  });

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    return { };
  }
}
