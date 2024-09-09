export function openDialog(dialogElement) {
    dialogElement.showModal();
}

export function closeDialog(dialogElement) {
    dialogElement.close();
}

export function initializeProjectDialogListeners() {
    const dialog = document.querySelector('#addProjectDialog');
    const openBtn = document.querySelector("#addProjectBtn");
    const closeBtn = document.querySelector("#closeProjectFormBtn");
    const addProjectBtn = document.querySelector("#submitProject");
    
    if (openBtn) {
        openBtn.addEventListener('click', () => openDialog(dialog));
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeDialog(dialog));
    }
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => closeDialog(dialog));
    }
}

export function initializeTaskDialogListeners() {
    const dialog = document.querySelector("#addTaskDialog");
    const openBtn = document.querySelector("#addTaskBtn");
    const closeBtn = document.querySelector("#closeTaskFormBtn");
    
    if (openBtn) {
        openBtn.addEventListener('click', () => openDialog(dialog));
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeDialog(dialog));
    }
}

export function initializeClearDialogListeners() {
    const dialog = document.querySelector("#clearDialog");
    const openBtn = document.querySelector("#clearTasksBtn");
    const closeBtn = document.querySelector("#cancelClearBtn");
    
    if (openBtn) {
        openBtn.addEventListener('click', () => openDialog(dialog));
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeDialog(dialog));
    }
}