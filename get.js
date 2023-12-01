// メイン処理
!async function () {
    await chrome.storage.local.set({ lastAccess: (new Date()).toISOString() });
    console.log((await chrome.storage.local.get('lastAccess')).lastAccess);

    // 初期化が済んでいなければ初期化
    if (!(await chrome.storage.local.get('bookmarks')).bookmarks) {
        console.info('初期化しました');
        await chrome.storage.local.set({ bookmarks: JSON.stringify([]) });
    }

    // ブックマークになるエリア
    const bookmarkArea = document.querySelector('[role="main"] > div > div:nth-child(2)');

    // 表示エリアに表示
    const ul = document.createElement('ul');
    for (const bookmark of await getBookmarks()) {
        ul.append(strToElement(`<li>${bookmark}</li>`));
    }
    console.log(ul);
}();

// ブックマークを取得する関数
async function getBookmarks() {
    /** @type {{bookmarks: Bookmark[]}} */
    const bookmarks = await chrome.storage.local.get('bookmarks');
    if (!bookmarks.bookmarks) {
        return null;
    } else {
        return JSON.parse(bookmarks.bookmarks);
    }
}

/** 文字列をHTMLElementにする関数 @param {String} str @returns {HTMLElement} */
function strToElement(str, inHTML = false) {
    const tempEl = document.createElement(inHTML ? 'html' : 'body');
    tempEl.innerHTML = str;
    return inHTML ? tempEl : tempEl.firstElementChild;
}