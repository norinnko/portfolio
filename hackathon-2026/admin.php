<?php
// コメントの承認・削除（パスワードでログイン）
require __DIR__ . '/_comments_lib.php';

const LOCK_AFTER = 5;          // この回数パスワードを間違えると
const LOCK_SECONDS = 900;      // 15分ログインできなくする
define('LOGIN_FILE', COMMENTS_DATA_DIR . '/login.json');

header('X-Robots-Tag: noindex, nofollow');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/hackathon-2026/',
    'secure' => !empty($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_name('norinko_admin');
session_start();

function h($s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function login_state(): array
{
    $s = is_file(LOGIN_FILE) ? json_decode((string)file_get_contents(LOGIN_FILE), true) : null;
    return is_array($s) ? $s : ['fails' => 0, 'until' => 0];
}

function save_login_state(array $s): void
{
    file_put_contents(LOGIN_FILE, json_encode($s), LOCK_EX);
}

function csrf(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

$message = '';
$action = $_POST['action'] ?? '';

// ログイン
if ($action === 'login') {
    $state = login_state();
    $hash = comments_config()['admin_hash'] ?? '';
    if ($state['until'] > time()) {
        $message = 'ロック中です。しばらくしてからもう一度お試しください。';
    } elseif ($hash && password_verify((string)($_POST['password'] ?? ''), $hash)) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        save_login_state(['fails' => 0, 'until' => 0]);
        header('Location: admin.php');
        exit;
    } else {
        sleep(1);
        $state['fails']++;
        if ($state['fails'] >= LOCK_AFTER) {
            $state = ['fails' => 0, 'until' => time() + LOCK_SECONDS];
        }
        save_login_state($state);
        $message = 'パスワードが違います。';
    }
}

$authed = !empty($_SESSION['admin']);

// ログイン後の操作
if ($authed && $action && $action !== 'login') {
    if (!hash_equals(csrf(), (string)($_POST['csrf'] ?? ''))) {
        http_response_code(400);
        exit('不正な操作です。');
    }
    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: admin.php');
        exit;
    }
    $id = (int)($_POST['id'] ?? 0);
    comments_update(function ($data) use ($action, $id) {
        foreach ($data['items'] as $i => $c) {
            if ($c['id'] !== $id) {
                continue;
            }
            if ($action === 'approve') {
                $data['items'][$i]['status'] = 'approved';
            } elseif ($action === 'hide') {
                $data['items'][$i]['status'] = 'pending';
            } elseif ($action === 'delete') {
                array_splice($data['items'], $i, 1);
            }
            return $data;
        }
        return null;
    });
    header('Location: admin.php');
    exit;
}

$items = $authed ? array_reverse(comments_read()['items']) : [];
$pending = array_filter($items, function ($c) { return $c['status'] === 'pending'; });
$approved = array_filter($items, function ($c) { return $c['status'] === 'approved'; });

function row(array $c, string $token): string
{
    $buttons = $c['status'] === 'pending'
        ? '<button name="action" value="approve" class="ok">承認して表示</button>'
        : '<button name="action" value="hide">非表示に戻す</button>';
    return '<li><p class="meta"><b>' . h($c['name'] ?: '匿名') . '</b>' . h(date('Y.m.d H:i', strtotime($c['created']))) . '</p>'
        . '<p class="body">' . nl2br(h($c['body'])) . '</p>'
        . '<form method="post"><input type="hidden" name="csrf" value="' . h($token) . '">'
        . '<input type="hidden" name="id" value="' . (int)$c['id'] . '">' . $buttons
        . '<button name="action" value="delete" class="del">削除</button></form></li>';
}
?>
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>コメント管理</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f4f1ea; color: #1d1b18; max-width: 720px; margin: 0 auto; padding: 24px 16px; line-height: 1.7; }
    h1 { font-size: 1.3rem; } h2 { font-size: 1rem; margin-top: 32px; border-bottom: 1px solid #d9d3c7; padding-bottom: 6px; }
    ul { list-style: none; padding: 0; } li { padding: 12px 0; border-bottom: 1px solid #d9d3c7; }
    .meta { font-size: .8rem; color: #6b665d; margin: 0; } .meta b { color: #1d1b18; margin-right: .6em; }
    .body { margin: 4px 0 8px; word-break: break-word; }
    button { font: inherit; font-size: .85rem; padding: 4px 12px; margin-right: 6px; cursor: pointer; border: 1px solid #d9d3c7; background: #fff; }
    .ok { background: #16a34a; color: #fff; border-color: #16a34a; } .del { color: #c2410c; }
    input[type=password] { font: inherit; padding: 6px 10px; border: 1px solid #d9d3c7; }
    .msg { color: #c2410c; } .top { display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
<?php if (!$authed): ?>
  <h1>コメント管理</h1>
  <?php if ($message): ?><p class="msg"><?= h($message) ?></p><?php endif; ?>
  <form method="post">
    <input type="hidden" name="action" value="login">
    <input type="password" name="password" autocomplete="current-password" required autofocus aria-label="パスワード">
    <button>ログイン</button>
  </form>
<?php else: $token = csrf(); ?>
  <div class="top">
    <h1>コメント管理</h1>
    <form method="post"><input type="hidden" name="csrf" value="<?= h($token) ?>"><button name="action" value="logout">ログアウト</button></form>
  </div>
  <p><a href="./#comments">記事ページを開く</a></p>
  <h2>承認待ち（<?= count($pending) ?>件）</h2>
  <ul><?php foreach ($pending as $c) echo row($c, $token); ?></ul>
  <?php if (!$pending): ?><p>承認待ちのコメントはありません。</p><?php endif; ?>
  <h2>表示中（<?= count($approved) ?>件）</h2>
  <ul><?php foreach ($approved as $c) echo row($c, $token); ?></ul>
<?php endif; ?>
</body>
</html>
