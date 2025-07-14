/**
 * Base data model for active effects. Can be replaced if duration logic is not desired.
 */
export default class BaseEffectData extends foundry.abstract.TypeDataModel {
  /**
   * Metadata that describes this subtype.
   * @type {object}
   */
  static metadata = Object.freeze({
    type: "base"
  });

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    return { };
  }

  /* -------------------------------------------------- */

  /**
   * Disable effects whose durations has expired.
   */
  get isSuppressed() {
    const remaining = this.parent.duration.remaining;
    if (Number.isNumeric(remaining)) return remaining <= 0;
    else return false;
  }
}
