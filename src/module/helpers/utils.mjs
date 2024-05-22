/**
 * Searches through an object recursively and localizes strings
 * @param {Record<string, unknown>} object
 */
export function localizeHelper(object) {
  for (const [key, value] of Object.entries(object)) {
    // const type = foundry.utils.getType(value)
    switch (typeof value) {
      case "object":
        if (value) localizeHelper(value);
        break;
      case "string":
        if (key === "label") object[key] = game.i18n.localize(value);
        break;
    }
  }
}
