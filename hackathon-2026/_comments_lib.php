<?php
// コメント機能の共通処理（直接アクセスされても何も返さない）
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

date_default_timezone_set('Asia/Tokyo');

// データは公開フォルダの外（~/domains/norinko.jp/data）に置く
define('COMMENTS_DATA_DIR', dirname(__DIR__, 2) . '/data');
define('COMMENTS_FILE', COMMENTS_DATA_DIR . '/comments.json');
define('COMMENTS_CONFIG', COMMENTS_DATA_DIR . '/config.php');

function comments_config(): array
{
    static $config = null;
    if ($config === null) {
        $config = is_file(COMMENTS_CONFIG) ? (require COMMENTS_CONFIG) : [];
    }
    return $config;
}

/**
 * ファイルをロックしたまま読み書きする。$fn は配列を受け取り、書き戻す配列か null（変更なし）を返す。
 */
function comments_update(callable $fn)
{
    if (!is_dir(COMMENTS_DATA_DIR)) {
        mkdir(COMMENTS_DATA_DIR, 0700, true);
    }
    $fp = fopen(COMMENTS_FILE, 'c+');
    if (!$fp) {
        throw new RuntimeException('保存先を開けませんでした。');
    }
    try {
        flock($fp, LOCK_EX);
        $raw = stream_get_contents($fp);
        $data = $raw ? json_decode($raw, true) : null;
        if (!is_array($data)) {
            $data = ['next_id' => 1, 'items' => [], 'rate' => []];
        }
        $result = $fn($data);
        if (is_array($result)) {
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            fflush($fp);
        }
        return $data;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

function comments_read(): array
{
    return comments_update(function ($data) {
        return null;
    });
}

function comments_ip_hash(): string
{
    $salt = comments_config()['salt'] ?? 'norinko';
    return substr(hash('sha256', $salt . ($_SERVER['REMOTE_ADDR'] ?? '')), 0, 16);
}

function comments_json($payload, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function comments_clean(string $s): string
{
    // 制御文字（改行以外）を取り除き、改行は3連続までに
    $s = preg_replace('/[^\P{C}\n]/u', '', $s) ?? '';
    $s = preg_replace("/\n{3,}/", "\n\n", str_replace(["\r\n", "\r"], "\n", $s)) ?? '';
    return trim($s);
}

function comments_notify(array $item): void
{
    $to = comments_config()['notify'] ?? '';
    if (!$to) {
        return;
    }
    $subject = '=?UTF-8?B?' . base64_encode('【norinko.jp】新しいコメントが届きました') . '?=';
    $body = "名前: " . ($item['name'] ?: '匿名') . "\n\n" . $item['body']
        . "\n\n承認・削除はこちら: https://norinko.jp/hackathon-2026/admin.php\n";
    $headers = "From: norinko.jp <noreply@norinko.jp>\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n";
    @mail($to, $subject, chunk_split(base64_encode($body)), $headers);
}
