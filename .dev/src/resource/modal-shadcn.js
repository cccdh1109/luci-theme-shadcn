"use strict";
"require baseclass";

const DISMISS_LABEL_RE = /^(cancel|close|dismiss|取消|关闭)$/i;

return baseclass.extend({
  __init__() {
    if (document.documentElement.getAttribute("data-shadcn-modal-guard") === "1") return;
    document.documentElement.setAttribute("data-shadcn-modal-guard", "1");

    document.addEventListener(
      "click",
      (ev) => {
        this._scheduleNotificationFallback(ev.target);
        this._scheduleModalFallback(ev.target);
      },
      true,
    );
  },

  _scheduleNotificationFallback(target) {
    const button = this._closest(target, ".alert-message .btn, .alert-message button");
    if (!button) return;

    const message = button.closest(".alert-message");
    if (!message) return;

    window.setTimeout(() => {
      if (message.parentNode && message.classList.contains("fade-out")) {
        message.parentNode.removeChild(message);
      }
    }, 300);
  },

  _scheduleModalFallback(target) {
    const control = this._closest(
      target,
      "#modal_overlay button, #modal_overlay .btn, #modal_overlay input[type='button'], #modal_overlay input[type='reset']",
    );

    if (!control || !this._isDismissControl(control)) return;

    window.setTimeout(() => {
      if (
        document.body.classList.contains("modal-overlay-active") &&
        window.L &&
        typeof L.hideModal === "function"
      ) {
        L.hideModal();
      }
    }, 0);
  },

  _closest(target, selector) {
    const node = target && target.nodeType === 1 ? target : target && target.parentElement;
    return node && node.closest ? node.closest(selector) : null;
  },

  _isDismissControl(control) {
    const label = String(
      control.textContent ||
        control.value ||
        control.getAttribute("aria-label") ||
        control.getAttribute("title") ||
        "",
    ).trim();

    return DISMISS_LABEL_RE.test(label);
  },
});
