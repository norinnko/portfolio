// ===== ここを編集すればサイトの中身が変わります =====
// url: 公開URL（あれば「公開中のアプリ」に画像付きで表示）
// live: true なら URL を出さずに「公開中のアプリ」に表示（caption に表示する文言）
// repo: GitHubリポジトリURL（無ければ ""）
// slides: 実機画面のスクリーンショット（img/ フォルダ）
// points: 箇条書きで見せたい機能（任意）, note: 補足（任意）

const GITHUB = "https://github.com/norinnko";

const SKILLS = [
  { group: "フロントエンド", items: ["HTML / CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
  { group: "バックエンド", items: ["PHP（Laravel）", "Python（Django / Flask）"] },
  { group: "データベース", items: ["MySQL / MariaDB", "Oracle Database", "SQLite", "Supabase"] },
  { group: "セキュリティ", items: ["Burp Suite", "OWASP ZAP", "Kali Linux", "OWASP Top 10 の診断"] },
  { group: "インフラ・その他", items: ["Linux サーバーへのデプロイ", "Docker", "GitHub Actions", "LINE Messaging API", "Google API", "OpenAI API"] },
];

const WORKS = [
  // ---------- 公開中 ----------
  {
    title: "就活マネージャー",
    category: "Web App",
    desc: "就活の企業・選考・予定・ES を1か所にまとめるために作った、自分用の管理アプリです。毎日これで予定を確認しています。",
    points: [
      "選考状況をカンバンで管理（ドラッグで段階を移動）",
      "予定を登録すると Google カレンダーにも自動で反映",
      "毎朝、今日の予定を LINE に通知。企業からの重要なメールも LINE に届く",
      "Gmail から就活メールを取り込み、AI が「要対応か」を判定",
      "ES の回答を設問ごとに保存して、別の企業用に複製",
    ],
    note: "個人データを扱うため、ログインは許可したアカウントのみです。画面内の企業名は架空のものに差し替えています。",
    tags: ["Laravel", "React", "TypeScript", "Inertia.js", "MariaDB", "Google Calendar API", "Gmail API", "LINE Messaging API", "OpenAI API"],
    url: "https://shukatsu.norinko.jp/",
    repo: `${GITHUB}/shukatsu-manager`,
    slides: ["img/shukatsu-0.jpg", "img/shukatsu-1.jpg"],
  },
  {
    title: "店舗の日報アプリ",
    category: "Web App",
    desc: "飲食店で実際に運用している、スタッフ用の日報アプリです。紙やグループ LINE に散らばっていた振り返りを1か所に集め、あとから検索できるようにしました。",
    points: [
      "日報は「事実／解釈／次へ」の3欄。見たことと受け取り方を分けて書く",
      "お店全体の「共通認識」（いまの目標）を掲げ、それに沿った日報を絞り込める",
      "共用端末でも安心なように「〇〇さんとしてログイン中」を常に表示。パスワードを続けて間違えるとロック",
      "管理者の引き継ぎ手順をアプリ内に用意し、毎日 GitHub Actions で自動バックアップ",
      "Cloudflare の無料枠だけで運用（費用 0 円）",
    ],
    note: "お店で運用中のため URL は非公開です。画面内の店名・人名は架空のものに差し替えています。",
    tags: ["JavaScript", "Cloudflare Workers", "Cloudflare D1", "GitHub Actions"],
    live: true,
    caption: "店舗で運用中（URL 非公開）",
    url: "",
    repo: "",
    slides: ["img/nippo-1.jpg"],
  },
  {
    title: "NoriNews",
    category: "Automation",
    desc: "毎朝6時に IT・セキュリティのニュースを自動で集めて、新聞のような紙面にするサービスです。朝の情報収集を楽にしたくて作りました。",
    points: [
      "Hacker News・はてな・Reddit・セキュリティ系ブログから取得",
      "英語の記事は日本語で要約",
      "自分の興味（Web 開発・AI・セキュリティ）に合わせて記事を点数付け",
    ],
    tags: ["Python", "Laravel", "スクレイピング", "OpenAI API", "定期実行"],
    url: "https://norinews.norinko.jp/norinews",
    repo: `${GITHUB}/norinews`,
    slides: ["img/news-1.jpg", "img/news-2.jpg", "img/news-3.jpg"],
  },
  {
    title: "CTF Tool DB",
    category: "Security",
    desc: "CTF の勉強中に「この問題には何のツールを使えばいいか」がすぐ分かるように作ったツール辞典です。",
    points: [
      "40 種類のツールを分野（Web / Forensics / Crypto / Pwn）と難易度で絞り込み",
      "使いどころとコマンド例を掲載",
      "ボタンを押すと AI がツールの使い方を解説",
    ],
    tags: ["JavaScript", "PHP", "OpenAI API"],
    url: "https://ctf-tool.norinko.jp/",
    repo: `${GITHUB}/ctf-tool`,
    slides: ["img/ctf-1.jpg", "img/ctf-2.jpg", "img/ctf-3.jpg"],
  },
  {
    title: "AIおぴにおん",
    category: "Web App",
    desc: "全日本AIハッカソン 2026 の予選に、チーム「のりもんすたー」として出場して作った作品です。当日発表されたテーマ「デタラメ」に合わせ、カメラに映った顔を GPT-4o が見て、架空の「生体異常」をでたらめに診断するアプリを3時間で作りました。",
    points: [
      "予選 Bブロック 1位で本選進出",
      "本選は 2026年11月7日、東京（ベルサール渋谷ファースト）",
      "医療機器のような見た目にこだわり、真面目な画面でふざけた診断が出る落差を狙った",
    ],
    award: { label: "全日本AIハッカソン 2026 本選進出", url: "https://www.aifestival.jp/news/japanaihack2026-03" },
    tags: ["JavaScript", "OpenAI API（GPT-4o Vision）", "カメラ API"],
    url: "https://ai-hack.norinko.jp/",
    repo: "",
    slides: ["img/ai-1.jpg"],
  },

  // ---------- GitHub のみ ----------
  {
    title: "就活カレンダー Bot",
    category: "LINE Bot",
    desc: "LINE で「追加 〇〇 ES締切 6/15」と送るだけで予定を登録できる Bot。月のカレンダー画像を返したり、7日前と当日にリマインドしたりします。",
    tags: ["Python", "Flask", "LINE Messaging API", "Pillow", "GitHub Actions"],
    repo: `${GITHUB}/shukatsu-calendar`,
  },
  {
    title: "やられポット",
    category: "Security",
    desc: "攻撃者をおびき寄せるハニーポット。打たれたコマンドと、その意味・危険度を日本語で記録して画面で見られるようにしました。",
    tags: ["Python", "Docker", "SSH / HTTP"],
    repo: `${GITHUB}/honeypot`,
  },
  {
    title: "脆弱性診断ラボ",
    category: "Security",
    desc: "外部とつながらない仮想環境にわざと脆弱な Web アプリを置き、OWASP Top 10 を実際に診断して報告書を書く練習環境です。",
    tags: ["Kali Linux", "Burp Suite", "OWASP ZAP", "Docker", "VirtualBox"],
    repo: `${GITHUB}/vuln-lab`,
  },
  {
    title: "norimoney",
    category: "Web App",
    desc: "Next.js と Supabase で作っている家計管理アプリ。テストも書きながら開発しています。",
    tags: ["Next.js", "Supabase", "Tailwind CSS", "Vitest"],
    repo: `${GITHUB}/norimoney`,
  },
  {
    title: "不動産物件管理",
    category: "Web App",
    desc: "賃貸物件の情報を PC で一括管理するアプリの試作。ネットにつながっていない PC でもダブルクリックで起動できるようにしました。",
    tags: ["Python", "Django", "SQLite", "Bootstrap"],
    repo: `${GITHUB}/norirental`,
  },
  {
    title: "思い出日記カレンダー",
    category: "Web App",
    desc: "予定と、その日の写真・日記・気分を同じカレンダーで残せるアプリ。グループで共有もできます。",
    tags: ["Laravel", "Blade", "MySQL"],
    repo: `${GITHUB}/noricalendar`,
  },
  {
    title: "麻雀点数計算",
    category: "Web App",
    desc: "手牌と和了牌を入力すると、翻・符・点数・役を計算します。計算履歴はユーザーごとに保存。（学校の課題）",
    tags: ["Python", "Django"],
    repo: `${GITHUB}/Djangomahjong`,
  },
  {
    title: "ボンボンドロップシール巡回マップ",
    category: "Web",
    desc: "大阪・京都のお店をエリアごとにまとめた地図ページ。",
    tags: ["HTML", "CSS", "JavaScript"],
    repo: `${GITHUB}/bondoro-map`,
  },
];
