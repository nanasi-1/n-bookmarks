console.log('N Bookmark を起動します()');

let currentChapter = ''
window.addEventListener('urlChange', async e => {
    if (!(new RegExp('https://www.nnn.ed.nico/courses/.*/chapters/.*')).test(location.href)) return;

    if ((new RegExp('/courses/.*/chapters/.*/.*/.*')).test(location.href)) {
        // ブックマークボタンを追加
        await sleep(500);
        await appendBtn(100, 20);
    }

    // 前と同じチャプターならreturn
    const pattern = new RegExp('https://www.nnn.ed.nico/courses/[0-9]*/chapters/[0-9]*');
    const newChapter = location.href.match(pattern)?.[0]
    if (currentChapter === newChapter) return;
    currentChapter = newChapter

    // 教材のliタグにイベントを追加
    document.querySelectorAll('ul[aria-label="課外教材リスト"] > li').forEach(li => {
        li.addEventListener('click', async () => {
            removeBtn(document)
            // ボタンを追加する
            await appendBookmarkBtn(document);
        });
    });
});

/** ブックマークボタンを消す関数 */
function removeBtn(doc) {
    while (true) {
        const elem = doc.querySelector('#bookmark-btn')
        // 存在しない場合
        if (!elem) break;
        elem.remove()
    }
}

/** ブックマークのボタンを追加する関数 @param {Document} doc */
async function appendBookmarkBtn(doc) {
    if (doc.querySelector('#bookmark-btn')) return;
    const btn = strToElement('<button id="bookmark-btn" class="u-button type-primary"></button>');
    btn.textContent = (await getBookmarks())?.has(location.pathname) ? 'ブックマーク中' : 'ブックマーク';

    const header = doc.querySelector('h3+div');
    btn.className = header.querySelector('a').className

    // クリックしたらブックマーク
    btn.addEventListener('click', async e => {
        const bookmarkData = await getBookmarks() || new Map();

        if (bookmarkData.has(location.pathname)) {
            // ブックマーク済みの場合
            bookmarkData.delete(location.pathname);
            chrome.storage.local.set({ bookmarks: JSON.stringify([...bookmarkData.entries()]) });

            e.target.textContent = 'ブックマーク';
            console.info('N Bookmarks: ブックマークを解除しました');
        } else {
            // ブックマークしていない場合
            const contentType = location.href.match(/exercise|movie|guide/)[0];
            const courseElem = document.querySelector('[aria-label="パンくずリスト"] li:nth-child(2)>a');
            const chapterElem = document.querySelector('[aria-label="パンくずリスト"] li:nth-child(3) span');
            const title =
                contentType === 'guide' ?
                    doc.querySelector("h3").textContent :
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
                console.info('N Bookmarks: 初期化しました');
            }

            bookmarkData.set(location.pathname, newBookmark);
            chrome.storage.local.set({ bookmarks: JSON.stringify([...bookmarkData.entries()]) });

            e.target.textContent = 'ブックマーク中';
            console.info('N Bookmarks: ブックマークを追加しました：', newBookmark);
        }
    });
    header.insertBefore(btn, header.querySelector('#question-btn'));
}

// ループする方のボタンを追加する関数
async function appendBtn(time, trial) {
    async function promiseLoop(func, trial, sleepMs, isThrow = false) {
        for (let i = 0; i < trial; i++) {
            try {
                const result = await func();
                return result;
            } catch (e) {
                await sleep(sleepMs);
                if (i < trial) continue;

                // ループじゃ解決しなかった場合
                console.log(e.message);
                const errObj = new Error(`N Bookmarks：loop関数内でエラーが発生しました：${message}`);
                if (isThrow) {
                    console.error(errObj);
                    throw errObj;
                } else {
                    console.info(errObj);
                }
            }
        }
    }

    await promiseLoop(async () => await appendBookmarkBtn(document), trial, time)
}
