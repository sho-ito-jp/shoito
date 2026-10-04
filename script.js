const modalButtons = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal-close");


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
