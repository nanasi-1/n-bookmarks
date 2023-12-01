console.log('こんちゃ');

/**
 * @typedef Bookmark
 * @prop {string} url
 * @prop {string} title
 * @prop {string} chapterName
 */

window.addEventListener('load', () => {
    console.log('読み込み');

    /** @type {Document} */
    const ifrDocument = document.querySelector('[aria-label="教材モーダル"]>iframe').contentDocument;
    appendBookmarkBtn(ifrDocument);

    // CSSを挿入
    const link = strToElement(`<link rel="stylesheet" href="${chrome.runtime.getURL('style.css')}"></link>`);
    document.body.append(link);
});

/** ブックマークのボタンを追加する関数 @param {Document} doc */
function appendBookmarkBtn(doc) {
    const btn = strToElement('<button id="bookmark-btn" class="u-button type-primary question">ブックマーク</button>');
    const header = doc.querySelector('header');
    header.insertBefore(btn, header.querySelector('#question-btn'));
}

/** 文字列をHTMLElementにする関数 @param {String} str @returns {HTMLElement} */
function strToElement(str, inHTML = false) {
    const tempEl = document.createElement(inHTML ? 'html' : 'body');
    tempEl.innerHTML = str;
    return inHTML ? tempEl : tempEl.firstElementChild;
}