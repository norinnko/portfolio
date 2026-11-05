const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// テーマ切り替え
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

const link = (href, label, cls = "") => `<a href="${esc(href)}" target="_blank" rel="noopener" class="${cls}">${label}</a>`;
const tech = (tags) => `<p class="tech mono">${tags.map(esc).join(" / ")}</p>`;

// 受賞・入賞のある作品を先頭に
const isLive = (w) => w.url || w.live;
const LIVE = WORKS.filter(isLive).sort((a, b) => !!b.award - !!a.award);
const OTHERS = WORKS.filter((w) => !isLive(w));

// 公開中のアプリ
$("#showcase").innerHTML = LIVE.map((w, i) => {
  const slides = w.slides || [];
  const host = w.url ? new URL(w.url).host : w.caption || "";
  return `
  <article class="show">
    <figure>
      <div class="frame">
        ${slides.map((src, j) => `<img src="${esc(src)}" alt="${esc(w.title)} の画面 ${j + 1}" loading="lazy" class="${j === 0 ? "on" : ""}">`).join("")}
      </div>
      <figcaption>
        <span class="mono">${esc(host)}</span>
        ${slides.length > 1 ? `<span class="pager mono"><button data-d="-1" aria-label="前の画像">←</button><span>1 / ${slides.length}</span><button data-d="1" aria-label="次の画像">→</button></span>` : ""}
      </figcaption>
    </figure>
    <div>
      <p class="show-no mono">${String(i + 1).padStart(2, "0")} — ${esc(w.category)}</p>
      ${w.award ? `<p class="award">${esc(w.award.label)}</p>` : ""}
      <h3>${esc(w.title)}</h3>
      <p class="show-desc">${esc(w.desc)}</p>
      ${w.points ? `<ul class="points">${w.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${w.note ? `<p class="note">※ ${esc(w.note)}</p>` : ""}
      ${tech(w.tags)}
      <div class="show-links">
        ${w.url ? link(w.url, "サイトを開く ↗") : ""}
        ${w.award?.url ? link(w.award.url, "大会レポート ↗", "sub") : ""}
        ${w.repo ? link(w.repo, "GitHub ↗", "sub") : ""}
      </div>
    </div>
  </article>`;
}).join("");

// スライド（自動送り・矢印で手動送り）
$$(".show figure").forEach((fig) => {
  const imgs = $$(".frame img", fig);
  if (imgs.length < 2) return;
  const counter = $(".pager span", fig);
  let cur = 0, timer = null, visible = false, hover = false;
  const go = (n) => {
    imgs[cur].classList.remove("on");
    cur = (n + imgs.length) % imgs.length;
    imgs[cur].classList.add("on");
    counter.textContent = `${cur + 1} / ${imgs.length}`;
  };
  const sync = () => {
    clearInterval(timer);
    if (visible && !hover && !reduceMotion) timer = setInterval(() => go(cur + 1), 4000);
  };
  $$(".pager button", fig).forEach((b) => b.addEventListener("click", () => { go(cur + Number(b.dataset.d)); sync(); }));
  fig.addEventListener("mouseenter", () => { hover = true; sync(); });
  fig.addEventListener("mouseleave", () => { hover = false; sync(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(fig);
  } else { visible = true; sync(); }
});

// そのほかの制作物
$("#work-list").innerHTML = OTHERS.map((w) => `
  <li>
    <h3>${esc(w.title)}<span class="cat">${esc(w.category)}</span></h3>
    <div>
      <p>${esc(w.desc)}</p>
      ${tech(w.tags)}
    </div>
    ${w.repo ? link(w.repo, "GitHub ↗") : ""}
  </li>`).join("");

// スキル
$("#skill-list").innerHTML = SKILLS.map((g) =>
  `<dt>${esc(g.group)}</dt><dd>${g.items.map(esc).join("、")}</dd>`).join("");
