/**
 * @typedef Bookmark
 * @prop {string} url
 * @prop {string} title
 * @prop {string} chapterName
 * @prop {string} courseName
 * @prop {string} chapterUrl
 * @prop {string} courseUrl
 */

// メイン処理
!async function () {
    if(location.href !== 'https://www.nnn.ed.nico/my_course') return;
    
    await chrome.storage.local.set({ lastAccess: (new Date()).toISOString() });
    console.log((await chrome.storage.local.get('lastAccess')).lastAccess);

    // 初期化が済んでいなければ初期化
    if (!(await getBookmarks())) {
        console.info('初期化しました');
        await chrome.storage.local.set({ bookmarks: JSON.stringify([]) });
    }

    // ブックマークになるエリア
    const bookmarkArea = document.querySelector('[role="main"] > div > div:nth-child(2)');

    window.addEventListener('load', async () => {
        await sleep(100);
        console.log('プログラム N Bookmark を起動します()');

        // クラス一覧
        const container = document.querySelector('nav[aria-label="コース一覧"]>div');
        const ulClass = [...container.classList];
        ulClass.push(container.querySelector('ul:has(li>a)').classList[1]);
        const listTitleClass = [...container.querySelector('h3').classList].concat([...container.querySelector('h3').parentElement.classList]);
        const itemTitleClass = [container.querySelector('h4').classList[1]];
        const aClass = [...container.querySelector('a').classList]

        // 表示エリアに表示
        const ul = strToElement(`
            <ul class="${ulClass.join(' ')}">
                <li><h3 class="${listTitleClass.join(' ')}">ブックマーク</h3></li>
            </ul>
        `);
        const bookmarks = await getBookmarks();
        for (const [path, bookmark] of (bookmarks)) {
            ul.append(strToElement(
                `<li>
                    <a href="${bookmark.url}" class="${aClass.join(' ')}">
                        <h4 class="${itemTitleClass.join(' ')}">${bookmark.title}</h4>
                        <div>
                            ${bookmark.courseName} - ${bookmark.chapterName}
                        </div>
                    </a>
                </li>`
            ));
        }
        if (bookmarks.size === 0) {
            ul.append(strToElement(`
                <li class="${aClass.join(' ')}">まだブックマークはありません</li>
            `));
        }

        bookmarkArea.innerHTML = '';
        bookmarkArea.append(ul);
    });
}();

/** ブックマークを取得する関数 @returns {Promise<Map<string, Bookmark>>} */
async function getBookmarks() {
    /** @type {{bookmarks: Bookmark[]}} */
    const bookmarks = await chrome.storage.local.get('bookmarks');
    if (!bookmarks.bookmarks) {
        return null;
    } else {
        return new Map(JSON.parse(bookmarks.bookmarks))
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