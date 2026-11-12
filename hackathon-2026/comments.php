<?php
// コメントの取得（承認済みのみ）と投稿（承認待ちとして保存）
require __DIR__ . '/_comments_lib.php';

const MAX_BODY = 400;
const MAX_NAME = 30;
const MIN_ELAPSED_MS = 3000;   // 画面を開いてすぐの送信はボットとみなす
const RATE_SECONDS = 60;       // 同じ人からの連続投稿の間隔
const MAX_PENDING = 200;       // 承認待ちがこれ以上たまったら受け付けない

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $data = comments_read();
    $out = [];
    foreach ($data['items'] as $c) {
        if (($c['status'] ?? '') !== 'approved') {
            continue;
        }
        $out[] = [
            'name' => $c['name'],
            'body' => $c['body'],
            'date' => date('Y.m.d', strtotime($c['created'])),
        ];
    }
    comments_json(['comments' => $out]);
}

if ($method !== 'POST') {
    comments_json(['ok' => false, 'error' => '対応していない操作です。'], 405);
}

// 別サイトからの送信は受け付けない
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$host = parse_url($origin, PHP_URL_HOST);
if ($host !== 'norinko.jp' && $host !== 'localhost') {
    comments_json(['ok' => false, 'error' => '送信できませんでした。'], 403);
}

$in = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($in)) {
    comments_json(['ok' => false, 'error' => '送信内容を読み取れませんでした。'], 400);
}

// ボット対策：見えない入力欄が埋まっている／開いてすぐ送信 → 成功したふりをして捨てる
if (!empty($in['website']) || (int)($in['elapsed'] ?? 0) < MIN_ELAPSED_MS) {
    comments_json(['ok' => true]);
}

$name = comments_clean((string)($in['name'] ?? ''));
$body = comments_clean((string)($in['body'] ?? ''));
$name = preg_replace('/\s+/u', ' ', $name) ?? '';

if ($body === '') {
    comments_json(['ok' => false, 'error' => 'コメントを入力してください。'], 422);
}
if (mb_strlen($body) > MAX_BODY) {
    comments_json(['ok' => false, 'error' => 'コメントは' . MAX_BODY . '文字までです。'], 422);
}
if (mb_strlen($name) > MAX_NAME) {
    comments_json(['ok' => false, 'error' => 'お名前は' . MAX_NAME . '文字までです。'], 422);
}
if (preg_match('~https?://|www\.|\[url~i', $name . ' ' . $body)) {
    comments_json(['ok' => false, 'error' => 'URL は書き込めません。'], 422);
}

$ip = comments_ip_hash();
$now = time();
$error = null;
$saved = null;

comments_update(function ($data) use ($ip, $now, $name, $body, &$error, &$saved) {
    // 古い連投記録は掃除する
    foreach ($data['rate'] as $k => $t) {
        if ($now - $t > RATE_SECONDS) {
            unset($data['rate'][$k]);
        }
    }
    if (isset($data['rate'][$ip])) {
        $error = '少し時間をおいてから送信してください。';
        return $data;
    }
    $pending = 0;
    foreach ($data['items'] as $c) {
        if (($c['status'] ?? '') === 'pending') {
            $pending++;
        }
    }
    if ($pending >= MAX_PENDING) {
        $error = 'ただいまコメントを受け付けていません。';
        return null;
    }
    $saved = [
        'id' => $data['next_id']++,
        'name' => $name,
        'body' => $body,
        'created' => date('c', $now),
        'status' => 'pending',
        'ip' => $ip,
    ];
    $data['items'][] = $saved;
    $data['rate'][$ip] = $now;
    return $data;
});

if ($error) {
    comments_json(['ok' => false, 'error' => $error], 429);
}
comments_notify($saved);
comments_json(['ok' => true]);
