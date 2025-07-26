/**
 * Simple data model for chess pieces as a type of actor
 */
export default class ChessModel extends foundry.abstract.TypeDataModel {
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
