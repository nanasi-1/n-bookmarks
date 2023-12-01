// メイン処理
!async function () {
    await chrome.storage.local.set({ lastAccess: 'あれ？' });
    console.log(await chrome.storage.local.get('lastAccess'));
}();

// ブックマークを取得する関数
async function getBookmarks() {
    /** @type {{bookmarks: any[]}} */
    const bookmarks = await chrome.storage.local.get('bookmarks');
    if (!bookmarks.bookmarks) {
        await chrome.storage.local.set({ bookmarks: []} );
        return [];
    } else {
        return bookmarks.bookmarks;
    }
}