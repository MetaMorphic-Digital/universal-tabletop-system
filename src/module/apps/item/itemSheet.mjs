import {systemPath} from "../../constants.mjs";
import {prepareActiveEffectCategories} from "../../helpers/utils.mjs";

const {api, sheets} = foundry.applications;

/**
 * Extend the basic ItemSheet with some very simple modifications
 */
export class UTSItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheet) {

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    position: {
      width: 600
    },
    classes: ["uts", "item", "standard-form"],
    actions: {
      viewDoc: this.#viewEffect,
      createDoc: this.#createEffect,
      deleteDoc: this.#deleteEffect,
      toggleEffect: this.#toggleEffect
    },
    form: {
      submitOnChange: true
    },
    // Custom property that's merged into `this.options`
    dragDrop: [{dragSelector: ".draggable", dropSelector: null}]
  };

  /* -------------------------------------------------- */

  static TABS = {
    primary: {
      tabs: [
        {
          id: "properties"
        },
        {
          id: "effects"
        }
      ],
      initial: "properties",
      labelPrefix: "UTS.Sheets.Tabs"
    }
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/item/header.hbs")
    },
    tabs: {
      // Foundry-provided generic template
      template: "templates/generic/tab-navigation.hbs"
    },
    properties: {
      template: systemPath("templates/shared/properties.hbs"),
      scrollable: [""]
    },
    effects: {
      template: systemPath("templates/shared/effects.hbs"),
      scrollable: [""]
    }
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    const initialized = super._initializeApplicationOptions(options);

    initialized.classes.push(initialized.document.type);

    return initialized;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      owner: this.document.isOwner,
      limited: this.document.limited,
      item: this.item,
      actor: this.actor,
      system: this.item.system,
      flags: this.item.flags,
      itemFields: this.item.schema.fields,
      config: CONFIG
    });

    return context;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context) {
    // TODO: Come up with clever way to automatically handle enriching HTML fields
    switch (partId) {
      case "effects":
        context.effects = prepareActiveEffectCategories(this.item.effects);
        context.tab = context.tabs[partId];
        break;
      case "properties":
        context.fields = await this._getFields();
        context.tab = context.tabs[partId];
        break;
    }
    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Handles the system fields for the form-fields generic
   */
  async _getFields() {
    const doc = this.item;
    const source = doc._source;
    const systemFields = CONFIG.Item.dataModels[doc.type]?.schema.fields;
    const fieldSets = [];
    // TODO: Find a clever way to handle enrichment
    for (const field of Object.values(systemFields ?? {})) {
      const path = `system.${field.name}`;
      if (field instanceof foundry.data.fields.SchemaField) {
        const fieldset = {fieldset: true, legend: field.label, fields: []};
        await this.#addSystemFields(fieldset, field.fields, source, path);
        fieldSets.push(fieldset);
      } else {
        fieldSets.push({outer: {field, value: foundry.utils.getProperty(source, path)}});
      }
    }
    return fieldSets;
  }

  /* -------------------------------------------------- */

  /**
   * Recursively add system model fields to the fieldset.
   */
  async #addSystemFields(fieldset, schema, source, _path = "system") {
    for (const field of Object.values(schema)) {
      const path = `${_path}.${field.name}`;
      if (field instanceof foundry.data.fields.SchemaField) {
        this.#addSystemFields(fieldset, field.fields, source, path);
      } else if (field.constructor.hasFormSupport) {
        fieldset.fields.push({field, value: foundry.utils.getProperty(source, path)});
      }
    }
  }

  /* -------------------------------------------------- */

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  _onRender(context, options) {
    this.#dragDrop.forEach((d) => d.bind(this.element));
  }

  /* -------------------------------------------------- */
  /*   Event handlers                                   */
  /* -------------------------------------------------- */

  /**
   * Renders an embedded document's sheet
   *
   * @this UTSItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #viewEffect(event, target) {
    const effect = this._getEffect(target);
    effect.sheet.render(true);
  }

  /* -------------------------------------------------- */

  /**
   * Handles item deletion
   *
   * @this UTSItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async #deleteEffect(event, target) {
    const effect = this._getEffect(target);
    effect.delete();
  }

  /* -------------------------------------------------- */

  /**
   * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
   *
   * @this UTSItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async #createEffect(event, target) {
    const aeCls = getDocumentClass("ActiveEffect");
    const effectData = {
      name: aeCls.defaultName({
        type: target.dataset.type,
        parent: this.item
      })
    };
    for (const [dataKey, value] of Object.entries(target.dataset)) {
      if (["action", "documentClass"].includes(dataKey)) continue;
      foundry.utils.setProperty(effectData, dataKey, value);
    }

    aeCls.create(effectData, {parent: this.item});
  }

  /* -------------------------------------------------- */

  /**
   * Determines effect parent to pass to helper
   *
   * @this UTSItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async #toggleEffect(event, target) {
    const effect = this._getEffect(target);
    effect.update({disabled: !effect.disabled});
  }

  /* -------------------------------------------------- */
  /*   Helper functions                                 */
  /* -------------------------------------------------- */

  /**
   * Fetches the row with the data for the rendered embedded document
   *
   * @param {HTMLElement} target  The element with the action
   * @returns {HTMLLIElement} The document's row
   */
  _getEffect(target) {
    const li = target.closest(".effect");
    return this.item.effects.get(li?.dataset?.effectId);
  }

  /* -------------------------------------------------- */
  /*   Drag and drop                                    */
  /* -------------------------------------------------- */

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector
   * @param {string} selector       The candidate HTML selector for dragging
   * @returns {boolean}             Can the current user drag this selector?
   * @protected
   */
  _canDragStart(selector) {
    return this.isEditable;
  }

  /* -------------------------------------------------- */

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
   * @param {string} selector       The candidate HTML selector for the drop target
   * @returns {boolean}             Can the current user drop on this selector?
   * @protected
   */
  _canDragDrop(selector) {
    return this.isEditable;
  }

  /* -------------------------------------------------- */

  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  _onDragStart(event) {
    const li = event.currentTarget;
    if ("link" in event.target.dataset) return;

    let dragData = null;

    if (li.dataset.effectId) {
      const effect = this.item.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    }

    if (!dragData) return;

    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /* -------------------------------------------------- */

  /**
   * Callback actions which occur when a dragged element is over a drop target.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  _onDragOver(event) {}

  /* -------------------------------------------------- */

  /**
   * Callback actions which occur when a dragged element is dropped on a target.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    const item = this.item;
    const allowed = Hooks.call("dropItemSheetData", item, this, data);
    if (allowed === false) return;

    // Handle different data types
    switch (data.type) {
      case "ActiveEffect":
        return this._onDropActiveEffect(event, data);
      case "Actor":
        return this._onDropActor(event, data);
      case "Item":
        return this._onDropItem(event, data);
      case "Folder":
        return this._onDropFolder(event, data);
    }
  }

  /* -------------------------------------------------- */

  /**
   * Handle the dropping of ActiveEffect data onto an Actor Sheet
   * @param {DragEvent} event                  The concluding DragEvent which contains drop data
   * @param {object} data                      The data transfer extracted from the event
   * @returns {Promise<ActiveEffect|boolean>}  The created ActiveEffect object or false if it couldn't be created.
   * @protected
   */
  async _onDropActiveEffect(event, data) {
    const aeCls = getDocumentClass("ActiveEffect");
    const effect = await aeCls.fromDropData(data);
    if (!this.item.isOwner || !effect) return false;

    if (this.item.uuid === effect.parent?.uuid) return this._onEffectSort(event, effect);
    aeCls.create(effect, {parent: this.item});
  }

  /* -------------------------------------------------- */

  /**
   * Sorts an Active Effect based on its surrounding attributes
   *
   * @param {DragEvent} event
   * @param {ActiveEffect} effect
   */
  _onEffectSort(event, effect) {
    const effects = this.item.effects;
    const dropTarget = event.target.closest("[data-effect-id]");
    if (!dropTarget) return;
    const target = effects.get(dropTarget.dataset.effectId);

    // Don't sort on yourself
    if (effect.id === target.id) return;

    // Identify sibling items based on adjacent HTML elements
    const siblings = [];
    for (let el of dropTarget.parentElement.children) {
      const siblingId = el.dataset.effectId;
      if (siblingId && (siblingId !== effect.id)) siblings.push(effects.get(el.dataset.effectId));
    }

    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(effect, {
      target,
      siblings
    });
    const updateData = sortUpdates.map((u) => {
      const update = u.update;
      update._id = u.target._id;
      return update;
    });

    // Perform the update
    this.item.updateEmbeddedDocuments("ActiveEffect", updateData);
  }

  /* -------------------------------------------------- */

  /**
   * Handle dropping of an Actor data onto another Actor sheet
   * @param {DragEvent} event            The concluding DragEvent which contains drop data
   * @param {object} data                The data transfer extracted from the event
   * @returns {Promise<object|boolean>}  A data object which describes the result of the drop, or false if the drop was
   *                                     not permitted.
   * @protected
   */
  async _onDropActor(event, data) {
    if (!this.item.isOwner) return false;
  }

  /* -------------------------------------------------- */

  /**
   * Handle dropping of an item reference or item data onto an Actor Sheet
   * @param {DragEvent} event            The concluding DragEvent which contains drop data
   * @param {object} data                The data transfer extracted from the event
   * @returns {Promise<Item[]|boolean>}  The created or updated Item instances, or false if the drop was not permitted.
   * @protected
   */
  async _onDropItem(event, data) {
    if (!this.item.isOwner) return false;
  }

  /* -------------------------------------------------- */

  /**
   * Handle dropping of a Folder on an Actor Sheet.
   * The core sheet currently supports dropping a Folder of Items to create all items as owned items.
   * @param {DragEvent} event     The concluding DragEvent which contains drop data
   * @param {object} data         The data transfer extracted from the event
   * @returns {Promise<Item[]>}
   * @protected
   */
  async _onDropFolder(event, data) {
    if (!this.item.isOwner) return [];
  }

  /* -------------------------------------------------- */
  /*   The following pieces set up drag                 */
  /*   handling and are unlikely to need modification   */
  /* -------------------------------------------------- */

  // This is marked as private because there's no real need
  // for subclasses or external hooks to mess with it directly
  #dragDrop = this.#createDragDropHandlers();

  /**
   * Returns an array of DragDrop instances
   * @type {DragDrop[]}
   */
  get dragDrop() {
    return this.#dragDrop;
  }

  /* -------------------------------------------------- */

  /**
   * Create drag-and-drop workflow handlers for this Application
   * @returns {DragDrop[]}     An array of DragDrop handlers
   * @private
   */
  #createDragDropHandlers() {
    return this.options.dragDrop.map((d) => {
      d.permissions = {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this)
      };
      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this)
      };
      return new foundry.applications.ux.DragDrop(d);
    });
  }
}
