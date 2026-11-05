# portfolio

藤井則行のポートフォリオサイトです。

**https://norinko.jp/**

## 構成

ビルド不要の静的サイトです（HTML / CSS / JavaScript）。

| ファイル | 内容 |
|---|---|
| `index.html` | ページの骨組み |
| `data.js` | スキルと制作物のデータ。**中身を変えるときはここだけ編集** |
| `script.js` | 制作物・スライド・スキル一覧の描画 |
| `style.css` | デザイン（ライト / ダーク対応） |
| `img/` | 実機画面のスクリーンショットと OGP 画像 |

`data.js` の制作物は、`url` か `live: true` があると「公開中のアプリ」に画像付きで、どちらもないと「そのほかの制作物」に一覧で表示されます。

## 公開

コアサーバーの `~/domains/norinko.jp/public_html/` に、`.claude` と `README.md` 以外のファイルをそのまま置いています。

```bash
scp -r index.html style.css script.js data.js favicon.svg apple-touch-icon.png img <user>@<server>:domains/norinko.jp/public_html/
```
