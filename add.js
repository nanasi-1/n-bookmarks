console.log('N Bookmark を起動します()');

/**
 * @typedef Bookmark
 * @prop {string} url
 * @prop {string} title
 * @prop {string} chapterName
 * @prop {string} courseName
 * @prop {string} chapterUrl
 * @prop {string} courseUrl
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
    console.log('教材の数', document.querySelectorAll('ul[aria-label="課外教材リスト"] > li').length);
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

    // クリックしたらブックマーク
    btn.addEventListener('click', async () => {
        const courseElem = document.querySelector('[aria-label="パンくずリスト"] li:nth-child(3)>a');
        const chapterElem = document.querySelector('[aria-label="パンくずリスト"] li:nth-child(5)>a');

        /** @type {Bookmark} */
        const newBookmark = {
            url: location.href,
            title: doc.querySelector('#iframe').contentDocument.querySelector("div.book-header>h1>a").textContent,
            chapterName: chapterElem.textContent,
            courseName: courseElem.textContent,
            courseUrl: courseElem.href,
            chapterUrl: chapterElem.href,
        };
        console.info('ブックマークを追加します：', newBookmark);

        /** @type {Map<string, Bookmark>} */
        const bookmarkData = await getBookmarks() || new Map();

        // 初期化が済んでいなければ初期化
        if (!bookmarkData.size) {
            await chrome.storage.local.set({ bookmarks: JSON.stringify([]) });
            console.info('初期化しました');
        }

        bookmarkData.set(location.pathname, newBookmark);
        chrome.storage.local.set({ bookmarks: JSON.stringify([...bookmarkData.entries()]) });
    });

    const header = doc.querySelector('header');
    header.insertBefore(btn, header.querySelector('#question-btn'));
}

// ブックマークを取得する関数
// ストレージには[pathname, Bookmark][]で保存、返すのはMap
async function getBookmarks() {
    /** @type {{bookmarks: Bookmark[]}} */
    const bookmarks = await chrome.storage.local.get('bookmarks');
    if (!bookmarks.bookmarks) {
        return null;
    } else {
        return new Map(JSON.parse(bookmarks.bookmarks));
    }
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