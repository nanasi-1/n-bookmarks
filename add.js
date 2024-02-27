console.log('N Bookmark を起動します()');

window.addEventListener('urlChange', async e => {
    if(!(new RegExp('https://www.nnn.ed.nico/courses/.*/chapters/.*')).test(location.href)) return;

    if ((new RegExp('/courses/.*/chapters/.*/.*/.*')).test(location.href)) {
        // ブックマークボタンを追加
        await sleep(500);
        await appendBtn(100, 20);
    }

    // 前と同じチャプターならreturn
    const pattern = new RegExp('https://www.nnn.ed.nico/courses/[0-9]*/chapters/[0-9]*');
    if(e.detail?.match(pattern)?.[0] === location.href.match(pattern)?.[0]) return;

    // 教材のliタグにイベントを追加
    document.querySelectorAll('ul[aria-label="課外教材リスト"] > li').forEach(li => {
        li.addEventListener('click', async () => {
            await sleep(500);
            // ボタンを追加する
            await appendBtn(100, 20);
        });
    });
});

/** ブックマークのボタンを追加する関数 @param {Document} doc */
async function appendBookmarkBtn(doc) {
    if(document.querySelector('#bookmark-btn')) return;

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
            const contentType = location.href.match(/exercise|movie|guide/)[0];
            const courseElem = document.querySelector('[aria-label="パンくずリスト"] li:nth-child(2)>a');
            const chapterElem = document.querySelector('[aria-label="パンくずリスト"] li:nth-child(3) span');
            console.log(contentType);
            const title = 
                contentType === 'guide' ? 
                doc.querySelector('#iframe').contentDocument.querySelector("div.book-header>h1>a").textContent : 
                (contentType === 'movie' ? doc.querySelector('h1>span').textContent : doc.querySelector('h1.resource-title').textContent);

            /** @type {Bookmark} */
            const newBookmark = {
                url: location.href,
                title,
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

    if(document.querySelector('#bookmark-btn')) return; // もう一回
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
                console.error('N-Bookmarks: ループじゃ解決しない問題が発生しました：', e);
                break;
            }
        }
    }
}
