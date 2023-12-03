# N Bookmarks

N予備校の教材をブックマーク


## 概要

N Bookmarks は、その名の通りN予備校の教材をブックマークする拡張機能です。  

教材の「質問する」ボタンの左に「ブックマーク」ボタンが表示されるようになり、
ブックマークした教材はマイコース一覧ページから見ることができます。

以前フォーラムで授業ををブックマークする機能が欲しいという質問を見かけ、
それに感化されて、なぜか授業ではなく教材をブックマークする拡張機能が誕生しました。


## 使い方

この拡張機能を入れると、マイコースの表示が変わり、ブックマークした教材一覧を見ることができます。  
もともとあった「新しい学習を見つけよう」のところは消えました。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3588083/6af7202a-0a09-54a9-71f7-ce539640a184.png" width="500px">

また、教材にある「質問する」ボタンの隣にブックマークボタンが追加されます。  
このボタンを押すと教材がブックマークされます。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3588083/68794da1-6e40-db8c-669e-3d44b9b548b5.png" width="500px">


## 入れ方

この拡張機能はChromeウェブストアでは公開していません。  
そのため、このリポジトリを**ローカルにクローン**して、「**パッケージ化されていない拡張機能を読み込む**」から入れる必要があります。


## 発生している不具合


### ページの読み込み前にコードが実行される

たまに`Cannot read properties of null (reading 'なんちゃら')`というエラーが出ます。  
多分ページの読み込みが終わっていないうちに拡張機能が実行されてしまうのが原因です。  
一応対策は取っていますが、それでもエラーが出ることがあります。  

解決策があれば教えてくださると助かります。


### 動画教材のブックマークボタンにスタイルが適用されない

動画教材に表示されるブックマークボタンにうまくスタイルが適用されません。  
ボタンの背景色は青ではなく灰色になってしまい、位置も少しおかしいです。  

おそらく、問題教材やテキスト教材で適用されていたCSSが、動画教材だと適用されないのが原因だと思います。  
1からCSSを作ればいい話ではあるのですが、面倒でやっていません。  

やってくれる人いたらものすごく助かります。
