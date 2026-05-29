/**
 * Initializes the legal modal events.
 *
 * @returns {void}
 */
export function initLegalUI() {
    const legalButton = document.getElementById("legalButton");
    const legalModal = document.getElementById("legalModal");
    const legalCloseButton = document.getElementById("legalCloseButton");

    if (!legalButton || !legalModal || !legalCloseButton) return;

    legalButton.addEventListener("click", () => openLegalModal(legalModal));
    legalCloseButton.addEventListener("click", () => closeLegalModal(legalModal));

    legalModal.addEventListener("click", event => {
        if (event.target === legalModal) {
            closeLegalModal(legalModal);
        }
    });
}


/**
 * Opens the legal modal.
 *
 * @param {HTMLElement} legalModal - The legal modal element.
 * @returns {void}
 */
function openLegalModal(legalModal) {
    legalModal.classList.remove("d_none");
}


/**
 * Closes the legal modal.
 *
 * @param {HTMLElement} legalModal - The legal modal element.
 * @returns {void}
 */
function closeLegalModal(legalModal) {
    legalModal.classList.add("d_none");
}