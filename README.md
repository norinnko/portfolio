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
scp -r index.html style.css script.js data.js favicon.svg apple-touch-icon.png robots.txt sitemap.xml img hackathon-2026 <user>@<server>:domains/norinko.jp/public_html/
```

## ハッカソンの記事ページとコメント

`hackathon-2026/` は全日本AIハッカソン 2026 優勝の記事ページです（トップページの「速報」とは別）。

- コメントは `comments.php` が受け付け、**承認待ち**として保存します。承認したものだけが記事に表示されます。
- 承認・削除は `hackathon-2026/admin.php` から（パスワードでログイン）。新しいコメントが届くとメールで通知します。
- 保存先と設定は公開フォルダの外 `~/domains/norinko.jp/data/` にあり、このリポジトリには含めていません。
  - `config.php`：管理パスワードのハッシュ・通知先・ソルト
  - `comments.json`：コメント本体
- ボット対策：見えない入力欄、画面を開いてすぐの送信を無視、同じ人の連投は60秒あける、URL 禁止、400文字まで。
- サーバーの PHP は 7.4 なので、それで動く書き方にしています。
