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
    const {StringField} = foundry.data.fields;

    return {
      piece: new StringField({
        required: true,
        choices: CONFIG.UTS.chess.pieces,
        initial: "pawn"
      })
    };
  }
}
