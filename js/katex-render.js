(function () {
  function renderMath(root) {
    if (!root || !window.renderMathInElement) return;
    window.renderMathInElement(root, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    });
  }

  function math(value, display = false) {
    if (!value) return "";
    const escaped = String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    return display ? `$$${escaped}$$` : `\\(${escaped}\\)`;
  }

  window.ODEMath = { renderMath, math };
})();
