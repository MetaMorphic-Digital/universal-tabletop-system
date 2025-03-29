/**
 * Simple data model for chess pieces as a type of actor
 */
export default class ChessData extends foundry.abstract.TypeDataModel {
  /**
   * Metadata that describes this subtype.
   * @type {object}
   */
  static metadata = Object.freeze({
    type: "chess"
  });

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["UTS.Chess"];

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    return {
      piece: new foundry.data.fields.StringField({
        required: true,
        choices: CONFIG.UTS.chess.pieces,
        initial: "pawn"
      })
    };
  }
}
