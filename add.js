console.log('N Bookmark を起動します()');

/**
 * @typedef Bookmark
 * @prop {string} url
 * @prop {string} title
 * @prop {string} chapterName
 */

window.addEventListener('load', () => {
    console.log('ページが読み込まれた...はず...');

    if ((new RegExp('/courses/.*/chapters/.*/guide/.*')).test(location.href)) {
        console.log('教材URLを検出');
        // ブックマークボタンを追加
        try { // なんか失敗してたから一応囲っとく
            /** @type {Document} */
            const ifrDocument = document.querySelector('[aria-label="教材モーダル"]>iframe').contentDocument;
            appendBookmarkBtn(ifrDocument);
        } catch (e) {
            alert('エラーが発生しました：' + e);
            console.error(e);
        }
    }

    // 教材のliタグにイベントを追加
    document.querySelectorAll('ul[aria-label="課外教材リスト"] > li').forEach(li => {
        li.addEventListener('click', async () => {
            await sleep(500);
            console.info('教材が読み込まれました(多分)');

            /** @type {Document} */
            const ifrDocument = document.querySelector('[aria-label="教材モーダル"]>iframe').contentDocument;
            appendBookmarkBtn(ifrDocument);
        });
    });
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

function sleep(sec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, sec);
    })
}