// js/script.js
(function () {
    const button = document.getElementById("menuButton");
    const menu = document.getElementById("popupMenu");
    const MOBILE_MAX = 699;

    function isMobile() {
        return window.innerWidth <= MOBILE_MAX;
    }

    function placeMenuUnderButton() {
        // 一旦表示してサイズを測る（チラつき防止で可視化は抑制）
        menu.style.visibility = "hidden";
        menu.classList.remove("hidden");
        // レイアウト確定
        menu.getBoundingClientRect();

        const gap = 8;
        const btn = button.getBoundingClientRect();
        const mw = menu.offsetWidth;
        const mh = menu.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // 右端をボタン右に合わせる
        let left = Math.round(btn.right - mw);
        let top = Math.round(btn.bottom + gap);

        // 画面内に収めるクランプ
        left = Math.max(8, Math.min(left, vw - mw - 8));
        top = Math.max(8, Math.min(top, vh - mh - 8));

        // ビューポート基準で固定
        menu.style.position = "fixed";
        menu.style.left = left + "px";
        menu.style.top = top + "px";

        // 表示 & アニメーション
        menu.style.visibility = "";
        menu.classList.add("showing");
        menu.addEventListener("animationend", () => {
            menu.classList.remove("showing");
        }, { once: true });
    }

    function openMenu() {
        if (!isMobile()) return;

        placeMenuUnderButton();
        button.setAttribute("aria-expanded", "true");
        document.addEventListener("mousedown", onDocClick);
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);
    }

    function closeMenu() {
        if (menu.classList.contains("hidden")) return;
        menu.classList.add("hidden");
        button.setAttribute("aria-expanded", "false");
        document.removeEventListener("mousedown", onDocClick);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll, true);
    }

    function toggleMenu() {
        if (menu.classList.contains("hidden")) {
            openMenu();
        } else {
            closeMenu();
        }
    }

    function onDocClick(e) {
        if (!menu.contains(e.target) && !button.contains(e.target)) {
            closeMenu();
        }
    }

    function onResize() {
        if (!isMobile()) {
            // PCに戻ったらインライン座標を撤去し常時表示
            menu.classList.remove("hidden");
            menu.style.left = "";
            menu.style.top = "";
            menu.style.position = "";
            button.setAttribute("aria-expanded", "false");
            return;
        }
        // モバイルで開いている最中は追従
        if (!menu.classList.contains("hidden")) placeMenuUnderButton();
    }

    function onScroll() {
        // スクロール時もボタン直下に追従
        if (!menu.classList.contains("hidden")) placeMenuUnderButton();
    }

    // 初期化
    button.addEventListener("click", toggleMenu);
    // 初期状態の整合
    if (isMobile()) menu.classList.add("hidden");
})();
