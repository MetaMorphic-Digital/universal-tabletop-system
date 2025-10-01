/**
 * Simple data model for game tokens as a type of actor
 */
export default class GameTokenModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["UTS.GameToken"];

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    const {SchemaField, NumberField} = foundry.data.fields;
    return {
      count: new NumberField(),
      resource: new SchemaField({
        value: new NumberField(),
        max: new NumberField()
      })
    };
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;

    if (!foundry.utils.hasProperty(data, "prototypeToken.bar1.attribute")) {
      this.parent.updateSource({"prototypeToken.bar1.attribute": "count"});
    }
  }
}
