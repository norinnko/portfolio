const $ = (s, root = document) => root.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// テーマ切り替え（トップページと同じ設定を共有）
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch {}
$("#theme").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

// コメント
const API = "comments.php";
const list = $("#comment-list");
const empty = $("#comment-empty");
const form = $("#comment-form");
const status = $("#comment-status");
const openedAt = Date.now();

function setStatus(text, kind = "") {
  status.textContent = text;
  status.className = `comment-status ${kind}`;
}

async function loadComments() {
  try {
    const res = await fetch(API, { cache: "no-store" });
    const data = await res.json();
    const items = data.comments || [];
    list.innerHTML = items.map((c) => `
      <li>
        <p class="comment-meta"><b>${esc(c.name || "匿名")}</b><time>${esc(c.date)}</time></p>
        <p class="comment-body">${esc(c.body)}</p>
      </li>`).join("");
    empty.hidden = items.length > 0;
  } catch {
    empty.hidden = false;
    empty.textContent = "コメントを読み込めませんでした。";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const body = String(fd.get("body") || "").trim();
  if (!body) { setStatus("コメントを入力してください。", "err"); return; }

  const btn = $("button", form);
  btn.disabled = true;
  setStatus("送信しています…");
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") || "").trim(),
        body,
        website: fd.get("website") || "",
        elapsed: Date.now() - openedAt,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || "送信できませんでした。");
    form.reset();
    setStatus("ありがとうございます！確認したあとに表示されます。", "ok");
  } catch (err) {
    setStatus(err.message, "err");
  } finally {
    btn.disabled = false;
  }
});

loadComments();
