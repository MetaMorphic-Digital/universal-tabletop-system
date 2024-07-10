export default class ChessData extends foundry.abstract.TypeDataModel {
  static metadata = Object.freeze({
    type: "chess",
  });

  static LOCALIZATION_PREFIXES = ["UTS.Chess"];

  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      piece: new fields.StringField({
        required: true,
        choices: CONFIG.UTS.chess.pieces,
        initial: "pawn",
      }),
    };
  }
}
