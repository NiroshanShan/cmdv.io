var config = require('../../frontend_config.js'),
    constants = require('../constants');

var uuidCounter = 0;

module.exports = {
  savePaste(tempID, parentID, pasteContent) {
    if(pasteContent.length === 0) {
      console.log('tried to save a paste with empty content');
    }

    this.dispatch(constants.PASTE_SAVING, { tempID });
    $.ajax({
      type: 'POST',
      url: `${config.serverBaseURL}/pastes/${parentID || ''}`,
      data: pasteContent,
      contentType: 'text/plain'
    })
      .done((response) => {
        this.dispatch(constants.PASTE_SAVED, {
          tempID: tempID,
          pasteID: response.pasteID
        });

        this.dispatch(constants.PASTE_LOADED, {
          pasteID: response.pasteID,
          pasteContent: response.pasteContent,
          revisions: response.revisions
        });
      })

      .fail((error) => {
        this.dispatch(constants.PASTE_SAVE_FAILED, { tempID })
      });
  },

  loadPaste(pasteID) {
    this.dispatch(constants.PASTE_LOADING, { pasteID });
    $.get(`${ config.serverBaseURL }/pastes/${ pasteID }`)
      .done((response) => {
        this.dispatch(constants.PASTE_LOADED, {
          pasteID: response.pasteID,
          pasteContent: response.pasteContent,
          revisions: response.revisions
        })
      })

      .fail((error) => {
        this.dispatch(constants.PASTE_LOAD_FAILED, { pasteID });
      });
  },

  pasteSelected(pasteID, setHistory, replaceState) {
    if(setHistory === undefined) setHistory = true;

    this.dispatch(constants.PASTE_SELECTED, { pasteID, setHistory, replaceState });
  },

  pageLoaded(urlPath) {
    this.dispatch(constants.PAGE_LOADED, { path: urlPath });
  },

  pristinePasteModified(parentKey, pasteContent) {
    var tempKey = `(unsaved) ${ ++uuidCounter }`;
    this.dispatch(constants.PRISTINE_PASTE_MODIFIED, { parentKey, tempKey, pasteContent });
  },

  pasteModified(pasteID, pasteContent) {
    this.dispatch(constants.PASTE_MODIFIED, { pasteID, pasteContent });
  },

  languageSelected(language) {
    this.dispatch(constants.LANGUAGE_SELECTED, { language })
  }
};
