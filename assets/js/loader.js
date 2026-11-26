(() => {
    const loader = document.getElementById("page-loader");
    const year = document.getElementById("loader-year");
    if (year) year.textContent = new Date().getFullYear();
    if (!loader) return document.body.classList.remove("is-loading");

    const started = Date.now();
    let hidden = false;
    const hide = () => {
        if (hidden) return;
        hidden = true;
        loader.classList.add("is-hidden");
        loader.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-loading");
        setTimeout(() => loader.remove(), 750);
    };
    const finish = () => setTimeout(hide, Math.max(0, 1500 - (Date.now() - started)));

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    setTimeout(hide, 8000);
})();
