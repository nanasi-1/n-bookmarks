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
window.addEventListener('urlChange', async () => {
    if (location.href !== 'https://www.nnn.ed.nico/my_course') return;

    await sleep(100);
    console.log('プログラム N Bookmark を起動します()');

    // 初期化が済んでいなければ初期化
    if (!(await getBookmarks())) {
        console.info('初期化しました');
        await chrome.storage.local.set({ bookmarks: JSON.stringify([]) });
    }

    // ブックマークになるエリア
    const bookmarkArea = document.querySelector('[role="main"] > div > div:nth-child(2)');

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


// 関数群

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

// urlChangeイベント
let oldUrl = ''; // URLの一時保管用
const observer = new MutationObserver(async () => {
    await sleep(50); // 判定が速すぎたため
    if(oldUrl !== location.href) {
        window.dispatchEvent(new CustomEvent('urlChange', {detail: oldUrl || ''}));
        oldUrl = location.href; // oldUrlを更新
    }
});
window.addEventListener('load', () => {
    observer.observe(document.body, {
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true
    });
});