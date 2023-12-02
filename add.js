console.log('N Bookmark を起動します()');

window.addEventListener('load', async () => {
    if(!(new RegExp('https://www.nnn.ed.nico/courses/.*/chapters/.*')).test(location.href)) return;
    console.log('ページが読み込まれた...はず...');

    if ((new RegExp('/courses/.*/chapters/.*/.*/.*')).test(location.href)) {
        console.log('教材URLを検出');

        // ブックマークボタンを追加
        await sleep(500);
        appendBtn(100, 20);
    }

    // 教材のliタグにイベントを追加
    document.querySelectorAll('ul[aria-label="課外教材リスト"] > li').forEach(li => {
        li.addEventListener('click', async () => {
            await sleep(500);
            console.info('教材が読み込まれました(多分)');

            // ボタンを追加する
            appendBtn(100, 20);
        });
    });
});

/** ブックマークのボタンを追加する関数 @param {Document} doc */
async function appendBookmarkBtn(doc) {
    const btn = strToElement('<button id="bookmark-btn" class="u-button type-primary"></button>');
    btn.style.position = 'absolute';
    btn.style.right = '130px';
    btn.style.top = '0';
    btn.style.marginTop = '-10px';
    btn.style.padding = '0';
    btn.style.lineHeight = '42px';
    btn.style.width = '130px';
    btn.textContent = (await getBookmarks())?.has(location.pathname) ? 'ブックマーク中' : 'ブックマーク';

    // クリックしたらブックマーク
    btn.addEventListener('click', async e => {
        const bookmarkData = await getBookmarks() || new Map();

        if (bookmarkData.has(location.pathname)) {
            // ブックマーク済みの場合
            bookmarkData.delete(location.pathname);
            chrome.storage.local.set({ bookmarks: JSON.stringify([...bookmarkData.entries()]) });

            e.target.textContent = 'ブックマーク';
            console.info('ブックマークを解除しました');
        } else {
            // ブックマークしていない場合
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

            // 初期化が済んでいなければ初期化
            if (!bookmarkData.size) {
                await chrome.storage.local.set({ bookmarks: JSON.stringify([]) });
                console.info('初期化しました');
            }

            bookmarkData.set(location.pathname, newBookmark);
            chrome.storage.local.set({ bookmarks: JSON.stringify([...bookmarkData.entries()]) });

            e.target.textContent = 'ブックマーク中';
            console.info('ブックマークを追加しました：', newBookmark);
        }
    });

    const header = doc.querySelector('header');
    header.insertBefore(btn, header.querySelector('#question-btn'));
}

// ループする方のボタンを追加する関数
async function appendBtn(time, trial) {
    for (let i = 0; i < trial; i++) { // エラー出るからループする
        try {
            const doc = document.querySelector('[aria-label="教材モーダル"]>iframe').contentDocument;
            await appendBookmarkBtn(doc);
            break;
        } catch (e) {
            await sleep(time);
            if (i === trial - 1) {
                alert('エラーが発生しました。再読み込みしてください：' + e);
                throw new Error('エラー', e);
            }
        }
    }
}

// ブックマークを取得する関数
// ストレージには[pathname, Bookmark][]で保存、返すのはMap
/** @returns {Promise<Map<string, Bookmark>>} */
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