const modalButtons = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal-close");


// ==============================
// モーダル
// ==============================

// モーダルを開く
modalButtons.forEach(button => {
  button.addEventListener("click", () => {

    const targetId = button.dataset.modal;
    const targetModal = document.getElementById(targetId);

    if (!targetModal) return;

    targetModal.classList.add("is-open");

  });
});


// モーダルを閉じる
closeButtons.forEach(button => {
  button.addEventListener("click", () => {

    const modal = button.closest(".modal");

    if (!modal) return;

    modal.classList.remove("is-open");

  });
});


// ESCキーでも閉じる
document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;

  modals.forEach(modal => {
    modal.classList.remove("is-open");
  });

});


// ==============================
// GitHub CMS
// ==============================

const GITHUB_API =
  "https://api.github.com/repos/sho-ito-jp/shoito/contents/";


// MarkdownのFront Matterを読む
function parseMarkdown(text) {

  const match = text.match(/^---\s*([\s\S]*?)\s*---/);

  if (!match) return {};

  const data = {};

  match[1].split("\n").forEach(line => {

    const colon = line.indexOf(":");

    if (colon === -1) return;

    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();

    data[key] = value;

  });

  return data;
}


// GitHubのフォルダからMarkdownを取得
async function loadCollection(folder, targetId) {

  const target = document.getElementById(targetId);

  if (!target) return;

  try {

    const response = await fetch(
      `${GITHUB_API}${folder}?ref=main`
    );

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const files = await response.json();

    target.innerHTML = "";

    for (const file of files) {

      if (!file.name.endsWith(".md")) continue;

      const markdownResponse = await fetch(file.download_url);

      if (!markdownResponse.ok) continue;

      const markdown = await markdownResponse.text();

      const data = parseMarkdown(markdown);

      if (!data.title) continue;


      const item = document.createElement("a");

      item.className = "cms-item";

      item.textContent = data.title;

      if (data.url) {
        item.href = data.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      }


      target.appendChild(item);

    }

  } catch (error) {

    console.error(
      `CMSデータの読み込みに失敗しました: ${folder}`,
      error
    );

  }

}


// ==============================
// DISCOGRAPHY / WORKS
// ==============================

loadCollection(
  "content/discography",
  "discography-list"
);

loadCollection(
  "content/works",
  "works-list"
);

// ==============================
// LINKS
// ==============================

loadCollection(
  "content/links",
  "links-list"
);

// ==============================
// STAGE
// ==============================

async function loadStage() {

  const target = document.querySelector(".stage-list");

  if (!target) return;

  try {

    const response = await fetch(
      `${GITHUB_API}content/stage?ref=main`
    );

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const files = await response.json();

    target.innerHTML = "";

    for (const file of files) {

      if (!file.name.endsWith(".md")) continue;

      const markdownResponse = await fetch(file.download_url);

      if (!markdownResponse.ok) continue;

      const markdown = await markdownResponse.text();

      const data = parseMarkdown(markdown);

      if (!data.title) continue;


      const item = document.createElement("article");

      item.className = "stage-item";


      const date = document.createElement("div");

      date.className = "stage-date";

      date.textContent = data.date || "";


const title = document.createElement("h3");

title.className = "stage-title";

if (data.url) {

  const link = document.createElement("a");

  link.href = data.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.textContent = data.title;

  title.appendChild(link);

} else {

  title.textContent = data.title;

}


      const description = document.createElement("p");

      description.className = "stage-description";

      description.textContent = data.description || "";


      item.appendChild(date);
      item.appendChild(title);
      item.appendChild(description);

      target.appendChild(item);

    }

  } catch (error) {

    console.error(
      "STAGEデータの読み込みに失敗しました",
      error
    );

  }

}

loadStage();
