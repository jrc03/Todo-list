// dialogManager.js

// Function to open the dialog
export function openProjectDialog(dialogElement) {
    dialogElement.showModal();
}

// Function to close the dialog
export function closeProjectDialog(dialogElement) {
    dialogElement.close();
}

// Attach event listeners (can be called from your main JS file)
export function initializeDialogListeners() {
    const dialog = document.querySelector('dialog');
    const openBtn =document.querySelector("#addProjectBtn"); // Assuming you have a button to open the dialog
    const closeBtn =  document.querySelector("#closeProjectFormBtn");

    if (openBtn) {
        openBtn.addEventListener('click', () => openProjectDialog(dialog));
    }

    closeBtn.addEventListener('click', () => closeProjectDialog(dialog));
}
