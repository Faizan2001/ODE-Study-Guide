(function () {
  const nodes = {
    start: {
      title: "Start with the equation",
      body: "Can you write it as dy/dx = f(x,y)? If yes, begin by checking structure instead of solving blindly.",
      branches: [
        ["Can it be written as g(x)h(y)?", "separable"],
        ["Can it be written as y' + P(x)y = f(x)?", "linear"],
        ["Can it be written as M dx + N dy = 0?", "exactCheck"],
        ["Does it match y' + P(x)y = f(x)y^n?", "bernoulli"]
      ]
    },
    separable: {
      title: "Use separable variables",
      body: "Put all y terms with dy and all x terms with dx, integrate both sides, then apply any initial condition.",
      branches: [["Back to start", "start"], ["Compare with linear", "linear"]]
    },
    linear: {
      title: "Use the linear integrating-factor method",
      body: "Force y' + P(x)y = f(x), compute mu(x)=e^(int P dx), multiply, then integrate d/dx[mu y].",
      branches: [["Back to start", "start"], ["Could it be Bernoulli?", "bernoulli"]]
    },
    exactCheck: {
      title: "Check exactness",
      body: "For M dx + N dy = 0, compute M_y and N_x. If they match, find f(x,y)=C.",
      branches: [
        ["M_y = N_x", "exact"],
        ["M_y != N_x", "integratingFactor"],
        ["Back to start", "start"]
      ]
    },
    exact: {
      title: "Use exact equation method",
      body: "Integrate M with respect to x, add g(y), differentiate with respect to y, match N, and solve for g.",
      branches: [["Back to start", "start"]]
    },
    integratingFactor: {
      title: "Try an integrating factor",
      body: "If (N_x-M_y)/M depends only on y, use mu(y). If (M_y-N_x)/N depends only on x, use mu(x).",
      branches: [["Then solve as exact", "exact"], ["Back to start", "start"]]
    },
    bernoulli: {
      title: "Use Bernoulli substitution",
      body: "If n is not 0 or 1, let u=y^(1-n). The equation becomes linear in u.",
      branches: [["Back to start", "start"], ["Linear method after substitution", "linear"]]
    }
  };

  function renderDecisionTree(root) {
    let active = "start";

    function draw() {
      const node = nodes[active];
      root.innerHTML = `
        <div class="card">
          <span class="eyebrow">Interactive method finder</span>
          <h2 class="topic-title">ODE Decision Tree</h2>
          <p class="prose">Use this before solving first-order exam problems. The goal is to identify the method before doing algebra.</p>
        </div>
        <div class="decision-tree">
          <div class="tree-node active">
            <h3>${node.title}</h3>
            <p class="prose">${node.body}</p>
            <div class="tree-branches">
              ${node.branches.map(([label, target]) => `<button class="tree-branch" data-target="${target}">${label}</button>`).join("")}
            </div>
          </div>
        </div>
      `;

      root.querySelectorAll("[data-target]").forEach((button) => {
        button.addEventListener("click", () => {
          active = button.dataset.target;
          draw();
          window.ODEMath.renderMath(root);
        });
      });
    }

    draw();
  }

  window.ODEDecisionTree = { renderDecisionTree };
})();
