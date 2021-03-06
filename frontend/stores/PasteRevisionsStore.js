var Fluxxor = require('fluxxor'),
    Immutable = require('immutable'),
    constants = require('../constants');


module.exports = Fluxxor.createStore({
  initialize() {
    this._revisions = Immutable.List();
    this._unsavedRevisions = Immutable.List();

    this.bindActions(
        constants.PASTE_LOADED, this._onPasteLoaded,
        constants.PASTE_SAVED, this._onPasteSaved,
        constants.PRISTINE_PASTE_MODIFIED, this._onPristinePasteModified,
        constants.CLONE_PASTE, this._onClonePaste,
        constants.NEW_PASTE, this._onClonePaste // same as clone, here
    );
  },

  getRevisionsOfCurrentPaste() {
    return this._revisions
  },

  getUnsavedRevisionsOfCurrentPaste() {
    return this._unsavedRevisions
  },

  _emitChange() {
    this.emit('change')
  },

  _onPasteLoaded(payload) {
    // future: check payload.isNewHistoryChain or something
    this._revisions = Immutable.fromJS(payload.revisions);

    this._emitChange();
  },

  _onPasteSaved(payload) {
    var index = this._unsavedRevisions.indexOf(payload.tempID);
    this._unsavedRevisions = this._unsavedRevisions.delete(index);

    this._emitChange();
  },

  _onPristinePasteModified(payload) {
    //todo: do something with payload.parentKey -- do I need it?
    this._unsavedRevisions = this._unsavedRevisions.push(payload.tempKey);

    this._emitChange();
  },

  _onClonePaste(payload) {
    this._revisions = Immutable.List();
    this._unsavedRevisions = Immutable.List([payload.tempKey]);
    this._emitChange();
  }
});
