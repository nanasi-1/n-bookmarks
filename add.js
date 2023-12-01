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

    // CSSを挿入
    const link = strToElement(`<link rel="stylesheet" href="${chrome.runtime.getURL('style.css')}"></link>`);
    document.head.append(link);

    appendBookmarkBtn(ifrDocument);
});

/** ブックマークのボタンを追加する関数 @param {Document} doc */
function appendBookmarkBtn(doc) {
    const btn = strToElement('<button id="bookmark-btn" class="u-button type-primary">ブックマーク</button>');
    btn.style.position = 'absolute';
    btn.style.right = '130px';
    btn.style.top = '0';
    btn.style.marginTop = '-10px';
    btn.style.padding = '0';
    btn.style.lineHeight = '42px';
    btn.style.width = '120px';

    const header = doc.querySelector('header');
    header.insertBefore(btn, header.querySelector('#question-btn'));
}

/** 文字列をHTMLElementにする関数 @param {String} str @returns {HTMLElement} */
function strToElement(str, inHTML = false) {
    const tempEl = document.createElement(inHTML ? 'html' : 'body');
    tempEl.innerHTML = str;
    return inHTML ? tempEl : tempEl.firstElementChild;
}