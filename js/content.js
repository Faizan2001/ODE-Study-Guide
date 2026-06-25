(function () {
  const m = String.raw;

  function step(math, why) {
    return { math, why };
  }

  function ex(title, problem, steps, takeaway, source, provenance = null) {
    return { title, problem, steps, takeaway, source, provenance };
  }

  function pr(title, problem, hint, steps, method, provenance = null) {
    return { title, problem, hint, steps, method, provenance };
  }

  const diffRefresherExamples = [
    ex("Power rule refresher", m`Differentiate\quad y=3x^4-5x^2+7`, [
      step(m`\frac{d}{dx}(3x^4)-\frac{d}{dx}(5x^2)+\frac{d}{dx}(7)`, "Differentiate each term separately."),
      step(m`12x^3-10x+0`, "Bring the exponent down, reduce it by one, and constants disappear."),
      step(m`y'=12x^3-10x`, "This is the rate of change of the original function.")
    ], "Differentiation asks: how fast is this changing right now?", "Module 0 scaffold"),
    ex("Product rule", m`Differentiate\quad y=x^2e^x`, [
      step(m`u=x^2,\quad v=e^x`, "A product needs the product rule."),
      step(m`y'=u'v+uv'`, "The derivative hits each factor once."),
      step(m`y'=2xe^x+x^2e^x=e^x(x^2+2x)`, "Factor the common exponential if it makes the answer cleaner.")
    ], "If two changing quantities are multiplied, both changes matter.", "Module 0 scaffold"),
    ex("Chain rule", m`Differentiate\quad y=\sin(5x^2)`, [
      step(m`outer=\sin(u),\quad inner=u=5x^2`, "Identify the outside function and the inside function."),
      step(m`y'=\cos(5x^2)\cdot 10x`, "Differentiate the outside, keep the inside, then multiply by the derivative of the inside."),
      step(m`y'=10x\cos(5x^2)`, "This pattern appears constantly in u-substitution and ODE verification.")
    ], "Chain rule is the reverse mental move behind substitution.", "Module 0 scaffold")
  ];

  const intRefresherExamples = [
    ex("Basic integration as reverse differentiation", m`Evaluate\quad \int (6x^2-4)\,dx`, [
      step(m`\int 6x^2\,dx-\int 4\,dx`, "Integrate term-by-term."),
      step(m`6\cdot \frac{x^3}{3}-4x+C`, "Raise the power by one and divide by the new power."),
      step(m`2x^3-4x+C`, "Always include the constant for indefinite integrals.")
    ], "Integration accumulates a rate into a total.", "Module 0 scaffold"),
    ex("u-substitution", m`Evaluate\quad \int 2x e^{x^2}\,dx`, [
      step(m`u=x^2,\quad du=2x\,dx`, "Choose the inside function whose derivative is already present."),
      step(m`\int 2x e^{x^2}\,dx=\int e^u\,du`, "Replace both the inside expression and the differential piece."),
      step(m`e^u+C=e^{x^2}+C`, "Substitute back to the original variable.")
    ], "When you see a function and its derivative beside it, try u-substitution.", "Module 0 scaffold")
  ];

  const byPartsExamples = [
    ex("Example 1: integration by parts", m`Evaluate\quad \int x\cos x\,dx`, [
      step(m`u=x,\quad dv=\cos x\,dx`, "LIATE chooses algebraic x before trig cos x."),
      step(m`du=dx,\quad v=\sin x`, "Differentiate u and integrate dv."),
      step(m`\int x\cos x\,dx=x\sin x-\int \sin x\,dx`, "Apply the by-parts formula."),
      step(m`x\sin x-(-\cos x)+C=x\sin x+\cos x+C`, "Finish the remaining simple integral.")
    ], "Pick u so it gets simpler after differentiating.", "Chapter 7.2"),
    ex("Example 2: integration by parts", m`Evaluate\quad \int xe^x\,dx`, [
      step(m`u=x,\quad dv=e^x\,dx`, "LIATE chooses algebraic x before exponential e^x."),
      step(m`du=dx,\quad v=e^x`, "Differentiate u and integrate dv."),
      step(m`\int u\,dv=uv-\int v\,du`, "Use the integration by parts formula."),
      step(m`\int xe^x\,dx=xe^x-\int e^x\,dx`, "Substitute u, v, du."),
      step(m`xe^x-e^x+C=e^x(x-1)+C`, "Finish the remaining simple integral.")
    ], "Pick u so it gets simpler after differentiating.", "Chapter 7.2"),
    ex("Example 3: logarithm by parts", m`Evaluate\quad \int \ln x\,dx`, [
      step(m`u=\ln x,\quad dv=dx`, "A lone logarithm is handled by pairing it with dx."),
      step(m`du=\frac{1}{x}\,dx,\quad v=x`, "The derivative of ln x simplifies."),
      step(m`\int \ln x\,dx=x\ln x-\int x\cdot \frac{1}{x}\,dx`, "Apply by parts."),
      step(m`x\ln x-\int 1\,dx=x\ln x-x+C`, "The remaining integral is basic.")
    ], "For ln x, by parts creates the integral of 1.", "Chapter 7.2"),
    ex("Example 4: repeated integration by parts", m`Evaluate\quad \int x^2e^{-x}\,dx`, [
      step(m`u=x^2,\quad dv=e^{-x}\,dx`, "The polynomial should be differentiated until it vanishes."),
      step(m`du=2x\,dx,\quad v=-e^{-x}`, "Integrating e^{-x} introduces a negative sign."),
      step(m`I=-x^2e^{-x}+2\int xe^{-x}\,dx`, "Call the leftover integral I_1 if you want to track it."),
      step(m`I_1=\int xe^{-x}\,dx=-xe^{-x}-e^{-x}+C`, "Apply by parts again with u=x."),
      step(m`I=-x^2e^{-x}+2(-xe^{-x}-e^{-x})+C`, "Substitute I_1 back."),
      step(m`I=-e^{-x}(x^2+2x+2)+C`, "Factor for a clean final answer.")
    ], "Repeated by parts is just systematic shrinking of the algebraic part.", "Chapter 7.2"),
    ex("Example 5: cyclic integration by parts", m`Evaluate\quad I=\int e^x\cos x\,dx`, [
      step(m`u=\cos x,\quad dv=e^x\,dx`, "Either trig choice works; the cycle will return to I."),
      step(m`I=e^x\cos x+\int e^x\sin x\,dx`, "Because du=-sin x dx, the minus signs combine."),
      step(m`I_1=\int e^x\sin x\,dx=e^x\sin x-\int e^x\cos x\,dx`, "Apply by parts again."),
      step(m`I=e^x\cos x+e^x\sin x-I`, "The original integral reappears."),
      step(m`2I=e^x(\sin x+\cos x)`, "Move I to the left."),
      step(m`I=\frac{e^x}{2}(\sin x+\cos x)+C`, "Divide by 2.")
    ], "When the original integral comes back, solve algebraically for it.", "Chapter 7.2"),
    ex("Example 6: inverse tangent", m`Evaluate\quad \int \tan^{-1}x\,dx`, [
      step(m`u=\tan^{-1}x,\quad dv=dx`, "Inverse trigonometric functions come first under LIATE."),
      step(m`du=\frac{1}{1+x^2}\,dx,\quad v=x`, "Differentiate inverse tangent and integrate dx."),
      step(m`\int \tan^{-1}x\,dx=x\tan^{-1}x-\int\frac{x}{1+x^2}\,dx`, "Apply integration by parts."),
      step(m`\int\frac{x}{1+x^2}\,dx=\frac12\ln(1+x^2)`, "Use u = 1 + x squared; the denominator is always positive."),
      step(m`x\tan^{-1}x-\frac12\ln(1+x^2)+C`, "Combine the boundary-free antiderivative terms.")
    ], "Differentiate the result to check that it returns inverse tangent.", "Chapter 7.2", {
      pdf: "Chapter 7.pdf",
      page: 4,
      section: "7.2",
      label: "Example 6",
      type: "pdf-example",
      status: "verified"
    }),
    ex("Example 8: cosine reduction formula", m`Evaluate\quad \int \cos^4x\,dx`, [
      step(m`\int\cos^4x\,dx = \frac{1}{4}\cos^3x\sin x + \frac{3}{4}\int\cos^2x\,dx`, "Apply the cosine reduction formula with n=4."),
      step(m`\int\cos^2x\,dx = \frac{1}{2}\cos x\sin x + \frac{1}{2}\int dx`, "Apply the cosine reduction formula again with n=2."),
      step(m`\frac{1}{4}\cos^3x\sin x + \frac{3}{4}\left(\frac{1}{2}\cos x\sin x + \frac{1}{2}x\right) + C`, "Integrate dx to x."),
      step(m`\frac{1}{4}\cos^3x\sin x + \frac{3}{8}\cos x\sin x + \frac{3}{8}x + C`, "Expand and simplify coefficients.")
    ], "Trig reduction formulas systematically shrink powers.", "Chapter 7.2")
  ];

  const trigExamples = [
    ex("Example 1: volume of revolution", m`Region\ under\ y=\sin^2x,\ 0\le x\le\pi,\ revolved\ about\ x-axis`, [
      step(m`V=\pi\int_0^\pi y^2\,dx=\pi\int_0^\pi \sin^4x\,dx`, "Disk method squares the radius y."),
      step(m`\sin^2x=\frac{1-\cos2x}{2}`, "Use half-angle for even powers."),
      step(m`\sin^4x=\frac{3}{8}-\frac{1}{2}\cos2x+\frac{1}{8}\cos4x`, "Square and simplify."),
      step(m`\int_0^\pi\sin^4x\,dx=\left[\frac{3x}{8}-\frac{\sin2x}{4}+\frac{\sin4x}{32}\right]_0^\pi`, "Integrate the simplified expression."),
      step(m`V=\pi\cdot\frac{3\pi}{8}=\frac{3\pi^2}{8}`, "Volume is positive and scaled by pi.")
    ], "Volumes often turn trig integrals into power-reduction problems.", "Chapter 7.3"),
    ex("Example 2(a): odd cosine power", m`Evaluate\quad \int \sin^4x\cos^5x\,dx`, [
      step(m`\cos^5x=\cos^4x\cos x=(1-\sin^2x)^2\cos x`, "Save one cosine for du and convert the rest."),
      step(m`u=\sin x,\quad du=\cos x\,dx`, "The saved cosine becomes du."),
      step(m`\int u^4(1-u^2)^2\,du`, "Now it is a polynomial integral."),
      step(m`\int (u^4-2u^6+u^8)\,du`, "Expand."),
      step(m`\frac{u^5}{5}-\frac{2u^7}{7}+\frac{u^9}{9}+C`, "Integrate powers."),
      step(m`\frac{\sin^5x}{5}-\frac{2\sin^7x}{7}+\frac{\sin^9x}{9}+C`, "Substitute back.")
    ], "Odd power: save one factor, convert the rest.", "Chapter 7.3"),
    ex("Example 2(b): both even", m`Evaluate\quad \int \sin^4x\cos^4x\,dx`, [
      step(m`\sin^4x\cos^4x=(\sin x\cos x)^4`, "Pair sine and cosine."),
      step(m`\sin x\cos x=\frac{1}{2}\sin2x`, "Use the double-angle identity."),
      step(m`\int \sin^4x\cos^4x\,dx=\frac{1}{16}\int \sin^4 2x\,dx`, "Pull out the constant."),
      step(m`\sin^4u=\frac{3}{8}-\frac{1}{2}\cos2u+\frac{1}{8}\cos4u`, "Use the fourth-power identity."),
      step(m`\frac{1}{16}\int\left(\frac{3}{8}-\frac{1}{2}\cos4x+\frac{1}{8}\cos8x\right)\,dx`, "Here u=2x."),
      step(m`\frac{3x}{128}-\frac{\sin4x}{128}+\frac{\sin8x}{1024}+C`, "Integrate each term.")
    ], "Both even usually means power-reduction identities.", "Chapter 7.3"),
    ex("Example 3: product-to-sum", m`Evaluate\quad \int \sin7x\cos3x\,dx`, [
      step(m`\sin A\cos B=\frac{1}{2}[\sin(A+B)+\sin(A-B)]`, "Products of different trig angles use product-to-sum."),
      step(m`\sin7x\cos3x=\frac{1}{2}(\sin10x+\sin4x)`, "Substitute A=7x and B=3x."),
      step(m`\frac{1}{2}\int(\sin10x+\sin4x)\,dx`, "Split the integral."),
      step(m`-\frac{\cos10x}{20}-\frac{\cos4x}{8}+C`, "Remember the chain factor when integrating sin(kx).")
    ], "Product-to-sum turns a product into two basic trig integrals.", "Chapter 7.3"),
    ex("Example 4(a): even secant", m`Evaluate\quad \int \tan^2x\sec^4x\,dx`, [
      step(m`\sec^4x=\sec^2x\sec^2x`, "Save one sec^2 x for du."),
      step(m`\sec^2x=1+\tan^2x`, "Convert the extra secant factor."),
      step(m`u=\tan x,\quad du=\sec^2x\,dx`, "Now substitute."),
      step(m`\int u^2(1+u^2)\,du`, "Polynomial in u."),
      step(m`\frac{u^3}{3}+\frac{u^5}{5}+C=\frac{\tan^3x}{3}+\frac{\tan^5x}{5}+C`, "Final answer.")
    ], "Even secant power: save sec^2, convert the rest to tangent.", "Chapter 7.3"),
    ex("Example 4(b): odd tangent and secant", m`Evaluate\quad \int \tan^3x\sec^3x\,dx`, [
      step(m`\tan^3x\sec^3x\,dx=\tan^2x\sec^2x(\sec x\tan x\,dx)`, "Save the derivative pair for sec x."),
      step(m`u=\sec x,\quad du=\sec x\tan x\,dx`, "Substitute using the saved pair."),
      step(m`\tan^2x=u^2-1,\quad \sec^2x=u^2`, "Convert the remaining factors to u."),
      step(m`\int (u^2-1)u^2\,du=\int(u^4-u^2)\,du`, "Now it is a polynomial."),
      step(m`\frac{u^5}{5}-\frac{u^3}{3}+C=\frac{\sec^5x}{5}-\frac{\sec^3x}{3}+C`, "Substitute back.")
    ], "Odd tangent and odd secant can use the saved sec x tan x pair.", "Chapter 7.3"),
    ex("Example 4(c): tan squared secant", m`Evaluate\quad \int \tan^2x\sec x\,dx`, [
      step(m`\tan^2x=\sec^2x-1`, "Rewrite in secants."),
      step(m`\int\tan^2x\sec x\,dx=\int(\sec^3x-\sec x)\,dx`, "Split into known secant integrals."),
      step(m`\int\sec^3x\,dx=\frac12\sec x\tan x+\frac12\ln|\sec x+\tan x|`, "Use the standard secant-cubed formula."),
      step(m`\int\sec x\,dx=\ln|\sec x+\tan x|`, "Use the standard secant formula."),
      step(m`\frac12\sec x\tan x-\frac12\ln|\sec x+\tan x|+C`, "Combine terms.")
    ], "Rewrite tan squared before using secant formulas.", "Chapter 7.3")
  ];

  const trigSubExamples = [
    ex("Example 1: trig substitution", m`Evaluate\quad \int\frac{dx}{x^2\sqrt{4-x^2}}`, [
      step(m`x=2\sin\theta,\quad dx=2\cos\theta\,d\theta`, "Because sqrt(4-x^2) matches sqrt(a^2-x^2)."),
      step(m`\sqrt{4-x^2}=\sqrt{4-4\sin^2\theta}=2\cos\theta`, "Use 1-sin^2 theta = cos^2 theta."),
      step(m`\int\frac{2\cos\theta\,d\theta}{4\sin^2\theta\cdot 2\cos\theta}=\frac{1}{4}\int\csc^2\theta\,d\theta`, "Substitute and simplify."),
      step(m`-\frac{1}{4}\cot\theta+C`, "Integral of csc^2 theta is -cot theta."),
      step(m`\cot\theta=\frac{\sqrt{4-x^2}}{x}`, "Draw the triangle from x=2 sin theta."),
      step(m`-\frac{\sqrt{4-x^2}}{4x}+C`, "Back-substitute.")
    ], "The trig substitution is chosen by the radical shape.", "Chapter 7.4"),
    ex("Example 2: definite trig substitution", m`Evaluate\quad \int_1^{\sqrt2}\frac{dx}{x^2\sqrt{4-x^2}}`, [
      step(m`Use\ the\ antiderivative\ -\frac{\sqrt{4-x^2}}{4x}`, "Reuse Example 1 rather than repeating all work."),
      step(m`\left[-\frac{\sqrt{4-x^2}}{4x}\right]_1^{\sqrt2}`, "Apply the bounds."),
      step(m`-\frac{\sqrt2}{4\sqrt2}-\left(-\frac{\sqrt3}{4}\right)`, "Evaluate at x=sqrt2 and x=1."),
      step(m`\frac{\sqrt3-1}{4}`, "Simplify.")
    ], "For definite integrals, using the x-antiderivative avoids converting bounds.", "Chapter 7.4"),
    ex("Example 3: area of an ellipse", m`Find\ the\ area\ of\ the\ ellipse\ \frac{x^2}{a^2}+\frac{y^2}{b^2}=1`, [
      step(m`y = \pm \frac{b}{a}\sqrt{a^2-x^2}`, "Solve for y. By symmetry, the total area A is four times the area in the first quadrant."),
      step(m`A = \frac{4b}{a}\int_0^a \sqrt{a^2-x^2}\,dx`, "Set up the integral for the total area."),
      step(m`x=a\sin\theta,\ dx=a\cos\theta\,d\theta`, "Substitute x = a sin theta. Limit bounds change: x=0 -> theta=0, x=a -> theta=pi/2."),
      step(m`\int_0^a \sqrt{a^2-x^2}\,dx = a^2\int_0^{\pi/2}\cos^2\theta\,d\theta`, "Simplify the radical to a cos theta."),
      step(m`A = \frac{4b}{a}\cdot a^2\int_0^{\pi/2}\frac{1+\cos2\theta}{2}\,d\theta = 2ab\left[\theta+\frac{\sin2\theta}{2}\right]_0^{\pi/2}`, "Use the half-angle identity to integrate."),
      step(m`2ab\left(\frac{\pi}{2}\right) = \pi ab`, "Substitute limits to obtain the final area formula.")
    ], "Ellipse area scales circle area by scaling factors a and b.", "Chapter 7.4"),
    ex("Example 4: arc length via trig substitution", m`Find\ the\ arc\ length\ of\ y=\frac{x^2}{2},\ x=0\ to\ x=1`, [
      step(m`y'=x,\quad L=\int_0^1\sqrt{1+x^2}\,dx`, "Arc length formula: L = ∫√(1+(dy/dx)²) dx."),
      step(m`x=\tan\theta,\quad dx=\sec^2\theta\,d\theta`, "√(1+x²) matches √(a²+x²) with a=1."),
      step(m`\sqrt{1+\tan^2\theta}=\sec\theta`, "Use 1+tan²θ = sec²θ."),
      step(m`x=0:\theta=0,\quad x=1:\theta=\pi/4`, "Convert x-limits to θ-limits."),
      step(m`L=\int_0^{\pi/4}\sec^3\theta\,d\theta`, "The integral reduces to sec³θ."),
      step(m`\int\sec^3\theta\,d\theta=\frac12\sec\theta\tan\theta+\frac12\ln|\sec\theta+\tan\theta|`, "Use the standard sec³ formula (from §7.3)."),
      step(m`L=\frac12\left[\sqrt{2}+\ln(\sqrt{2}+1)\right]\approx1.148`, "Evaluate at π/4 and 0.")
    ], "Arc length problems often lead to trig substitution integrals.", "Chapter 7.4"),
    ex("Example 5: secant substitution", m`Evaluate\quad \int\frac{\sqrt{x^2-25}}{x}\,dx,\ assuming\ x\ge5`, [
      step(m`x=5\sec\theta,\quad dx=5\sec\theta\tan\theta\,d\theta`, "√(x²−25) matches √(x²−a²) with a=5."),
      step(m`\sqrt{x^2-25}=\sqrt{25\sec^2\theta-25}=5\tan\theta`, "Use sec²θ−1 = tan²θ."),
      step(m`\int\frac{5\tan\theta}{5\sec\theta}\cdot5\sec\theta\tan\theta\,d\theta=5\int\tan^2\theta\,d\theta`, "Substitute and simplify."),
      step(m`5\int(\sec^2\theta-1)\,d\theta=5\tan\theta-5\theta+C`, "Convert tan²θ."),
      step(m`\tan\theta=\frac{\sqrt{x^2-25}}{5},\quad \theta=\sec^{-1}\left(\frac{x}{5}\right)`, "Back-substitute using the triangle."),
      step(m`\sqrt{x^2-25}-5\sec^{-1}\left(\frac{x}{5}\right)+C`, "Final answer.")
    ], "For sec substitutions, inverse sec often appears in the final answer.", "Chapter 7.4"),
    ex("Example 5 (printed label repeated): completing the square", m`Evaluate\quad \int\frac{x}{x^2-4x+8}\,dx`, [
      step(m`x^2-4x+8 = (x-2)^2+4`, "Complete the square in the denominator."),
      step(m`u=x-2,\ du=dx,\ x=u+2`, "Substitute u = x-2."),
      step(m`\int\frac{u+2}{u^2+4}\,du = \int\frac{u}{u^2+4}\,du + 2\int\frac{du}{u^2+4}`, "Split into logarithmic and inverse-tangent forms."),
      step(m`\frac{1}{2}\ln(u^2+4)`, "The numerator u is one half of the denominator's derivative."),
      step(m`\tan^{-1}\left(\frac{u}{2}\right)`, "Use the standard integral of 1 over u squared plus a squared."),
      step(m`\frac{1}{2}\ln[(x-2)^2+4] + \tan^{-1}\left(\frac{x-2}{2}\right) + C`, "Combine results and back-substitute.")
    ], "The PDF prints this as a second Example 5; the app preserves that source defect explicitly.", "Chapter 7.4", {
      pdf: "Chapter 7.pdf",
      page: 24,
      section: "7.4",
      label: "Example 5 (second occurrence)",
      type: "pdf-example",
      status: "verified",
      note: "The PDF repeats the label Example 5 on pages 23 and 24."
    })
  ];

  const partialFractionExamples = [
    ex("Introductory Example: rational decomposition", m`Evaluate\quad \int\frac{5x-10}{x^2-3x-4}\,dx`, [
      step(m`\frac{5x-10}{x^2-3x-4}=\frac{5x-10}{(x-4)(x+1)} = \frac{A}{x-4}+\frac{B}{x+1}`, "Factor denominator and set up decomposition."),
      step(m`5x-10 = A(x+1)+B(x-4)`, "Clear denominators."),
      step(m`x=4:\ 10=5A\Rightarrow A=2;\quad x=-1:\ -15=-5B\Rightarrow B=3`, "Solve for coefficients A and B."),
      step(m`\int\left(\frac{2}{x-4}+\frac{3}{x+1}\right)dx`, "Rewrite the integral."),
      step(m`2\ln|x-4|+3\ln|x+1|+C`, "Integrate term-by-term.")
    ], "Basic decomposition breaks rational terms into log integrals.", "Chapter 7.5"),
    ex("Example 1: distinct linear factors", m`Evaluate\quad \int\frac{dx}{x^2+x-2}`, [
      step(m`\frac{1}{x^2+x-2}=\frac{1}{(x-1)(x+2)}`, "Factor the denominator."),
      step(m`\frac{1}{(x-1)(x+2)}=\frac{A}{x-1}+\frac{B}{x+2}`, "One constant over each distinct linear factor."),
      step(m`1=A(x+2)+B(x-1)`, "Multiply by the common denominator."),
      step(m`x=1:\ 1=3A\Rightarrow A=\frac13;\quad x=-2:\ 1=-3B\Rightarrow B=-\frac13`, "Cover-up values are fastest."),
      step(m`\int\frac{dx}{(x-1)(x+2)}=\frac13\int\frac{dx}{x-1}-\frac13\int\frac{dx}{x+2}`, "Split into simple fractions."),
      step(m`\frac13\ln|x-1|-\frac13\ln|x+2|+C=\frac13\ln\left|\frac{x-1}{x+2}\right|+C`, "Integrate and combine logs.")
    ], "Partial fractions reverse the common-denominator process.", "Chapter 7.5"),
    ex("Example 2: repeated linear factor", m`Evaluate\quad \int\frac{2x+4}{x^3-2x^2}\,dx`, [
      step(m`x^3-2x^2=x^2(x-2)`, "Factor the denominator."),
      step(m`\frac{2x+4}{x^2(x-2)}=\frac{A}{x}+\frac{B}{x^2}+\frac{C}{x-2}`, "Repeated factor x² needs both x and x²."),
      step(m`2x+4=Ax(x-2)+B(x-2)+Cx^2`, "Clear denominators."),
      step(m`x=0:\ 4=-2B\Rightarrow B=-2;\quad x=2:\ 8=4C\Rightarrow C=2`, "Use convenient roots."),
      step(m`Coefficient\ of\ x^2:\ A+C=0\Rightarrow A=-2`, "Match x² coefficients."),
      step(m`\int\left(\frac{-2}{x}+\frac{-2}{x^2}+\frac{2}{x-2}\right)dx`, "Integrate each piece."),
      step(m`-2\ln|x|+\frac{2}{x}+2\ln|x-2|+C=2\ln\left|\frac{x-2}{x}\right|+\frac{2}{x}+C`, "Combine logs for a clean answer.")
    ], "Repeated factors produce a ladder of terms.", "Chapter 7.5"),
    ex("Example 3: irreducible quadratic factor", m`Evaluate\quad \int\frac{x^2+x-2}{3x^3-x^2+3x-1}\,dx`, [
      step(m`3x^3-x^2+3x-1=(3x-1)(x^2+1)`, "Factor the denominator."),
      step(m`\frac{x^2+x-2}{(3x-1)(x^2+1)}=\frac{A}{3x-1}+\frac{Bx+C}{x^2+1}`, "Irreducible quadratic gets a linear numerator."),
      step(m`x^2+x-2=A(x^2+1)+(Bx+C)(3x-1)`, "Clear denominators."),
      step(m`x^2+x-2=(A+3B)x^2+(-B+3C)x+(A-C)`, "Collect powers."),
      step(m`A+3B=1,\quad -B+3C=1,\quad A-C=-2`, "System of equations."),
      step(m`A=-\frac{7}{5},\quad B=\frac{4}{5},\quad C=\frac{3}{5}`, "Solve the system."),
      step(m`-\frac{7}{15}\ln|3x-1|+\frac{2}{5}\ln(x^2+1)+\frac{3}{5}\tan^{-1}x+C`, "Integrate each piece.")
    ], "Irreducible quadratics always get linear numerators.", "Chapter 7.5"),
    ex("Example 5: improper rational function", m`Evaluate\quad \int\frac{3x^4+3x^3-5x^2+x-1}{x^2+x-2}\,dx`, [
      step(m`x^2+x-2\ \Big)\overline{\;3x^4+3x^3-5x^2+x-1\;}`, "Degree of numerator > denominator, so do long division."),
      step(m`\frac{3x^4+3x^3-5x^2+x-1}{x^2+x-2}=(3x^2+1)+\frac{1}{x^2+x-2}`, "Quotient 3x²+1, remainder 1."),
      step(m`\frac{1}{x^2+x-2}=\frac{1}{(x-1)(x+2)}=\frac{1/3}{x-1}-\frac{1/3}{x+2}`, "Decompose the remainder (same as Example 1)."),
      step(m`\int(3x^2+1)\,dx+\frac13\int\frac{dx}{x-1}-\frac13\int\frac{dx}{x+2}`, "Integrate each piece."),
      step(m`x^3+x+\frac13\ln\left|\frac{x-1}{x+2}\right|+C`, "Combine for the final answer.")
    ], "Improper rational integrals always start with long division.", "Chapter 7.5")
  ];

  function markSourceExamples(examples, pdf, section, references) {
    examples.forEach((example) => {
      const reference = references[example.title];
      if (!reference) {
        throw new Error(`Missing source provenance for ${section}: ${example.title}`);
      }
      example.provenance = {
        pdf,
        section,
        type: "pdf-example",
        status: "verified",
        ...reference
      };
    });
  }

  function markPdfExamples(examples, section, references) {
    markSourceExamples(examples, "Chapter 7.pdf", section, references);
  }

  markPdfExamples(byPartsExamples, "7.2", {
    "Example 1: integration by parts": { page: 1, label: "Example 1" },
    "Example 2: integration by parts": { page: 2, label: "Example 2" },
    "Example 3: logarithm by parts": { page: 2, label: "Example 3" },
    "Example 4: repeated integration by parts": { page: 2, pages: [2, 3], label: "Example 4" },
    "Example 5: cyclic integration by parts": { page: 3, pages: [3, 4], label: "Example 5" },
    "Example 6: inverse tangent": {
      page: 4,
      pages: [4, 5],
      label: "Example 6",
      note: "The printed problem is indefinite, but the PDF solution on the next page silently inserts bounds 0 and 1. The primary solution follows the printed problem; the bounded variant is shown here only as a source note.",
      definiteVariant: m`\frac{\pi}{4}-\frac12\ln2`
    },
    "Example 8: cosine reduction formula": { page: 6, label: "Example 8" }
  });

  markPdfExamples(trigExamples, "7.3", {
    "Example 1: volume of revolution": { page: 11, label: "Example 1" },
    "Example 2(a): odd cosine power": { page: 12, label: "Example 2(a)" },
    "Example 2(b): both even": { page: 12, pages: [12, 13], label: "Example 2(b)" },
    "Example 3: product-to-sum": { page: 13, label: "Example 3" },
    "Example 4(a): even secant": { page: 15, label: "Example 4(a)" },
    "Example 4(b): odd tangent and secant": { page: 16, label: "Example 4(b)" },
    "Example 4(c): tan squared secant": { page: 16, label: "Example 4(c)" }
  });

  markPdfExamples(trigSubExamples, "7.4", {
    "Example 1: trig substitution": { page: 19, pages: [19, 20], label: "Example 1" },
    "Example 2: definite trig substitution": { page: 20, label: "Example 2" },
    "Example 3: area of an ellipse": {
      page: 21,
      label: "Example 3 (H.W.)",
      note: "The PDF assigns this example as homework and prints the prompt without a worked solution; the app's derivation was independently verified."
    },
    "Example 4: arc length via trig substitution": { page: 21, pages: [21, 22], label: "Example 4" },
    "Example 5: secant substitution": { page: 23, label: "Example 5 (first occurrence)" },
    "Example 5 (printed label repeated): completing the square": {
      page: 24,
      label: "Example 5 (second occurrence)",
      note: "The PDF repeats the label Example 5 on pages 23 and 24."
    }
  });

  markPdfExamples(partialFractionExamples, "7.5", {
    "Introductory Example: rational decomposition": {
      page: 26,
      pages: [26, 27],
      label: "Introductory decomposition",
      type: "pdf-theory"
    },
    "Example 1: distinct linear factors": { page: 27, label: "Example 1" },
    "Example 2: repeated linear factor": { page: 28, label: "Example 2" },
    "Example 3: irreducible quadratic factor": { page: 28, pages: [28, 29], label: "Example 3" },
    "Example 5: improper rational function": { page: 29, label: "Example 5" }
  });

  const odeIntroExamples = [
    ex("Example 1(a): verify explicit solution", m`\frac{dy}{dx}=xy^{1/2},\quad y=\frac{x^4}{16}`, [
      step(m`y'=\frac{4x^3}{16}=\frac{x^3}{4}`, "Differentiate y."),
      step(m`xy^{1/2}=x\left(\frac{x^4}{16}\right)^{1/2}=x\cdot\frac{x^2}{4}=\frac{x^3}{4}`, "Compute the right side."),
      step(m`y'=xy^{1/2}`, "Both sides match, so it is a solution where the square root expression is valid.")
    ], "Verification means substitute and check equality.", "Chapter 1.1"),
    ex("Example 1(b): verify second-order solution", m`y''-2y'+y=0,\quad y=xe^x`, [
      step(m`y'=e^x+xe^x=e^x(1+x)`, "Use product rule."),
      step(m`y''=e^x(1+x)+e^x=e^x(x+2)`, "Differentiate again."),
      step(m`y''-2y'+y=e^x(x+2)-2e^x(x+1)+xe^x`, "Substitute."),
      step(m`e^x[(x+2)-2x-2+x]=0`, "Simplify to zero.")
    ], "For higher order verification, carefully compute every derivative first.", "Chapter 1.1"),
    ex("Example 2: implicit verification", m`x^2+y^2=25,\quad \frac{dy}{dx}=-\frac{x}{y}`, [
      step(m`\frac{d}{dx}(x^2+y^2)=\frac{d}{dx}(25)`, "Differentiate both sides."),
      step(m`2x+2y\frac{dy}{dx}=0`, "Use implicit differentiation on y^2."),
      step(m`2y\frac{dy}{dx}=-2x`, "Solve for y'."),
      step(m`\frac{dy}{dx}=-\frac{x}{y}`, "This matches the DE.")
    ], "Implicit solutions are checked by implicit differentiation.", "Chapter 1.1"),
    ex("Exercise 1: order and linearity", m`(1-x)y''-4xy'+5y=\cos x`, [
      step(m`Highest derivative is y''`, "Order is determined by the highest derivative present."),
      step(m`y'', y', y\ appear\ to\ first\ power`, "Linearity allows no products or powers of y and its derivatives."),
      step(m`Order=2,\quad linear`, "Coefficients depend only on x.")
    ], "Linearity is about y and its derivatives, not about x.", "Chapter 1.1"),
    ex("Exercise 2: order and nonlinearity", m`x\frac{d^3y}{dx^3}-\left(\frac{dy}{dx}\right)^4+y=0`, [
      step(m`Highest derivative is \frac{d^3y}{dx^3}`, "So the order is three."),
      step(m`\left(\frac{dy}{dx}\right)^4\ appears`, "A derivative raised to a power makes the equation nonlinear."),
      step(m`Order=3,\quad nonlinear`, "The fourth power violates linearity.")
    ], "A single nonlinear term makes the whole DE nonlinear.", "Chapter 1.1"),
    ex("Exercise 11: verify first-order solution", m`2y+y'=0,\quad y=e^{-x/2}`, [
      step(m`y'=-\frac12e^{-x/2}`, "Differentiate the exponential."),
      step(m`2y+y'=2e^{-x/2}-\frac12e^{-x/2}`, "Substitute into the equation."),
      step(m`\frac32e^{-x/2}\ne0`, "As written, this does not satisfy 2y+y'=0; it would satisfy y'+(1/2)y=0."),
      step(m`Check\ your\ PDF/problem\ statement\ before\ exam\ practice`, "This is a likely transcription or source typo.")
    ], "Verification catches copied-sign/coefficient mistakes.", "Chapter 1.1"),
    ex("Exercise 13: verify trig-exponential solution", m`y''-6y'+13y=0,\quad y=e^{3x}\cos2x`, [
      step(m`y'=e^{3x}(3\cos2x-2\sin2x)`, "Product and chain rules."),
      step(m`y''=e^{3x}(5\cos2x-12\sin2x)`, "Differentiate again carefully."),
      step(m`y''-6y'+13y=e^{3x}[(5c-12s)-6(3c-2s)+13c]`, "Use c=cos2x, s=sin2x to simplify."),
      step(m`e^{3x}[(5-18+13)c+(-12+12)s]=0`, "All terms cancel.")
    ], "Exponential-trig verification is algebra-heavy but mechanical.", "Chapter 1.1")
  ];

  const ivpExamples = [
    ex("Example 1: first-order IVP", m`y=ce^x,\quad y'=y`, [
      step(m`y(0)=3\Rightarrow ce^0=3\Rightarrow c=3`, "Initial condition selects one curve from the family."),
      step(m`y=3e^x`, "Particular solution for y(0)=3."),
      step(m`y(1)=-2\Rightarrow ce=-2\Rightarrow c=-2e^{-1}`, "Use the other initial condition."),
      step(m`y=-2e^{x-1}`, "Particular solution for y(1)=-2.")
    ], "A one-parameter family needs one initial condition.", "Chapter 1.2"),
    ex("Example 2: solution interval", m`y=\frac{1}{x^2+c},\quad y(0)=-1`, [
      step(m`-1=\frac{1}{c}\Rightarrow c=-1`, "Apply the initial condition."),
      step(m`y=\frac{1}{x^2-1}`, "Particular solution."),
      step(m`x^2-1=0\Rightarrow x=\pm1`, "The solution is undefined at these points."),
      step(m`I=(-1,1)`, "Choose the largest interval containing x=0 that avoids discontinuities.")
    ], "Solution intervals must contain the initial point and avoid breaks.", "Chapter 1.2"),
    ex("Example 3: second-order IVP", m`x(t)=c_1\cos4t+c_2\sin4t,\quad x''+16x=0`, [
      step(m`x'(t)=-4c_1\sin4t+4c_2\cos4t`, "Differentiate the family."),
      step(m`x(\pi/2)=c_1\cos2\pi+c_2\sin2\pi=c_1=-2`, "First condition gives c1."),
      step(m`x'(\pi/2)=4c_2=1\Rightarrow c_2=\frac14`, "Second condition gives c2."),
      step(m`x(t)=-2\cos4t+\frac14\sin4t`, "Particular solution.")
    ], "An nth-order ODE needs n independent conditions.", "Chapter 1.2")
  ];

  const separableExamples = [
    ex("Introductory example", m`\frac{dy}{dx}=x^2y`, [
      step(m`\frac{1}{y}\,dy=x^2\,dx`, "Move y terms with dy and x terms with dx."),
      step(m`\int\frac{1}{y}\,dy=\int x^2\,dx`, "Integrate both sides."),
      step(m`\ln|y|=\frac{x^3}{3}+\ln C`, "Use ln C as the integration constant for easy exponentiation."),
      step(m`y=Ce^{x^3/3}`, "Exponentiate.")
    ], "Separable means each variable can live on its own side.", "Chapter 2.2"),
    ex("Example 1", m`(1+x)dy-y\,dx=0`, [
      step(m`(1+x)dy=y\,dx`, "Move one term to the other side."),
      step(m`\frac{dy}{y}=\frac{dx}{1+x}`, "Separate variables."),
      step(m`\ln|y|=\ln|1+x|+\ln C`, "Integrate both sides."),
      step(m`y=C(1+x)`, "Exponentiate and absorb signs into C.")
    ], "The constant absorbs plus/minus signs.", "Chapter 2.2"),
    ex("Exercise 1", m`\frac{dy}{dx}=\sin5x`, [
      step(m`dy=\sin5x\,dx`, "Already separated."),
      step(m`y=\int\sin5x\,dx`, "Integrate."),
      step(m`y=-\frac{\cos5x}{5}+C`, "Chain factor 1/5 appears.")
    ], "Even simple integration practice matters in ODEs.", "Chapter 2.2"),
    ex("Exercise 5", m`x\frac{dy}{dx}=4y`, [
      step(m`\frac{dy}{y}=4\frac{dx}{x}`, "Separate variables."),
      step(m`\ln|y|=4\ln|x|+\ln C`, "Integrate."),
      step(m`y=Cx^4`, "Exponentiate.")
    ], "Power-law solutions often come from dy/y = k dx/x.", "Chapter 2.2"),
    ex("Exercise 23: IVP", m`\frac{dx}{dt}=4(x^2+1),\quad x(\pi/4)=1`, [
      step(m`\frac{dx}{1+x^2}=4\,dt`, "Separate variables."),
      step(m`\tan^{-1}x=4t+C`, "Integrate."),
      step(m`\tan^{-1}(1)=\frac{\pi}{4}=4\left(\frac{\pi}{4}\right)+C=\pi+C`, "Use the initial condition t=pi/4."),
      step(m`C=-\frac{3\pi}{4}`, "Solve for C."),
      step(m`x=\tan\left(4t-\frac{3\pi}{4}\right)`, "Invert tangent.")
    ], "Apply the initial condition before solving for x if that is simpler.", "Chapter 2.2"),
    ex("Exercise 25: IVP", m`x^2\frac{dy}{dx}=y-xy,\quad y(-1)=-1`, [
      step(m`x^2\frac{dy}{dx}=y(1-x)`, "Factor y."),
      step(m`\frac{dy}{y}=\left(\frac{1}{x^2}-\frac{1}{x}\right)dx`, "Separate variables."),
      step(m`\ln|y|=-\frac{1}{x}-\ln|x|+\ln C`, "Integrate."),
      step(m`y=\frac{C}{x}e^{-1/x}`, "Exponentiate."),
      step(m`-1=-C e\Rightarrow C=e^{-1}`, "Use y(-1)=-1."),
      step(m`y=\frac{1}{x}e^{-(1/x+1)}`, "Final particular solution."),
      step(m`I=(-\infty,0)`, "The formula is undefined at x=0, so choose the largest interval containing the initial point x=-1.")
    ], "Keep signs organized when x is negative in the initial condition.", "Chapter 2.2")
  ];

  const linearExamples = [
    ex("Exercise 3", m`\frac{dy}{dx}+y=e^{3x}`, [
      step(m`P(x)=1,\quad \mu(x)=e^{\int1\,dx}=e^x`, "Find the integrating factor."),
      step(m`e^xy'+e^xy=e^{4x}`, "Multiply the equation by e^x."),
      step(m`\frac{d}{dx}(e^xy)=e^{4x}`, "Left side becomes a product derivative."),
      step(m`e^xy=\frac14e^{4x}+C`, "Integrate."),
      step(m`y=\frac14e^{3x}+Ce^{-x}`, "Solve for y.")
    ], "The integrating factor is designed to create a product derivative.", "Chapter 2.3"),
    ex("Exercise 9", m`x\frac{dy}{dx}-y=x^2\sin x`, [
      step(m`y'-\frac{1}{x}y=x\sin x`, "Divide by x to get standard form."),
      step(m`P(x)=-\frac{1}{x},\quad \mu=e^{-\ln|x|}=\frac{1}{x}`, "Find the integrating factor."),
      step(m`\frac{d}{dx}\left(\frac{y}{x}\right)=\sin x`, "Multiply by 1/x."),
      step(m`\frac{y}{x}=-\cos x+C`, "Integrate."),
      step(m`y=-x\cos x+Cx`, "Solve for y."),
      step(m`I=(0,\infty)\ in\ the\ PDF`, "The printed work chooses the positive interval; any solution interval must avoid x=0.")
    ], "Always divide into y' + P(x)y = f(x) first.", "Chapter 2.3"),
    ex("Exercise 27: IVP", m`xy'+y=e^x,\quad y(1)=2`, [
      step(m`y'+\frac{1}{x}y=\frac{e^x}{x}`, "Standard form."),
      step(m`\mu=e^{\int 1/x\,dx}=x`, "Assume x>0 because the initial point is x=1."),
      step(m`\frac{d}{dx}(xy)=e^x`, "Multiply by x."),
      step(m`xy=e^x+C`, "Integrate."),
      step(m`2=e+C\Rightarrow C=2-e`, "Use y(1)=2."),
      step(m`y=\frac{e^x}{x}+\frac{2-e}{x}`, "Final solution.")
    ], "The initial point also guides the solution interval.", "Chapter 2.3")
  ];

  const exactExamples = [
    ex("Exercise 3", m`(5x+4y)dx+(4x-8y^3)dy=0`, [
      step(m`M=5x+4y,\quad N=4x-8y^3`, "Identify M and N."),
      step(m`M_y=4,\quad N_x=4`, "Exactness test passes."),
      step(m`f=\int M\,dx=\frac52x^2+4xy+g(y)`, "Integrate M with respect to x."),
      step(m`f_y=4x+g'(y)=4x-8y^3`, "Differentiate with respect to y and match N."),
      step(m`g'(y)=-8y^3\Rightarrow g(y)=-2y^4`, "Integrate g'."),
      step(m`\frac52x^2+4xy-2y^4=C`, "Implicit solution.")
    ], "Exact equations hide a potential function f(x,y).", "Chapter 2.4"),
    ex("Exercise 33: integrating factor", m`6xy\,dx+(4y+9x^2)dy=0`, [
      step(m`M_y=6x,\quad N_x=18x`, "Not exact at first."),
      step(m`\frac{N_x-M_y}{M}=\frac{12x}{6xy}=\frac{2}{y}`, "This depends only on y."),
      step(m`\mu(y)=e^{\int 2/y\,dy}=y^2`, "Find integrating factor."),
      step(m`6xy^3dx+(4y^3+9x^2y^2)dy=0`, "Multiply the equation by y^2."),
      step(m`P_y=18xy^2=Q_x`, "Now exact."),
      step(m`f=\int6xy^3\,dx=3x^2y^3+g(y)`, "Integrate P with respect to x."),
      step(m`f_y=9x^2y^2+g'(y)=4y^3+9x^2y^2`, "Match Q."),
      step(m`g(y)=y^4`, "Integrate g'."),
      step(m`3x^2y^3+y^4=C`, "Implicit solution."),
      step(m`y=0\ is\ also\ included\ when\ C=0`, "The integrating-factor derivation divided by y; check the excluded curve directly in the original equation.")
    ], "Some non-exact equations become exact after multiplying by an integrating factor.", "Chapter 2.4")
  ];

  const bernoulliExamples = [
    ex("Exercise 15", m`x\frac{dy}{dx}+y=\frac{1}{y^2}`, [
      step(m`y'+\frac{1}{x}y=\frac{1}{x}y^{-2}`, "Standard Bernoulli form with n=-2."),
      step(m`u=y^{1-n}=y^3`, "Use Bernoulli substitution."),
      step(m`u'=3y^2y'`, "Differentiate u."),
      step(m`u'+\frac{3}{x}u=\frac{3}{x}`, "Substitute to get a linear equation."),
      step(m`\mu=x^3`, "Integrating factor for P=3/x."),
      step(m`\frac{d}{dx}(ux^3)=3x^2`, "Multiply by x^3."),
      step(m`ux^3=x^3+C\Rightarrow u=1+\frac{C}{x^3}`, "Integrate and solve for u."),
      step(m`y^3=1+\frac{C}{x^3}`, "Back-substitute.")
    ], "Bernoulli turns nonlinear y^n into a linear u-equation.", "Chapter 2.5"),
    ex("Exercise 18", m`x\frac{dy}{dx}-(1+x)y=xy^2`, [
      step(m`y'-\left(\frac1x+1\right)y=y^2`, "Divide by x."),
      step(m`n=2,\quad u=y^{1-2}=\frac1y`, "Bernoulli substitution."),
      step(m`y'=-\frac{u'}{u^2}`, "Differentiate y=1/u."),
      step(m`u'+\left(\frac1x+1\right)u=-1`, "Substitute and simplify."),
      step(m`\mu=e^{\int(1/x+1)dx}=xe^x`, "Integrating factor."),
      step(m`\frac{d}{dx}(uxe^x)=-xe^x`, "Multiply by the integrating factor."),
      step(m`uxe^x=-(xe^x-e^x)+C`, "Integrate by parts for int -x e^x dx."),
      step(m`\frac1y=\frac1x-1+\frac{C}{xe^x}`, "Back-substitute for nonzero solutions."),
      step(m`y=0\ is\ a\ separate\ solution`, "The substitution u=1/y excludes y=0, so test it directly in the original equation.")
    ], "Bernoulli problems often combine substitution plus linear-equation method.", "Chapter 2.5")
  ];

  const linearModelsExamples = [
    ex("Example 1", m`\frac{dp}{dt}=ap,\quad P(0)=P_0,\quad P(1)=\frac32 P_0`, [
      step(m`\frac{dp}{p}=a\,dt \implies \int \frac{dp}{p} = \int a\,dt`, "Separate variables."),
      step(m`\ln p = at + \ln c \implies p(t) = c e^{at}`, "Integrate both sides."),
      step(m`P(0) = c = P_0 \implies P(t) = P_0 e^{at}`, "Apply initial condition at t=0."),
      step(m`P(1) = P_0 e^a = \frac32 P_0 \implies e^a = 1.5`, "Apply given value at t=1."),
      step(m`a = \ln 1.5 \approx 0.4055 \implies P(t) = P_0 e^{0.4055t}`, "Find rate constant a."),
      step(m`P(t) = 3P_0 \implies P_0 e^{0.4055t} = 3P_0 \implies t = \frac{\ln 3}{0.4055} \approx 2.71\text{ h}`, "Solve for tripling time.")
    ], "Malthusian growth assumes growth rate is proportional to population.", "Chapter 3.1"),
    ex("Example 4: Cooling of a Cake", m`\frac{dT}{dt}=a(T-T_m),\quad T_m=70,\quad T(0)=300,\quad T(3)=200`, [
      step(m`\frac{dT}{T-70}=a\,dt \implies \ln(T-70) = at + \ln c`, "Separate variables and integrate."),
      step(m`T(t) = 70 + c e^{at}`, "Solve for T(t)."),
      step(m`T(0) = 70 + c = 300 \implies c = 230`, "Apply initial condition T(0)=300."),
      step(m`T(t) = 70 + 230 e^{at}`, "Write temperature equation."),
      step(m`T(3) = 70 + 230 e^{3a} = 200 \implies e^{3a} = \frac{13}{23}`, "Apply given value at t=3."),
      step(m`a = \frac13 \ln\left(\frac{13}{23}\right) \approx -0.19018`, "Find cooling constant a."),
      step(m`T(t) = 70 + 230 e^{-0.19018t}`, "Write particular solution."),
      step(m`t \to \infty \implies T(t) \to 70^\circ\text{F}`, "As t increases, cake temperature approaches room temperature.")
    ], "Newton's law of cooling: rate of change of temperature is proportional to temperature difference.", "Chapter 3.1"),
    ex("Example 7: Problems on LR Series Circuit", m`L\frac{di}{dt}+Ri=E(t),\quad L=\frac12,\quad R=10,\quad E(t)=12,\quad i(0)=0`, [
      step(m`\frac12\frac{di}{dt}+10i=12 \implies \frac{di}{dt}+20i=24`, "Set up standard linear form. Inductance L = 1/2 henry is corrected from PDF typo."),
      step(m`\mu(t) = e^{\int 20\,dt} = e^{20t}`, "Find integrating factor."),
      step(m`\frac{d}{dt}[i e^{20t}] = 24 e^{20t}`, "Multiply through by integrating factor."),
      step(m`i e^{20t} = \frac{24}{20} e^{20t} + C = 1.2 e^{20t} + C`, "Integrate both sides."),
      step(m`i(t) = 1.2 + C e^{-20t}`, "Solve for general current solution."),
      step(m`i(0) = 1.2 + C = 0 \implies C = -1.2 \implies i(t) = 1.2(1 - e^{-20t})`, "Apply initial condition i(0) = 0.")
    ], "LR series circuits are modeled by a linear first-order differential equation.", "Chapter 3.1")
  ];

  markSourceExamples(linearModelsExamples, "Chapter 3_ODE.pdf", "3.1", {
    "Example 1": { page: 1, label: "Example 1" },
    "Example 4: Cooling of a Cake": { page: 5, label: "Example 4" },
    "Example 7: Problems on LR Series Circuit": {
      page: 10,
      label: "Example 7",
      type: "corrected-pdf-error",
      note: "The PDF omits the inductance value ('inductance is henry'), which we correct to L = 1/2 henry following Dennis G. Zill."
    }
  });


  markSourceExamples(odeIntroExamples, "Chapter 01_ODE_new02.pdf", "1.1", {
    "Example 1(a): verify explicit solution": { page: 4, label: "Example 1(a)" },
    "Example 1(b): verify second-order solution": { page: 4, label: "Example 1(b)" },
    "Example 2: implicit verification": { page: 4, label: "Example 2" },
    "Exercise 1: order and linearity": { page: 5, label: "Exercise 1", type: "pdf-assigned-exercise" },
    "Exercise 2: order and nonlinearity": { page: 5, label: "Exercise 2", type: "pdf-assigned-exercise" },
    "Exercise 11: verify first-order solution": {
      page: 5,
      label: "Exercise 11",
      type: "corrected-pdf-error",
      note: "The proposed function y=e^{-x/2} does not satisfy the printed equation 2y+y'=0. Direct substitution gives (3/2)e^{-x/2}, not zero."
    },
    "Exercise 13: verify trig-exponential solution": { page: 5, label: "Exercise 13", type: "pdf-assigned-exercise" }
  });

  markSourceExamples(ivpExamples, "Chapter 01_ODE_new02.pdf", "1.2", {
    "Example 1: first-order IVP": { page: 6, label: "Example 1" },
    "Example 2: solution interval": { page: 7, label: "Example 2" },
    "Example 3: second-order IVP": { page: 8, label: "Example 3" }
  });

  markSourceExamples(separableExamples, "Chapter 02_ODE04.pdf", "2.2", {
    "Introductory example": { page: 1, label: "Introductory separable example" },
    "Example 1": { page: 2, label: "Example 1" },
    "Exercise 1": { page: 2, label: "Exercise 1", type: "pdf-assigned-exercise" },
    "Exercise 5": { page: 3, label: "Exercise 5", type: "pdf-assigned-exercise" },
    "Exercise 23: IVP": { page: 3, label: "Exercise 23", type: "pdf-assigned-exercise" },
    "Exercise 25: IVP": { page: 4, label: "Exercise 25", type: "pdf-assigned-exercise" }
  });

  markSourceExamples(linearExamples, "Chapter 02_ODE04.pdf", "2.3", {
    "Exercise 3": { page: 6, label: "Exercise 3", type: "pdf-assigned-exercise" },
    "Exercise 9": {
      page: 6,
      label: "Exercise 9",
      type: "pdf-assigned-exercise",
      note: "The PDF writes x∈(0,∞). The same formula can be solved on any interval not crossing x=0; the printed work chooses the positive interval."
    },
    "Exercise 27: IVP": { page: 7, label: "Exercise 27", type: "pdf-assigned-exercise" }
  });

  markSourceExamples(exactExamples, "Chapter 02_ODE04.pdf", "2.4", {
    "Exercise 3": { page: 9, pages: [9, 10], label: "Exercise 3", type: "pdf-assigned-exercise" },
    "Exercise 33: integrating factor": { page: 11, pages: [11, 12], label: "Exercise 33", type: "pdf-assigned-exercise" }
  });

  markSourceExamples(bernoulliExamples, "Chapter 02_ODE04.pdf", "2.5", {
    "Exercise 15": { page: 13, pages: [13, 14], label: "Exercise 15", type: "pdf-assigned-exercise" },
    "Exercise 18": { page: 14, pages: [14, 15], label: "Exercise 18", type: "pdf-assigned-exercise" }
  });

  const ch13_1_Examples = [
    ex("Example 1: natural domain", m`f(x,y)=\sqrt{y+1}+\ln(x^2-y)`, [
      step(m`y+1\ge0\Rightarrow y\ge-1`, "Square roots require nonnegative radicands."),
      step(m`x^2-y>0\Rightarrow y<x^2`, "Logarithms require positive arguments."),
      step(m`Domain=\{(x,y):y\ge-1,\ y<x^2\}`, "Both conditions must hold at the same time.")
    ], "Domains are constraint intersections.", "Chapter 13.1"),
    ex("Example 2: three-variable domain", m`f(x,y,z)=\sqrt{1-x^2-y^2-z^2}`, [
      step(m`1-x^2-y^2-z^2\ge0`, "Square root condition."),
      step(m`x^2+y^2+z^2\le1`, "Rearrange."),
      step(m`Domain=\text{solid unit ball}`, "All points on or inside the unit sphere.")
    ], "Three-variable domains are regions in space.", "Chapter 13.1"),
    ex("Example 3: graph descriptions", m`\text{Describe graphs of: (a) } 1-x-\frac{1}{2}y,\ (b)\ \sqrt{1-x^2-y^2},\ (c)\ -\sqrt{x^2+y^2}`, [
      step(m`z = 1-x-\frac{1}{2}y \implies x+\frac{1}{2}y+z = 1`, "The graph is a plane with intercepts (1,0,0), (0,2,0), (0,0,1)."),
      step(m`z = \sqrt{1-x^2-y^2} \implies x^2+y^2+z^2=1\ (z\ge0)`, "Squaring shows it is the upper hemisphere of radius 1 centered at the origin."),
      step(m`z = -\sqrt{x^2+y^2} \implies z^2=x^2+y^2\ (z\le 0)`, "The graph is the lower nappe of a circular cone.")
    ], "Visualizing surfaces in 3-space builds geometric intuition.", "Chapter 13.1"),
    ex("Example 4: level curves", m`f(x,y)=y^2-x^2`, [
      step(m`f(x,y)=k\Rightarrow y^2-x^2=k`, "Level curves set the output equal to a constant."),
      step(m`k>0:\ hyperbolas\ open\ along\ y`, "Positive k makes y^2 dominate."),
      step(m`k<0:\ hyperbolas\ open\ along\ x`, "Negative k rearranges to x^2-y^2=-k."),
      step(m`k=0:\ y=\pm x`, "The zero level is two crossing lines.")
    ], "Level curves are 2D slices of a 3D surface.", "Chapter 13.1"),
    ex("Example 5: contour ellipses", m`f(x,y)=4x^2+y^2`, [
      step(m`4x^2+y^2=k`, "Set f equal to height k."),
      step(m`\frac{x^2}{k/4}+\frac{y^2}{k}=1`, "For k>0 this is ellipse form."),
      step(m`x\text{-intercepts}=\pm\frac{\sqrt{k}}{2},\quad y\text{-intercepts}=\pm\sqrt{k}`, "Read intercepts from the ellipse.")
    ], "Contour plots compress height information into curves.", "Chapter 13.1")
  ];

  const ch13_2_Examples = [
    ex("Example 1: path limits", m`f(x,y)=-\frac{xy}{x^2+y^2}`, [
      step(m`Along\ x-axis:\ y=0\Rightarrow f=0`, "One path gives 0."),
      step(m`Along\ y-axis:\ x=0\Rightarrow f=0`, "Another path also gives 0."),
      step(m`Along\ y=x:\ f=-\frac{x^2}{2x^2}=-\frac12`, "A diagonal path gives a different value."),
      step(m`Along\ y=-x:\ f=\frac{x^2}{2x^2}=\frac12`, "Another path gives still another value."),
      step(m`Limit\ does\ not\ exist`, "Different path limits prove no general limit.")
    ], "In multivariable limits, path disagreement is enough to prove DNE.", "Chapter 13.2"),
    ex("Example 2: direct evaluation", m`Evaluate\quad \lim_{(x,y)\to(1,4)}(5x^3y^2-9)`, [
      step(m`5(1)^3(4)^2 - 9`, "A polynomial function is continuous everywhere; substitute variables directly."),
      step(m`5(16)-9 = 71`, "Simplify the arithmetic.")
    ], "Continuous functions evaluate limits by direct substitution.", "Chapter 13.2"),
    ex("Example 3: path test DNE", m`Show\ that\ \lim_{(x,y)\to(0,0)}-\frac{xy}{x^2+y^2}\ DNE`, [
      step(m`Along\ x\text{-axis}\ (y=0):\ \lim_{x\to0}-\frac{0}{x^2} = 0`, "Along the x-axis, y = 0, giving 0."),
      step(m`Along\ y=x:\ \lim_{x\to0}-\frac{x^2}{2x^2} = -\frac{1}{2}`, "Along the line y = x, we get -1/2."),
      step(m`0 \neq -\frac{1}{2}\Rightarrow \text{Limit DNE}`, "Since different paths yield different limits, the general limit DNE.")
    ], "If two paths yield different limits, the general limit does not exist.", "Chapter 13.2"),
    ex("Example 4: continuity", m`Show\ continuity\ of\ f(x,y)=3x^2y^5\ and\ \sin(3x^2y^5)`, [
      step(m`3x^2y^5\text{ is continuous}`, "Polynomial functions are continuous everywhere."),
      step(m`\sin(3x^2y^5)\text{ is continuous}`, "Composition of continuous functions (sine and polynomial) is continuous everywhere.")
    ], "Polynomials, sine, cosine, and their compositions are continuous on their domains.", "Chapter 13.2"),
    ex("Example 5: rational evaluation", m`Evaluate\quad \lim_{(x,y)\to(-1,2)}\frac{xy}{x^2+y^2}`, [
      step(m`\frac{(-1)(2)}{(-1)^2+(2)^2}`, "Denominator is not zero at the target point; evaluate directly by substitution."),
      step(m`-\frac{2}{1+4} = -\frac{2}{5}`, "Simplify the fraction.")
    ], "Rational functions are continuous where denominator is non-zero.", "Chapter 13.2"),
    ex("Example 6: rational continuity domain", m`Find\ where\ f(x,y)=\frac{x^3y^2}{1-xy}\ is\ continuous`, [
      step(m`1-xy \neq 0 \implies xy \neq 1`, "Rational function is continuous everywhere except where denominator is 0."),
      step(m`\text{Continuous on } \{(x,y): xy \neq 1\}`, "The function is continuous everywhere except on the hyperbola xy = 1.")
    ], "Continuity domains are identical to natural function domains.", "Chapter 13.2"),
    ex("Example 7: polar limit proof", m`Evaluate\quad \lim_{(x,y)\to(0,0)}(x^2+y^2)\ln(x^2+y^2)`, [
      step(m`x=r\cos\theta,\ y=r\sin\theta\implies x^2+y^2=r^2`, "Use polar coordinates. As (x,y)->(0,0), r->0+."),
      step(m`\lim_{r\to0^+} r^2\ln(r^2) = \lim_{r\to0^+} 2r^2\ln r`, "Simplify in terms of r."),
      step(m`\lim_{r\to0^+} \frac{2\ln r}{r^{-2}}`, "Rewrite as an infinity-over-infinity indeterminate form for L'Hopital's Rule."),
      step(m`\lim_{r\to0^+} \frac{2/r}{-2r^{-3}} = \lim_{r\to0^+} -r^2 = 0`, "Differentiate numerator and denominator and evaluate.")
    ], "Polar coordinates convert 2D limits into single-variable limits as r approaches 0.", "Chapter 13.2")
  ];

  const ch13_3_Examples = [
    ex("Example 1: definition at a point", m`For\ f(x,y)=2x^3y^2+2y+4x,\ find\ f_x(1,3)\ and\ f_y(1,3)\ via\ definition`, [
      step(m`f_x(1,3) = \lim_{h\to0}\frac{f(1+h,3)-f(1,3)}{h}`, "Use limit definition for x-partial."),
      step(m`f(1+h,3) = 18(1+3h+3h^2+h^3)+6+4+4h = 28+58h+54h^2+18h^3`, "Evaluate f at (1+h, 3)."),
      step(m`f(1,3) = 28 \implies f_x(1,3) = \lim_{h\to0}\frac{58h+54h^2+18h^3}{h} = 58`, "Evaluate the limit."),
      step(m`f_y(1,3) = \lim_{h\to0}\frac{f(1,3+h)-f(1,3)}{h}`, "Use limit definition for y-partial."),
      step(m`f(1,3+h) = 2(9+6h+h^2)+6+2h+4 = 28+14h+2h^2`, "Evaluate f at (1, 3+h)."),
      step(m`f_y(1,3) = \lim_{h\to0}\frac{14h+2h^2}{h} = 14`, "Evaluate the limit.")
    ], "Limit definition is the foundation for partial derivatives.", "Chapter 13.3"),
    ex("Example 2: partial derivative evaluation", m`For\ f(x,y)=2x^3y^2+2y+4x,\ find\ general\ partials\ then\ evaluate\ at\ (1,3)`, [
      step(m`f_x = 6x^2y^2 + 4`, "Differentiate with respect to x, treating y as constant."),
      step(m`f_y = 4x^3y + 2`, "Differentiate with respect to y, treating x as constant."),
      step(m`f_x(1,3) = 6(1)(9)+4 = 58`, "Substitute x=1, y=3 into f_x."),
      step(m`f_y(1,3) = 4(1)(3)+2 = 14`, "Substitute x=1, y=3 into f_y.")
    ], "Finding the general partial derivative function first is usually faster.", "Chapter 13.3"),
    ex("Example 3: trigonometric partials", m`Find\ z_x\ and\ z_y\ for\ z=x^4\sin(xy^3)`, [
      step(m`z_x = 4x^3\sin(xy^3) + x^4\cos(xy^3)\cdot y^3`, "Apply product rule and chain rule with respect to x."),
      step(m`z_x = 4x^3\sin(xy^3)+x^4y^3\cos(xy^3)`, "Simplify x-derivative."),
      step(m`z_y = x^4\cos(xy^3)\cdot (3xy^2) = 3x^5y^2\cos(xy^3)`, "Differentiate with respect to y using chain rule.")
    ], "Trig functions require chain rule for inner arguments.", "Chapter 13.3"),
    ex("Example 5: geometric slopes", m`Find\ tangent\ slopes\ for\ z=x^2y+5y^3\ at\ (1,-2)`, [
      step(m`f_x = 2xy \implies f_x(1,-2) = -4`, "x-slope is f_x evaluated at the point."),
      step(m`f_y = x^2+15y^2 \implies f_y(1,-2) = 1+15(4) = 61`, "y-slope is f_y evaluated at the point.")
    ], "Partials represent slopes parallel to the coordinate axes.", "Chapter 13.3"),
    ex("Example 9: partials without continuity", m`f(x,y)=\begin{cases}-\frac{xy}{x^2+y^2},&(x,y)\ne(0,0)\\0,&(x,y)=(0,0)\end{cases}`, [
      step(m`f_x(0,0)=\lim_{h\to0}\frac{f(h,0)-f(0,0)}{h}=0`, "Along the x-axis the numerator contains y = 0."),
      step(m`f_y(0,0)=\lim_{h\to0}\frac{f(0,h)-f(0,0)}{h}=0`, "Along the y-axis the numerator contains x = 0."),
      step(m`Along\ y=x,\quad f(x,x)=-\frac{x^2}{2x^2}=-\frac12`, "The diagonal path approaches a value different from f(0,0)."),
      step(m`Partials\ exist,\ but\ f\ is\ not\ continuous\ at\ (0,0)`, "Existing coordinate partials do not force a multivariable limit.")
    ], "Partial derivatives at a point do not by themselves guarantee continuity.", "Chapter 13.3", {
      pdf: "Chapter 13.pdf",
      page: 19,
      section: "13.3",
      label: "Example 9",
      type: "pdf-example",
      status: "verified"
    }),
    ex("Example 12: second-order partials", m`Find\ second-order\ partials\ of\ f(x,y)=x^2y^3+x^4y`, [
      step(m`f_x=2xy^3+4x^3y,\quad f_y=3x^2y^2+x^4`, "First-order partial derivatives."),
      step(m`f_{xx} = 2y^3+12x^2y`, "Differentiate f_x with respect to x."),
      step(m`f_{yy} = 6x^2y`, "Differentiate f_y with respect to y."),
      step(m`f_{xy} = 6xy^2+4x^3`, "Differentiate f_x with respect to y."),
      step(m`f_{yx} = 6xy^2+4x^3`, "Differentiate f_y with respect to x. Note that f_xy = f_yx.")
    ], "Clairaut's theorem guarantees mixed partials match for smooth functions.", "Chapter 13.3")
  ];

  const ch13_5_Examples = [
    ex("Chain rule Example 1", m`z=x^2y,\quad x=t^2,\quad y=t^3`, [
      step(m`z_x=2xy,\quad z_y=x^2`, "Compute partials of z."),
      step(m`x'=2t,\quad y'=3t^2`, "Compute derivatives of inner functions."),
      step(m`\frac{dz}{dt}=z_xx'+z_yy'`, "Use the multivariable chain rule."),
      step(m`(2xy)(2t)+x^2(3t^2)`, "Substitute."),
      step(m`2(t^2)(t^3)(2t)+(t^2)^2(3t^2)=7t^6`, "Simplify; direct substitution z=t^7 confirms dz/dt=7t^6.")
    ], "Chain rule tracks every path by which t affects z.", "Chapter 13.5"),
    ex("Chain rule Example 3: two parameters", m`z=e^{xy},\ x=2u+v,\ y=u/v`, [
      step(m`z_x = ye^{xy},\ z_y=xe^{xy}`, "Compute partials of outer function z."),
      step(m`x_u = 2,\ y_u = \frac{1}{v}`, "Compute u-derivatives of inner functions."),
      step(m`z_u = z_xx_u + z_yy_u = 2ye^{xy} + \frac{x}{v}e^{xy}`, "Apply chain rule for u."),
      step(m`z_u = \left(2\frac{u}{v} + \frac{2u+v}{v}\right)e^{(2u+v)u/v} = \left(\frac{4u}{v}+1\right)e^{(2u+v)u/v}`, "Substitute and simplify."),
      step(m`x_v = 1,\ y_v = -\frac{u}{v^2}`, "Compute v-derivatives of inner functions."),
      step(m`z_v = z_xx_v + z_yy_v = ye^{xy} - \frac{xu}{v^2}e^{xy}`, "Apply chain rule for v."),
      step(m`z_v = \left(\frac{u}{v} - \frac{(2u+v)u}{v^2}\right)e^{(2u+v)u/v} = -\frac{2u^2}{v^2}e^{(2u+v)u/v}`, "Substitute and simplify.")
    ], "Chain rule for multiple parameters sums up products for each variable path.", "Chapter 13.5"),
    ex("Chain rule Example 4: three variables", m`w=e^{xyz},\ x=3u+v,\ y=3u-v,\ z=u^2v`, [
      step(m`w_x=yze^{xyz},\ w_y=xze^{xyz},\ w_z=xye^{xyz}`, "Compute outer partials of w."),
      step(m`x_u=3,\ y_u=3,\ z_u=2uv`, "Compute u-partials of inner functions."),
      step(m`w_u = w_xx_u+w_yy_u+w_zz_u = (3yz+3xz+2xyuv)e^{xyz}`, "Apply Chain Rule for u."),
      step(m`x_v=1,\ y_v=-1,\ z_v=u^2`, "Compute v-partials of inner functions."),
      step(m`w_v = w_xx_v+w_yy_v+w_zz_v = (yz-xz+xyu^2)e^{xyz}`, "Apply Chain Rule for v.")
    ], "The three-variable chain rule sums across x, y, and z paths.", "Chapter 13.5"),
    ex("Chain rule Example 7: implicit", m`x^3+y^2x-3=0`, [
      step(m`F(x,y)=x^3+xy^2-3`, "Write the equation as F=0."),
      step(m`F_x=3x^2+y^2,\quad F_y=2xy`, "Compute partials."),
      step(m`\frac{dy}{dx}=-\frac{F_x}{F_y}`, "Implicit derivative formula."),
      step(m`\frac{dy}{dx}=-\frac{3x^2+y^2}{2xy}`, "Substitute.")
    ], "Implicit differentiation is a chain-rule shortcut.", "Chapter 13.5"),
    ex("Chain rule Example 8: sphere", m`x^2+y^2+z^2=1,\quad (2/3,1/3,2/3)`, [
      step(m`F=x^2+y^2+z^2-1`, "Use F=0."),
      step(m`F_x=2x,\quad F_y=2y,\quad F_z=2z`, "Compute gradient components."),
      step(m`z_x=-\frac{F_x}{F_z}=-\frac{x}{z}`, "Implicit partial formula."),
      step(m`z_y=-\frac{F_y}{F_z}=-\frac{y}{z}`, "Same for y."),
      step(m`z_x=-1,\quad z_y=-\frac12`, "Evaluate at the point.")
    ], "For surfaces F=0, solve partial slopes with -F_variable/F_z.", "Chapter 13.5")
  ];

  const ch13_6_Examples = [
    ex("Directional derivative Example 1", m`f(x,y)=xy,\quad P=(1,2),\quad u=\frac{\sqrt3}{2}i+\frac12j`, [
      step(m`r(s)=\left(1+\frac{\sqrt3}{2}s,\ 2+\frac12s\right)`, "Move a distance s from P in the unit direction u."),
      step(m`f(r(s))=\left(1+\frac{\sqrt3}{2}s\right)\left(2+\frac12s\right)=2+\left(\frac12+\sqrt3\right)s+\frac{\sqrt3}{4}s^2`, "Write the surface height along that direction as a one-variable function."),
      step(m`D_uf(1,2)=\left.\frac{d}{ds}f(r(s))\right|_{s=0}=\frac12+\sqrt3`, "Differentiate with respect to distance and evaluate at the starting point."),
      step(m`\frac12+\sqrt3\approx2.23`, "For a small move in direction u, f increases by about 2.23 times the distance moved.")
    ], "A directional derivative is an ordinary derivative along a unit-speed path.", "Chapter 13.6"),
    ex("Directional derivative Example 2", m`f(x,y)=e^{xy},\ (-2,0),\ angle=\pi/3`, [
      step(m`\nabla f=(ye^{xy},xe^{xy})`, "Compute the gradient."),
      step(m`\nabla f(-2,0)=(0,-2)`, "Evaluate at the point."),
      step(m`u=(\cos\pi/3,\sin\pi/3)=\left(\frac12,\frac{\sqrt3}{2}\right)`, "Direction unit vector."),
      step(m`D_uf=\nabla f\cdot u=0\cdot\frac12-2\cdot\frac{\sqrt3}{2}=-\sqrt3`, "Dot product gives directional derivative.")
    ], "Directional derivative is gradient dot unit direction.", "Chapter 13.6"),
    ex("Directional derivative Example 3", m`f=x^2y-yz^3+z,\ P=(1,-2,0),\ a=2i+j-2k`, [
      step(m`\nabla f=(2xy,\ x^2-z^3,\ -3yz^2+1)`, "Compute gradient."),
      step(m`\nabla f(1,-2,0)=(-4,1,1)`, "Evaluate at P."),
      step(m`|a|=3,\quad u=\left(\frac23,\frac13,-\frac23\right)`, "Normalize the direction vector."),
      step(m`D_uf=(-4,1,1)\cdot\left(\frac23,\frac13,-\frac23\right)=-3`, "Take dot product.")
    ], "Always normalize direction vectors before using them.", "Chapter 13.6"),
    ex("Directional derivative Example 4", m`f(x,y)=x^2e^y,\quad (-2,0)`, [
      step(m`\nabla f=(2xe^y,\ x^2e^y)`, "Compute gradient."),
      step(m`\nabla f(-2,0)=(-4,4)`, "Evaluate."),
      step(m`max\ D_uf=|\nabla f|=\sqrt{16+16}=4\sqrt2`, "Maximum directional derivative is gradient magnitude."),
      step(m`u=\frac{\nabla f}{|\nabla f|}=\left(-\frac{1}{\sqrt2},\frac{1}{\sqrt2}\right)`, "The steepest direction is the gradient direction.")
    ], "Gradient points in the direction of fastest increase.", "Chapter 13.6")
  ];

  const ch13_7_Examples = [
    ex("Tangent plane Example 1", m`x^2+4y^2+z^2=18,\quad P=(1,2,1)`, [
      step(m`F=x^2+4y^2+z^2-18`, "Write surface as F=0."),
      step(m`\nabla F=(2x,8y,2z)`, "Normal vector is the gradient."),
      step(m`\nabla F(1,2,1)=(2,16,2)`, "Evaluate at P."),
      step(m`2(x-1)+16(y-2)+2(z-1)=0`, "Tangent plane formula."),
      step(m`x+8y+z=18`, "Divide by 2 and simplify the tangent plane."),
      step(m`x=1+2t,\quad y=2+16t,\quad z=1+2t`, "Normal line uses point plus normal direction.")
    ], "For F=0, gradient is perpendicular to the tangent plane.", "Chapter 13.7"),
    ex("Tangent plane Example 1(c): plane angle", m`Find\ angle\ between\ tangent\ plane\ x+8y+z=18\ and\ xy-plane`, [
      step(m`n_1 = \langle 1,8,1 \rangle`, "Normal vector to the tangent plane (obtained from the gradient at P(1,2,1))."),
      step(m`n_2 = \langle 0,0,1 \rangle`, "Normal vector to the xy-plane (z = 0)."),
      step(m`\cos\theta = \frac{|n_1 \cdot n_2|}{|n_1||n_2|} = \frac{1}{\sqrt{66}}`, "Apply the vector angle formula."),
      step(m`\theta = \cos^{-1}\left(\frac{1}{\sqrt{66}}\right) \approx 83^\circ`, "Calculate the angle using inverse cosine.")
    ], "The angle between two surfaces is the angle between their normal vectors.", "Chapter 13.7"),
    ex("Tangent plane Example 2", m`z=x^2y,\quad P=(2,1,4)`, [
      step(m`F=z-x^2y`, "Convert to F=0."),
      step(m`\nabla F=(-2xy,-x^2,1)`, "Compute gradient."),
      step(m`\nabla F(2,1,4)=(-4,-4,1)`, "Normal vector."),
      step(m`-4(x-2)-4(y-1)+(z-4)=0`, "Tangent plane."),
      step(m`-4x-4y+z=-8`, "Expand and simplify the tangent plane."),
      step(m`x=2-4t,\quad y=1-4t,\quad z=4+t`, "Normal line.")
    ], "For z=f(x,y), F=z-f(x,y) is the safest route.", "Chapter 13.7")
  ];

  const ch13_8_Examples = [
    ex("Max/min Example 3", m`Locate\ all\ relative\ extrema\ and\ saddle\ points\ of\ f(x,y)=3x^2-2xy+y^2-8y`, [
      step(m`f_x=6x-2y,\quad f_y=-2x+2y-8`, "Find the first partial derivatives."),
      step(m`6x-2y=0,\quad -2x+2y-8=0\Rightarrow (x,y)=(2,6)`, "Solve both critical-point equations together."),
      step(m`f_{xx}=6,\quad f_{yy}=2,\quad f_{xy}=-2`, "Find the second partial derivatives."),
      step(m`D=f_{xx}f_{yy}-(f_{xy})^2=(6)(2)-(-2)^2=8>0`, "Compute the second-partials discriminant."),
      step(m`D>0\ and\ f_{xx}=6>0\Rightarrow (2,6)\ is\ a\ relative\ minimum`, "A positive discriminant with positive f_xx identifies a local bowl.")
    ], "Solve for critical points first, then classify them with the second-partials test.", "Chapter 13.8"),
    ex("Max/min Example 4", m`f(x,y)=4xy-x^4-y^4`, [
      step(m`f_x=4y-4x^3,\quad f_y=4x-4y^3`, "Find first partials."),
      step(m`y=x^3,\quad x=y^3`, "Set both equal to zero."),
      step(m`Critical\ points:\ (0,0),(1,1),(-1,-1)`, "Solve the system."),
      step(m`f_{xx}=-12x^2,\quad f_{yy}=-12y^2,\quad f_{xy}=4`, "Second partials."),
      step(m`D=f_{xx}f_{yy}-(f_{xy})^2=144x^2y^2-16`, "Compute the discriminant."),
      step(m`(1,1),(-1,-1):D>0,\ f_{xx}<0\Rightarrow relative\ maxima`, "Classify."),
      step(m`(0,0):D<0\Rightarrow saddle`, "Classify.")
    ], "The second derivative test classifies critical points.", "Chapter 13.8")
  ];

  markSourceExamples(ch13_1_Examples, "Chapter 13.pdf", "13.1", {
    "Example 1: natural domain": { page: 1, pages: [1, 2], label: "Example 1" },
    "Example 2: three-variable domain": { page: 2, label: "Example 2" },
    "Example 3: graph descriptions": { page: 3, label: "Example 3" },
    "Example 4: level curves": { page: 4, label: "Example 4" },
    "Example 5: contour ellipses": { page: 5, label: "Example 5" }
  });

  markSourceExamples(ch13_2_Examples, "Chapter 13.pdf", "13.2", {
    "Example 1: path limits": { page: 7, pages: [7, 8], label: "Example 1" },
    "Example 2: direct evaluation": { page: 10, label: "Example 2" },
    "Example 3: path test DNE": { page: 10, label: "Example 3" },
    "Example 4: continuity": { page: 11, label: "Example 4" },
    "Example 5: rational evaluation": { page: 12, label: "Example 5" },
    "Example 6: rational continuity domain": { page: 12, label: "Example 6" },
    "Example 7: polar limit proof": { page: 13, label: "Example 7" }
  });

  markSourceExamples(ch13_3_Examples, "Chapter 13.pdf", "13.3", {
    "Example 1: definition at a point": { page: 16, label: "Example 1" },
    "Example 2: partial derivative evaluation": { page: 17, label: "Example 2" },
    "Example 3: trigonometric partials": { page: 18, label: "Example 3" },
    "Example 5: geometric slopes": { page: 18, label: "Example 5" },
    "Example 9: partials without continuity": { page: 19, pages: [19, 20], label: "Example 9" },
    "Example 12: second-order partials": { page: 21, pages: [21, 22], label: "Example 12" }
  });

  markSourceExamples(ch13_5_Examples, "Chapter 13.pdf", "13.5", {
    "Chain rule Example 1": { page: 26, label: "Example 1" },
    "Chain rule Example 3: two parameters": { page: 27, pages: [27, 28], label: "Example 3" },
    "Chain rule Example 4: three variables": { page: 28, label: "Example 4" },
    "Chain rule Example 7: implicit": { page: 29, label: "Example 7" },
    "Chain rule Example 8: sphere": { page: 30, label: "Example 8" }
  });

  markSourceExamples(ch13_6_Examples, "Chapter 13.pdf", "13.6", {
    "Directional derivative Example 1": { page: 37, label: "Example 1" },
    "Directional derivative Example 2": { page: 38, label: "Example 2" },
    "Directional derivative Example 3": { page: 38, pages: [38, 39], label: "Example 3" },
    "Directional derivative Example 4": { page: 41, label: "Example 4" }
  });

  markSourceExamples(ch13_7_Examples, "Chapter 13.pdf", "13.7", {
    "Tangent plane Example 1": { page: 46, pages: [46, 47], label: "Example 1(a-b)" },
    "Tangent plane Example 1(c): plane angle": { page: 47, label: "Example 1(c)" },
    "Tangent plane Example 2": { page: 47, pages: [47, 48], label: "Example 2" }
  });

  markSourceExamples(ch13_8_Examples, "Chapter 13.pdf", "13.8", {
    "Max/min Example 3": {
      page: 53,
      label: "Example 3",
      note: "The supplied PDF excerpt begins its worked extrema examples at Example 3; Examples 1 and 2 are not present."
    },
    "Max/min Example 4": { page: 53, pages: [53, 54], label: "Example 4" }
  });

  const modelRows = [
    ["Malthusian population", m`\frac{dP}{dt}=aP`, "Bacteria growth or small populations over short time."],
    ["Logistic population", m`\frac{dP}{dt}=aP-bP^2`, "Population with carrying capacity."],
    ["Radioactive decay", m`\frac{dA}{dt}=aA,\ a<0`, "Carbon dating and nuclear decay."],
    ["Newton cooling/warming", m`\frac{dT}{dt}=a(T-T_m)`, "Cooling coffee, forensic time of death."],
    ["Spread of disease", m`\frac{dx}{dt}=ax(n-x)`, "Simple infection spread."],
    ["Chemical reaction", m`\frac{dx}{dt}=k(a-x)(b-x)`, "Second-order reactions."],
    ["Mixing", m`\frac{dA}{dt}=R_{in}-R_{out}`, "Salt tank concentration."],
    ["Series circuit", m`Lq''+Rq'+\frac{1}{C}q=E(t)`, "RLC electrical circuits."],
    ["Falling bodies", m`mh''+kh'=-mg`, "Upward-positive height with linear air resistance."],
    ["Simple harmonic motion", m`x''+\omega^2x=0`, "Springs and pendulums."],
    ["Damped harmonic motion", m`x''+2\lambda x'+\omega^2x=0`, "Shock absorbers and vibration damping."]
  ];

  const modules = [
    {
      id: "module-0",
      title: "Module 0: Calculus Refresher",
      description: "Fast recall for rusty differentiation and integration.",
      topics: [
        {
          id: "calc-differentiation",
          number: "0.1",
          title: "Differentiation Quick Review",
          hook: "Differentiation is rate of change: speed from position, marginal profit from profit, or how fast a tank level is changing.",
          prerequisites: ["Algebra"],
          formulas: [m`\frac{d}{dx}x^n=nx^{n-1}`, m`(uv)'=u'v+uv'`, m`\frac{d}{dx}f(g(x))=f'(g(x))g'(x)`],
          theory: ["Use the power, product, quotient, and chain rules as pattern tools.", "ODE verification depends on differentiating accurately before substituting back."],
          examples: diffRefresherExamples,
          practice: [
            pr("Differentiate a product", m`\frac{d}{dx}(x^3\ln x)`, "Use product rule with u=x^3 and v=ln x.", [step(m`3x^2\ln x+x^3\cdot\frac1x`, "Product rule."), step(m`3x^2\ln x+x^2`, "Simplify.")], "differentiation"),
            pr("Differentiate a chain", m`\frac{d}{dx}e^{4x^2-1}`, "Outside is e^u; inside is 4x^2-1.", [step(m`e^{4x^2-1}\cdot 8x`, "Chain rule.")], "differentiation")
          ],
          recap: ["Power rule handles polynomials.", "Product and chain rules are the ODE workhorses.", "Check derivatives before trusting an ODE solution."]
        },
        {
          id: "calc-integration",
          number: "0.2",
          title: "Integration Quick Review",
          hook: "Integration is accumulation: flow rate into a tank becomes total water, velocity becomes distance.",
          prerequisites: ["0.1 Differentiation"],
          formulas: [m`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C`, m`\int e^x\,dx=e^x+C`, m`\int \frac1x\,dx=\ln|x|+C`],
          theory: ["Think reverse differentiation first.", "If a composite function appears beside its derivative, use u-substitution."],
          examples: intRefresherExamples,
          practice: [
            pr("Basic antiderivative", m`\int(5x^4-2e^x)\,dx`, "Integrate term by term.", [step(m`x^5-2e^x+C`, "Power rule and exponential integral.")], "integration"),
            pr("u-substitution", m`\int 6x(3x^2+1)^4\,dx`, "Let u=3x^2+1.", [step(m`u=3x^2+1,\ du=6x\,dx`, "Choose inside expression."), step(m`\int u^4du=\frac{u^5}{5}+C`, "Integrate."), step(m`\frac{(3x^2+1)^5}{5}+C`, "Back-substitute.")], "integration")
          ],
          recap: ["Always add +C for indefinite integrals.", "u-substitution is reverse chain rule.", "Integration fluency makes first-order ODEs much easier."]
        }
      ]
    },
    {
      id: "module-1",
      title: "Module 1: Integration Techniques",
      description: "Chapter 7 techniques used inside ODE solutions.",
      topics: [
        {
          id: "integration-by-parts",
          number: "1.1",
          title: "Integration by Parts",
          hook: "By parts handles products where one factor becomes simpler when differentiated.",
          prerequisites: ["0.2 Integration"],
          formulas: [m`\int u\,dv = uv - \int v\,du`, m`LIATE:\ Log,\ Inverse,\ Algebraic,\ Trig,\ Exponential`],
          theory: ["Choose u using LIATE.", "Repeated and cyclic by-parts problems are normal; keep symbols organized."],
          examples: byPartsExamples,
          practice: [
            pr("Practice by parts", m`\int x\sin x\,dx`, "Let u=x and dv=sin x dx.", [step(m`u=x,\ dv=\sin xdx,\ du=dx,\ v=-\cos x`, "Set by-parts pieces."), step(m`-x\cos x+\int\cos xdx`, "Apply formula."), step(m`-x\cos x+\sin x+C`, "Finish.")], "integration by parts"),
            pr("Practice logarithm", m`\int \log x\,dx`, "Same structure as int ln x dx.", [step(m`u=\ln x,\ dv=dx`, "Choose u."), step(m`x\ln x-x+C`, "Apply by parts.")], "integration by parts"),
            pr("Selected Exercise 7.2 #4: repeat by parts", m`\int x^2e^{-2x}\,dx`, "Differentiate the polynomial until it disappears.", [
              step(m`u=x^2,\quad dv=e^{-2x}dx,\quad du=2x\,dx,\quad v=-\frac12e^{-2x}`, "Choose the polynomial as u."),
              step(m`\int x^2e^{-2x}dx=-\frac12x^2e^{-2x}+\int xe^{-2x}dx`, "Apply integration by parts once."),
              step(m`\int xe^{-2x}dx=-\frac12xe^{-2x}-\frac14e^{-2x}`, "Apply integration by parts a second time."),
              step(m`-\frac12x^2e^{-2x}-\frac12xe^{-2x}-\frac14e^{-2x}+C`, "Combine the terms.")
            ], "integration by parts", {
              pdf: "Chapter 7.pdf",
              page: 7,
              section: "7.2",
              label: "Exercise 4",
              type: "pdf-exercise",
              status: "verified"
            }),
            pr("Selected Exercise 7.2 #17: inverse tangent", m`\int\tan^{-1}(3x)\,dx`, "Use inverse tangent as u and dx as dv.", [
              step(m`u=\tan^{-1}(3x),\quad dv=dx,\quad du=\frac{3}{1+9x^2}dx,\quad v=x`, "Set up integration by parts."),
              step(m`x\tan^{-1}(3x)-\int\frac{3x}{1+9x^2}dx`, "Apply the formula."),
              step(m`x\tan^{-1}(3x)-\frac16\ln(1+9x^2)+C`, "Use a denominator substitution in the remaining integral.")
            ], "integration by parts", {
              pdf: "Chapter 7.pdf",
              page: 7,
              section: "7.2",
              label: "Exercise 17",
              type: "pdf-exercise",
              status: "verified"
            })
          ],
          recap: ["Choose u to simplify.", "Cyclic integrals are solved algebraically.", "Write the formula on paper until it is automatic."]
        },
        {
          id: "trig-integrals",
          number: "1.2",
          title: "Trigonometric Integrals",
          hook: "Trig integrals are pattern recognition: odd powers, even powers, or product-to-sum.",
          prerequisites: ["1.1 Integration by Parts"],
          formulas: [m`\sin^2x+\cos^2x=1`, m`\sin^2x=\frac{1-\cos2x}{2}`, m`\cos^2x=\frac{1+\cos2x}{2}`],
          theory: ["Odd sine/cosine powers usually save one factor.", "Even powers use half-angle identities."],
          examples: trigExamples,
          practice: [
            pr("Odd sine power", m`\int \sin^3x\cos^2x\,dx`, "Save one sin x and convert the rest to cos.", [step(m`\sin^3x=(1-\cos^2x)\sin x`, "Convert."), step(m`u=\cos x,\ du=-\sin xdx`, "Substitute."), step(m`-\int(1-u^2)u^2du=-\frac{u^3}{3}+\frac{u^5}{5}+C`, "Integrate."), step(m`-\frac{\cos^3x}{3}+\frac{\cos^5x}{5}+C`, "Back-substitute.")], "trig integral"),
            pr("Product-to-sum", m`\int \cos5x\cos2x\,dx`, "Use cos A cos B formula.", [step(m`\cos A\cos B=\frac12[\cos(A-B)+\cos(A+B)]`, "Identity."), step(m`\frac12\int(\cos3x+\cos7x)dx`, "Apply."), step(m`\frac{\sin3x}{6}+\frac{\sin7x}{14}+C`, "Integrate.")], "trig integral"),
            pr("Selected Exercise 7.3 #29: tangent substitution", m`\int\tan^2x\sec^2x\,dx`, "An even secant power gives the derivative of tangent.", [
              step(m`u=\tan x,\quad du=\sec^2x\,dx`, "Save secant squared as du."),
              step(m`\int u^2du=\frac{u^3}{3}+C`, "Integrate the power."),
              step(m`\frac{\tan^3x}{3}+C`, "Substitute back.")
            ], "tangent/secant integral", {
              pdf: "Chapter 7.pdf",
              page: 18,
              section: "7.3",
              label: "Exercise 29",
              type: "pdf-exercise",
              status: "verified"
            })
          ],
          recap: ["Odd powers allow substitution.", "Even powers use half-angle.", "Product-to-sum handles mixed angles."]
        },
        {
          id: "trig-substitution",
          number: "1.3",
          title: "Trigonometric Substitution",
          hook: "Trig substitution replaces a radical with a triangle you can simplify.",
          prerequisites: ["1.2 Trigonometric Integrals"],
          formulas: [m`\sqrt{a^2-x^2}: x=a\sin\theta`, m`\sqrt{a^2+x^2}: x=a\tan\theta`, m`\sqrt{x^2-a^2}: x=a\sec\theta`],
          theory: ["Choose the substitution from the radical shape.", "Draw a triangle before back-substitution."],
          examples: trigSubExamples,
          practice: [
            pr("Substitution type", m`\int\frac{dx}{\sqrt{9-x^2}}`, "Use x=3 sin theta.", [step(m`x=3\sin\theta`, "Matches sqrt(a^2-x^2)."), step(m`dx=3\cos\theta d\theta,\ \sqrt{9-x^2}=3\cos\theta`, "Substitute."), step(m`\int d\theta=\theta+C=\sin^{-1}(x/3)+C`, "Back-substitute.")], "trig substitution"),
            pr("Secant type", m`\int\frac{dx}{x\sqrt{x^2-9}}`, "Use x=3 sec theta.", [step(m`x=3\sec\theta`, "Matches sqrt(x^2-a^2)."), step(m`dx=3\sec\theta\tan\theta d\theta,\ \sqrt{x^2-9}=3\tan\theta`, "Substitute."), step(m`\frac13\int d\theta=\frac13\sec^{-1}|x/3|+C`, "Back-substitute.")], "trig substitution"),
            pr("Assigned Exercise 7.4 #33: arc length of ln x", m`Find\ the\ arc\ length\ of\ y=\ln x,\quad 1\le x\le2`, "Start with y' = 1/x; x is positive on the interval.", [
              step(m`L=\int_1^2\sqrt{1+\frac1{x^2}}\,dx=\int_1^2\frac{\sqrt{x^2+1}}{x}\,dx`, "Apply the arc-length formula and use x > 0."),
              step(m`u=\sqrt{x^2+1}\Rightarrow dx=\frac{u}{x}du,\quad x^2=u^2-1`, "This substitution avoids a longer trigonometric simplification."),
              step(m`\int\frac{u^2}{u^2-1}du=\int\left(1+\frac1{u^2-1}\right)du`, "Rewrite by division."),
              step(m`u+\frac12\ln\left|\frac{u-1}{u+1}\right|`, "Integrate using partial fractions for the second term."),
              step(m`L=\sqrt5-\sqrt2+\ln\left(\frac{2(\sqrt2+1)}{\sqrt5+1}\right)`, "Evaluate from x = 1 to x = 2 and simplify.")
            ], "arc length", {
              pdf: "Chapter 7.pdf",
              page: 26,
              section: "7.4",
              label: "Exercise 33",
              type: "pdf-assigned-exercise",
              status: "verified"
            }),
            pr("Assigned Exercise 7.4 #34: arc length of x squared", m`Find\ the\ arc\ length\ of\ y=x^2,\quad 0\le x\le1`, "Differentiate first, then use the sqrt(1+u²) form.", [
              step(m`y'=2x,\quad L=\int_0^1\sqrt{1+4x^2}\,dx`, "Apply the arc-length formula."),
              step(m`u=2x,\quad dx=\frac12du,\quad L=\frac12\int_0^2\sqrt{1+u^2}\,du`, "Scale the variable to the standard form."),
              step(m`\int\sqrt{1+u^2}du=\frac12\left[u\sqrt{1+u^2}+\ln\left(u+\sqrt{1+u^2}\right)\right]`, "Use the verified trigonometric-substitution result."),
              step(m`L=\frac{\sqrt5}{2}+\frac14\ln(2+\sqrt5)`, "Evaluate at u = 2 and u = 0.")
            ], "arc length", {
              pdf: "Chapter 7.pdf",
              page: 26,
              section: "7.4",
              label: "Exercise 34",
              type: "pdf-assigned-exercise",
              status: "verified"
            })
          ],
          recap: ["Radical shape decides substitution.", "Triangles convert theta back to x.", "Definite integrals can use either changed bounds or back-substitution."]
        },
        {
          id: "partial-fractions",
          number: "1.4",
          title: "Partial Fractions",
          hook: "Partial fractions break one hard rational expression into simple log/arctan pieces.",
          prerequisites: ["0.2 Integration"],
          formulas: [m`\frac{P(x)}{(x-a)(x-b)}=\frac{A}{x-a}+\frac{B}{x-b}`, m`\frac{Ax+B}{x^2+px+q}\ for\ irreducible\ quadratics`],
          theory: ["If numerator degree is too high, divide first.", "Repeated factors need every power in the denominator."],
          examples: partialFractionExamples,
          practice: [
            pr("Distinct factors", m`\int\frac{3x+7}{(x+1)(x+2)}\,dx`, "Decompose into A/(x+1)+B/(x+2).", [step(m`3x+7=A(x+2)+B(x+1)`, "Clear denominator."), step(m`x=-1:\ 4=A;\ x=-2:\ 1=-B\Rightarrow B=-1`, "Solve."), step(m`4\ln|x+1|-\ln|x+2|+C`, "Integrate.")], "partial fractions: distinct"),
            pr("Selected Exercise 7.5 #23: repeated factor", m`\int\frac{2x^2+3}{x(x-1)^2}\,dx`, "Use A/x + B/(x-1) + C/(x-1)².", [
              step(m`\frac{2x^2+3}{x(x-1)^2}=\frac3x-\frac1{x-1}+\frac5{(x-1)^2}`, "Clear denominators and match coefficients."),
              step(m`\int\left(\frac3x-\frac1{x-1}+\frac5{(x-1)^2}\right)dx`, "Integrate the decomposition."),
              step(m`3\ln|x|-\ln|x-1|-\frac5{x-1}+C`, "Integrate each term.")
            ], "partial fractions: repeated", {
              pdf: "Chapter 7.pdf",
              page: 30,
              section: "7.5",
              label: "Exercise 23",
              type: "pdf-exercise",
              status: "verified"
            }),
            pr("Irreducible quadratic transfer", m`\int\frac{2x+3}{(x-1)(x^2+1)}\,dx`, "Use A/(x-1) + (Bx+C)/(x²+1).", [
              step(m`\frac{2x+3}{(x-1)(x^2+1)}=\frac{5/2}{x-1}+\frac{-\frac52x-\frac12}{x^2+1}`, "Clear denominators and solve A = 5/2, B = -5/2, C = -1/2."),
              step(m`\frac52\int\frac{dx}{x-1}-\frac52\int\frac{x\,dx}{x^2+1}-\frac12\int\frac{dx}{x^2+1}`, "Separate logarithm and inverse-tangent terms."),
              step(m`\frac52\ln|x-1|-\frac54\ln(x^2+1)-\frac12\tan^{-1}x+C`, "Integrate each term.")
            ], "partial fractions: irreducible quadratic", {
              type: "additional-practice",
              status: "verified"
            }),
            pr("Improper first", m`\int\frac{x^2+1}{x+1}\,dx`, "Divide first.", [step(m`\frac{x^2+1}{x+1}=x-1+\frac{2}{x+1}`, "Long division."), step(m`\frac{x^2}{2}-x+2\ln|x+1|+C`, "Integrate.")], "partial fractions: improper")
          ],
          recap: ["Proper rational first, then decompose.", "Linear factors use constants.", "Irreducible quadratics use linear numerators."]
        }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Introduction to Differential Equations",
      description: "Chapter 1 terminology, IVPs, and modeling.",
      topics: [
        {
          id: "de-terminology",
          number: "2.1",
          title: "Definition and Terminology",
          hook: "A differential equation describes a relationship between a quantity and its rates of change.",
          prerequisites: ["0.1 Differentiation"],
          formulas: [m`F(x,y,y',\ldots,y^{(n)})=0`, m`Linear:\ a_n(x)y^{(n)}+\cdots+a_1(x)y'+a_0(x)y=g(x)`],
          theory: ["ODE means one independent variable; PDE means two or more.", "Order is the highest derivative. Linear means y and derivatives appear to first power only."],
          examples: odeIntroExamples,
          practice: [
            pr("Classify", m`y''+\sin y=0`, "Look at sin y.", [step(m`Order=2`, "Highest derivative is second."), step(m`Nonlinear`, "sin y is nonlinear in y.")], "classification"),
            pr("Verify", m`y'=3y,\quad y=Ce^{3x}`, "Differentiate and compare.", [step(m`y'=3Ce^{3x}`, "Differentiate."), step(m`3y=3Ce^{3x}`, "Right side matches.")], "verification")
          ],
          recap: ["Order is highest derivative.", "Linearity is about y, not x.", "Verification is substitution after differentiating."]
        },
        {
          id: "ivp",
          number: "2.2",
          title: "Initial Value Problems",
          hook: "An IVP picks the one curve that passes through your starting measurement.",
          prerequisites: ["2.1 Definition and Terminology"],
          formulas: [m`n^{th}\ order\ ODE\ needs\ n\ initial\ conditions`, m`Solution\ interval:\ largest\ interval\ containing\ the\ initial\ point`],
          theory: ["Use initial conditions to solve for constants.", "Always check where the solution is undefined."],
          examples: ivpExamples,
          practice: [
            pr("Exercise 1.2 #3", m`y=\frac{1}{x^2+c},\ y(2)=\frac13`, "Solve for c, then find breaks.", [step(m`\frac13=\frac{1}{4+c}\Rightarrow c=-1`, "Solve for c."), step(m`y=\frac{1}{x^2-1}`, "Solution."), step(m`Breaks\ at\ x=\pm1;\ initial\ x=2`, "Find interval."), step(m`I=(1,\infty)`, "Largest interval containing 2.")], "IVP", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 9,
              section: "1.2",
              label: "Exercise 3",
              type: "pdf-assigned-exercise",
              status: "verified"
            }),
            pr("Exercise 1.2 #4", m`y' + 2xy^2 = 0,\ y(-2) = \frac{1}{2}`, "Separate variables first to find the general solution.", [
              step(m`\frac{dy}{y^2} = -2x\,dx`, "Separate variables."),
              step(m`-\frac{1}{y} = -x^2 + C \implies y = \frac{1}{x^2 - C}`, "Integrate both sides."),
              step(m`\frac{1}{2} = \frac{1}{4 - C} \implies C = 2`, "Apply initial condition y(-2) = 1/2."),
              step(m`y = \frac{1}{x^2 - 2}`, "Write the particular solution."),
              step(m`I = (-\infty, -\sqrt{2})`, "Find the largest interval of existence containing x = -2 (must avoid x = -sqrt(2)).")
            ], "IVP", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 9,
              section: "1.2",
              label: "Exercise 4",
              type: "pdf-assigned-exercise",
              status: "verified"
            }),
            pr("Exercise 1.2 #7", m`x=c_1\cos t+c_2\sin t,\ x(0)=-1,\ x'(0)=8`, "Evaluate x and x' at 0.", [step(m`x(0)=c_1=-1`, "First condition."), step(m`x'=-c_1\sin t+c_2\cos t`, "Differentiate."), step(m`x'(0)=c_2=8`, "Second condition."), step(m`x=-\cos t+8\sin t`, "Solution.")], "IVP", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 9,
              section: "1.2",
              label: "Exercise 7",
              type: "pdf-assigned-exercise",
              status: "verified"
            }),
            pr("Exercise 1.2 #8", m`x'' + x = 0,\ x(\pi/2) = 0,\ x'(\pi/2) = 1`, "Use the general solution x(t) = c_1\cos t + c_2\sin t.", [
              step(m`x(t) = c_1\cos t + c_2\sin t`, "General solution of the second-order ODE."),
              step(m`x(\pi/2) = c_2 = 0`, "Apply the first initial condition."),
              step(m`x'(t) = -c_1\sin t + c_2\cos t`, "Find the derivative of x(t)."),
              step(m`x'(\pi/2) = -c_1 = 1 \implies c_1 = -1`, "Apply the second initial condition."),
              step(m`x(t) = -\cos t`, "Substitute the constants back to get the particular solution.")
            ], "IVP", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 9,
              section: "1.2",
              label: "Exercise 8",
              type: "pdf-assigned-exercise",
              status: "verified"
            })
          ],
          recap: ["Constants come from initial data.", "Intervals cannot cross discontinuities.", "Second-order problems need two conditions."]
        },
        {
          id: "models",
          number: "2.3",
          title: "Differential Equations as Models",
          hook: "ODEs become useful when a sentence like 'rate is proportional to amount' becomes an equation.",
          prerequisites: ["2.1 Definition and Terminology"],
          formulas: modelRows.map((row) => row[1]),
          theory: [
            "Identify variables, parameters, assumptions, and units before writing an equation.",
            "Translate rate language into derivatives.",
            "For mechanics, declare the coordinate convention before assigning signs. This course uses upward-positive height unless a problem explicitly says otherwise."
          ],
          examples: [
            ex("Mixing model from Chapter 1.3", m`300\ gal,\ inflow=3\ gal/min,\ 2\ lb/gal`, [
              step(m`R_{in}=2\cdot3=6\ lb/min`, "Incoming salt rate."),
              step(m`R_{out}=\frac{A(t)}{300}\cdot3=\frac{A}{100}`, "Outgoing concentration times flow rate."),
              step(m`\frac{dA}{dt}=6-\frac{A}{100}`, "Rate in minus rate out."),
              step(m`\frac{dA}{dt}+\frac{A}{100}=6`, "Linear first-order model.")
            ], "Mixing models are bookkeeping: in minus out.", "Chapter 1.3", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 20,
              pages: [20, 21],
              section: "1.3.7",
              label: "Mixtures model",
              type: "pdf-theory",
              status: "verified"
            }),
            ex("Logistic population model", m`\frac{dP}{dt}=aP-bP^2`, [
              step(m`aP`, "Growth proportional to current population."),
              step(m`-bP^2`, "Competition slows growth as population increases."),
              step(m`K=\frac{a}{b}`, "Carrying capacity occurs where aP-bP^2=0 for P>0.")
            ], "Logistic growth is more realistic than unlimited exponential growth.", "Chapter 1.3", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 14,
              pages: [14, 15, 16],
              section: "1.3.2",
              label: "Logistic population model",
              type: "pdf-theory",
              status: "verified"
            }),
            ex("Falling-body sign convention", m`h(t)=height,\ upward\ positive`, [
              step(m`m h''=-mg-kh'`, "Gravity and drag oppose upward-positive motion."),
              step(m`m h''+kh'=-mg`, "Collect the drag term on the left."),
              step(m`k=0\Rightarrow h''=-g`, "Without drag, acceleration is downward."),
              step(m`h(t)=h_0+v_0t-\frac12gt^2`, "Integrate twice and apply the initial height and velocity.")
            ], "Choose a coordinate direction once; consistent signs then follow automatically.", "Chapter 1.3", {
              pdf: "Chapter 01_ODE_new02.pdf",
              page: 23,
              section: "1.3.9",
              label: "Falling bodies",
              type: "corrected-pdf-error",
              status: "verified",
              note: "The PDF mixes upward-positive and downward-positive equations and prints v₀ without the required factor t in one position formula. This card uses a consistent upward-positive convention."
            })
          ],
          modelRows,
          practice: [
            pr("Newton cooling setup", m`Coffee\ at\ T,\ room\ at\ T_m`, "Rate is proportional to temperature difference.", [step(m`\frac{dT}{dt}=a(T-T_m)`, "Newton's law."), step(m`a<0\ for\ cooling`, "If T>Tm, derivative should be negative.")], "modeling"),
            pr("Disease setup", m`x(t)=infected,\ n=total`, "New infections depend on infected and susceptible.", [step(m`susceptible=n-x`, "People not yet exposed."), step(m`\frac{dx}{dt}=ax(n-x)`, "Contact model.")], "modeling")
          ],
          recap: ["Models come from assumptions.", "Units help catch errors.", "Most first-order models become separable or linear later."]
        }
      ]
    },
    {
      id: "module-3",
      title: "Module 3: First-Order ODE Methods",
      description: "Core Chapter 2 solving methods.",
      topics: [
        {
          id: "ode-separable",
          number: "3.1",
          title: "Separable Variables",
          hook: "If you can put all y terms with dy and all x terms with dx, the ODE becomes two integrals.",
          prerequisites: ["0.2 Integration"],
          formulas: [m`\frac{dy}{dx}=g(x)h(y)\Rightarrow \frac{1}{h(y)}dy=g(x)dx`],
          theory: ["Not every first-order ODE is separable. dy/dx=x^2+y is not separable.", "After integration, use initial conditions if given."],
          examples: separableExamples,
          practice: [
            pr("Separate and solve", m`\frac{dy}{dx}=xy`, "Move y under dy.", [step(m`\frac{dy}{y}=x dx`, "Separate."), step(m`\ln|y|=\frac{x^2}{2}+C`, "Integrate."), step(m`y=Ce^{x^2/2}`, "Solve.")], "separable"),
            pr("IVP", m`\frac{dy}{dx}=2xy,\ y(0)=5`, "Use the general separable solution.", [step(m`y=Ce^{x^2}`, "Solve separable equation."), step(m`5=C`, "Use y(0)=5."), step(m`y=5e^{x^2}`, "Final.")], "separable")
          ],
          recap: ["Separate first, integrate second.", "Use ln C to simplify exponentials.", "Check if variables truly separate."]
        },
        {
          id: "ode-linear",
          number: "3.2",
          title: "Linear Equations",
          hook: "A linear first-order ODE is solved by multiplying by a magic factor that makes the left side one derivative.",
          prerequisites: ["3.1 Separable Variables"],
          formulas: [m`y'+P(x)y=f(x)`, m`\mu(x)=e^{\int P(x)\,dx}`, m`\frac{d}{dx}[\mu y]=\mu f(x)`],
          theory: ["First force standard form.", "Then compute the integrating factor and integrate once."],
          examples: linearExamples,
          practice: [
            pr("Linear solve", m`y'+2y=e^x`, "P(x)=2.", [step(m`\mu=e^{2x}`, "Integrating factor."), step(m`\frac{d}{dx}(e^{2x}y)=e^{3x}`, "Multiply."), step(m`e^{2x}y=\frac13e^{3x}+C`, "Integrate."), step(m`y=\frac13e^x+Ce^{-2x}`, "Solve.")], "linear"),
            pr("Standard form first", m`xy'+2y=x^2`, "Divide by x.", [step(m`y'+\frac{2}{x}y=x`, "Standard form."), step(m`\mu=x^2`, "Integrating factor."), step(m`\frac{d}{dx}(x^2y)=x^3`, "Multiply."), step(m`x^2y=\frac{x^4}{4}+C`, "Integrate."), step(m`y=\frac{x^2}{4}+\frac{C}{x^2}`, "Solve.")], "linear")
          ],
          recap: ["Standard form first.", "Integrating factor creates product derivative.", "Initial point determines interval sign choices."]
        },
        {
          id: "ode-exact",
          number: "3.3",
          title: "Exact Equations",
          hook: "Exact equations are like finding the hidden landscape whose differential is the equation.",
          prerequisites: ["0.1 Differentiation", "Partial-derivative mini-review on this page"],
          formulas: [m`M(x,y)dx+N(x,y)dy=0`, m`\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}`, m`f(x,y)=C`],
          theory: [
            "Mini-review: M_y means differentiate M with respect to y while holding x fixed; N_x means differentiate N with respect to x while holding y fixed.",
            "Check exactness by comparing M_y and N_x before solving.",
            "Integrate M with respect to x, then use N to find the missing g(y)."
          ],
          examples: exactExamples,
          practice: [
            pr("Exact check", m`(2x+y)dx+(x+3y^2)dy=0`, "Compare M_y and N_x.", [step(m`M_y=1,\ N_x=1`, "Exact."), step(m`f=\int(2x+y)dx=x^2+xy+g(y)`, "Integrate M."), step(m`f_y=x+g'(y)=x+3y^2`, "Match N."), step(m`g=y^3`, "Integrate."), step(m`x^2+xy+y^3=C`, "Solution.")], "exact"),
            pr("Not exact", m`ydx+2xdy=0`, "Check first.", [step(m`M_y=1,\ N_x=2`, "Not exact."), step(m`Try\ another\ method\ or\ integrating\ factor`, "Do not force exact method.")], "exact")
          ],
          recap: ["Exactness is a partial-derivative test.", "Solution is implicit f(x,y)=C.", "Integrating factors can rescue some non-exact equations."]
        },
        {
          id: "ode-bernoulli",
          number: "3.4",
          title: "Bernoulli Equations",
          hook: "Bernoulli equations look nonlinear, but one substitution turns them into linear equations.",
          prerequisites: ["3.2 Linear Equations"],
          formulas: [m`y'+P(x)y=f(x)y^n`, m`u=y^{1-n}`],
          theory: ["n=0 or n=1 is already linear.", "For other n, substitute u=y^(1-n), then solve the new linear ODE."],
          examples: bernoulliExamples,
          practice: [
            pr("Bernoulli setup", m`y'+y=xy^2`, "n=2 and u=1/y.", [step(m`u=y^{-1}`, "Substitution."), step(m`u'=-y^{-2}y'`, "Derivative."), step(m`u'-u=-x`, "Linear equation after substituting.")], "Bernoulli"),
            pr("Identify Bernoulli", m`y'+\frac{2}{x}y=x^3y^4`, "Compare with y'+P y=f y^n.", [step(m`P=2/x,\ f=x^3,\ n=4`, "It is Bernoulli."), step(m`u=y^{1-4}=y^{-3}`, "Substitution.")], "Bernoulli")
          ],
          recap: ["Identify n.", "Use u=y^(1-n).", "Then solve a linear equation."]
        },
        {
          id: "ode-linear-models",
          number: "3.5",
          title: "Linear Models",
          hook: "From population growth to cooling cakes and series circuits, linear models apply first-order ODEs to real-world rates.",
          prerequisites: ["3.1 Separable Variables", "3.2 Linear Equations"],
          formulas: [
            m`\frac{dp}{dt} = ap \quad (\text{Malthusian population growth})`,
            m`\frac{dT}{dt} = a(T - T_m) \quad (\text{Newton's law of cooling})`,
            m`L\frac{di}{dt} + Ri = E(t) \quad (\text{LR series circuit})`,
            m`R\frac{dq}{dt} + \frac{1}{C}q = E(t) \quad (\text{RC series circuit})`
          ],
          theory: [
            "Malthusian growth models population change as rate proportional to population itself.",
            "Newton's law of cooling/warming states that rate of temperature change of an object is proportional to the difference between its temperature and ambient temperature.",
            "Kirchhoff's second law for series circuits models inductance and resistance as a linear first-order differential equation in current i(t) or charge q(t)."
          ],
          examples: linearModelsExamples,
          practice: [
            pr(
              "Exercise 1",
              m`\text{Initial population } P_0 \text{ doubles in 5 years. How long will it take to triple? To quadruple? Growth rate is proportional to population.}`,
              "Use the Malthusian growth model P(t) = P_0 e^{at} and solve for a using P(5) = 2P_0.",
              [
                step(m`P(t) = P_0 e^{at}`, "General solution of Malthusian growth ODE."),
                step(m`P(5) = P_0 e^{5a} = 2P_0 \implies e^{5a} = 2 \implies a = \frac{\ln 2}{5}`, "Use the doubling time of 5 years to find growth constant a."),
                step(m`P(t) = P_0 e^{\frac{\ln 2}{5}t}`, "Write the particular solution."),
                step(m`P(t) = 3P_0 \implies e^{\frac{\ln 2}{5}t} = 3 \implies t = \frac{5\ln 3}{\ln 2} \approx 7.92\text{ years}`, "Solve for the tripling time."),
                step(m`P(t) = 4P_0 \implies e^{\frac{\ln 2}{5}t} = 4 \implies t = \frac{5\ln 4}{\ln 2} = 10\text{ years}`, "Solve for the quadrupling time.")
              ],
              "separable",
              { pdf: "Chapter 3_ODE.pdf", page: 3, section: "3.1", label: "Exercise 1", type: "pdf-assigned-exercise", status: "verified" }
            ),
            pr(
              "Exercise 2",
              m`\text{If the population in Exercise 1 is 10,000 after 3 years, what was the initial population } P_0\text{? What is } P(10)\text{? How fast is it growing at } t=10\text{?}`,
              "Apply P(3) = 10,000 to find P_0, then evaluate P(10) and P'(10).",
              [
                step(m`P(3) = P_0 e^{\frac{3\ln 2}{5}} = 10,000 \implies P_0 = 10,000 \cdot 2^{-3/5} \approx 6598`, "Solve for the initial population P_0."),
                step(m`P(t) = 6598 e^{\frac{\ln 2}{5}t}`, "Write the population function with the initial population coefficient."),
                step(m`P(10) = 6598 e^{2\ln 2} = 6598 \cdot 4 = 26,392`, "Evaluate the population at t=10."),
                step(m`P'(10) = \frac{\ln 2}{5} P(10) \approx 0.13863 \cdot 26,392 \approx 3659\text{ persons/year}`, "Calculate the growth rate dP/dt at t=10 using dP/dt = aP.")
              ],
              "separable",
              { pdf: "Chapter 3_ODE.pdf", page: 4, section: "3.1", label: "Exercise 2", type: "pdf-assigned-exercise", status: "verified" }
            ),
            pr(
              "Exercise 15",
              m`\text{A small metal bar, initial temperature } 20^\circ\text{C, is dropped in boiling water (} 100^\circ\text{C). It increases } 2^\circ\text{ in 1 second. How long to reach } 90^\circ\text{C? } 98^\circ\text{C?}`,
              "Solve Newton's Law of Cooling/Warming dT/dt = a(T - T_m) with T_m = 100 and T(0) = 20.",
              [
                step(m`\frac{dT}{dt} = a(T - 100) \implies T(t) = 100 - 80 e^{at}`, "Set up Newton cooling equation and solve using T(0) = 20."),
                step(m`T(1) = 100 - 80 e^a = 22 \implies e^a = \frac{78}{80} = \frac{39}{40}`, "Use T(1) = 22 to find the cooling constant exponent base."),
                step(m`a = \ln\left(\frac{39}{40}\right) \approx -0.0253 \implies T(t) = 100 - 80 e^{-0.0253t}`, "Calculate a and write the particular solution."),
                step(m`T(t) = 90 \implies 100 - 80 e^{-0.0253t} = 90 \implies e^{-0.0253t} = 0.125 \implies t = \frac{\ln 8}{0.0253} \approx 82.19\text{ s}`, "Find time to reach 90°C."),
                step(m`T(t) = 98 \implies 100 - 80 e^{-0.0253t} = 98 \implies e^{-0.0253t} = 0.025 \implies t = \frac{\ln 40}{0.0253} \approx 145.8\text{ s}`, "Find time to reach 98°C.")
              ],
              "separable",
              { pdf: "Chapter 3_ODE.pdf", page: 7, section: "3.1", label: "Exercise 15", type: "pdf-assigned-exercise", status: "verified" }
            ),
            pr(
              "Exercise 29",
              m`\text{Apply } 30\text{-volt EMF to an LR series circuit where } L = 0.1\text{ H, } R = 50\ \Omega\text{, and } i(0) = 0\text{. Find current } i(t)\text{ and limit as } t \to \infty.`,
              "Solve 0.1 di/dt + 50i = 30 using standard linear ODE steps.",
              [
                step(m`0.1\frac{di}{dt} + 50i = 30 \implies \frac{di}{dt} + 500i = 300`, "Write in standard form by dividing by L."),
                step(m`\mu(t) = e^{500t} \implies \frac{d}{dt}[i e^{500t}] = 300 e^{500t}`, "Find integrating factor and multiply standard form."),
                step(m`i(t) e^{500t} = 0.6 e^{500t} + C \implies i(t) = 0.6 + C e^{-500t}`, "Integrate and solve for general current."),
                step(m`i(0) = 0.6 + C = 0 \implies C = -0.6 \implies i(t) = 0.6(1 - e^{-500t})`, "Apply initial condition i(0) = 0."),
                step(m`t \to \infty \implies i(t) \to 0.6\text{ A}`, "Evaluate the steady-state current as t goes to infinity.")
              ],
              "linear",
              { pdf: "Chapter 3_ODE.pdf", page: 11, section: "3.1", label: "Exercise 29", type: "pdf-assigned-exercise", status: "verified" }
            )
          ],
          recap: [
            "Translate rates of growth, cooling, or voltage drops into standard differential equations.",
            "Identify constants and initial conditions to obtain particular solutions.",
            "Linear models are solved using separable variable integration or standard integrating factors."
          ]
        }
      ]
    },
    {
      id: "module-4",
      title: "Module 4: Partial Derivatives",
      description: "Chapter 13 tools needed for exact equations and multivariable calculus.",
      topics: [
        {
          id: "functions-many-vars",
          number: "4.1",
          title: "Functions of Two or More Variables",
          hook: "A two-variable function is a surface: two inputs go in, one height comes out.",
          prerequisites: ["Algebra"],
          formulas: [m`z=f(x,y)`, m`Level\ curve:\ f(x,y)=k`],
          theory: ["Natural domains combine all algebraic restrictions.", "Level curves are map contours."],
          examples: ch13_1_Examples,
          practice: [
            pr("Domain", m`f(x,y)=\sqrt{x-y}+\ln y`, "Need x-y>=0 and y>0.", [step(m`x-y\ge0\Rightarrow y\le x`, "Square root."), step(m`y>0`, "Log."), step(m`Domain=\{(x,y):0<y\le x\}`, "Combine.")], "domain"),
            pr("Level curve", m`f(x,y)=x^2+y^2,\ k=9`, "Set f=k.", [step(m`x^2+y^2=9`, "Circle radius 3.")], "level curve")
          ],
          recap: ["Domains are intersections.", "Level curves set output constant.", "Graphs become surfaces."]
        },
        {
          id: "limits-continuity",
          number: "4.2",
          title: "Limits and Continuity",
          hook: "In two variables, approaching a point from different paths can reveal different limiting behavior.",
          prerequisites: ["4.1 Functions of Two or More Variables"],
          formulas: [m`\lim_{(x,y)\to(a,b)}f(x,y)=L`, m`Different\ path\ limits\Rightarrow DNE`],
          theory: ["If two paths give different limits, the overall limit does not exist.", "If all path tests agree, that suggests a limit but does not prove it by itself."],
          examples: ch13_2_Examples,
          practice: [
            pr("Path test", m`f(x,y)=\frac{x^2-y^2}{x^2+y^2}`, "Try y=0 and x=0.", [step(m`y=0:\ f=1`, "Along x-axis."), step(m`x=0:\ f=-1`, "Along y-axis."), step(m`Limit\ DNE`, "Different values.")], "limit"),
            pr("Polar coordinates limit", m`\lim_{(x,y)\to(0,0)}\frac{x^3+y^3}{x^2+y^2}`, "Convert to polar coordinates: x = r\cos\theta, y = r\sin\theta.", [
              step(m`\lim_{r\to0^+}\frac{r^3\cos^3\theta+r^3\sin^3\theta}{r^2}`, "Substitute polar variables."),
              step(m`\lim_{r\to0^+}r(\cos^3\theta+\sin^3\theta)`, "Simplify by dividing by r^2."),
              step(m`0`, "Since the trigonometric part is bounded, the limit as r approaches 0 is 0.")
            ], "limit")
          ],
          recap: ["Path disagreement proves DNE.", "Continuity requires value and limit to match.", "Multivariable limits are stricter than one-variable limits."]
        },
        {
          id: "partial-derivatives",
          number: "4.3",
          title: "Partial Derivatives",
          hook: "A partial derivative freezes all but one input and asks for the rate in that direction.",
          prerequisites: ["0.1 Differentiation"],
          formulas: [m`f_x=\frac{\partial f}{\partial x}`, m`f_y=\frac{\partial f}{\partial y}`, m`f_{xy}=\frac{\partial}{\partial y}(f_x)`],
          theory: ["Treat the other variable as a constant.", "Partial derivatives existing does not automatically imply continuity."],
          examples: ch13_3_Examples,
          practice: [
            pr("Compute partials", m`f(x,y)=x^2\sin y+y^3`, "For f_x, y is constant. For f_y, x is constant.", [step(m`f_x=2x\sin y`, "Differentiate x only."), step(m`f_y=x^2\cos y+3y^2`, "Differentiate y only.")], "partials"),
            pr("Second partials", m`f=x^2y+xy^2`, "Differentiate twice.", [step(m`f_x=2xy+y^2`, "First x."), step(m`f_{xy}=2x+2y`, "Then y.")], "partials")
          ],
          recap: ["Freeze other variables.", "Second partial notation matters.", "Use partials for exact equations."]
        },
        {
          id: "chain-rule",
          number: "4.4",
          title: "The Chain Rule",
          hook: "The multivariable chain rule adds every route by which a variable can affect another.",
          prerequisites: ["4.3 Partial Derivatives"],
          formulas: [m`\frac{dz}{dt}=f_x\frac{dx}{dt}+f_y\frac{dy}{dt}`, m`\frac{dy}{dx}=-\frac{F_x}{F_y}`],
          theory: ["Draw dependency arrows if you feel lost.", "Implicit differentiation is a chain-rule application."],
          examples: ch13_5_Examples,
          practice: [
            pr("Chain rule", m`z=xy^2,\ x=t,\ y=t^2`, "Compute z_x, z_y, x', y'.", [step(m`z_x=y^2,\ z_y=2xy`, "Partials."), step(m`x'=1,\ y'=2t`, "Derivatives."), step(m`dz/dt=y^2+2xy(2t)=t^4+4t^4=5t^4`, "Substitute.")], "chain rule"),
            pr("Implicit", m`x^2+y^2=10`, "Use -Fx/Fy.", [step(m`F_x=2x,\ F_y=2y`, "Partials."), step(m`dy/dx=-x/y`, "Formula.")], "implicit differentiation")
          ],
          recap: ["Follow every dependency path.", "Implicit derivative = -Fx/Fy.", "Check by direct substitution when possible."]
        },
        {
          id: "directional-gradients",
          number: "4.5",
          title: "Directional Derivatives and Gradients",
          hook: "The gradient is the compass arrow pointing uphill fastest.",
          prerequisites: ["4.3 Partial Derivatives"],
          formulas: [m`D_uf=\nabla f\cdot u`, m`\nabla f=(f_x,f_y)`, m`max\ D_uf=|\nabla f|`],
          theory: ["Direction vectors must be unit vectors.", "For a differentiable function, the directional derivative is the gradient dot the unit direction.", "Maximum increase occurs in the gradient direction; maximum decrease occurs in the opposite direction."],
          examples: ch13_6_Examples,
          practice: [
            pr("Directional derivative", m`f=x^2+y^2,\ P=(1,2),\ u=(3/5,4/5)`, "Gradient dot u.", [step(m`\nabla f=(2x,2y)=(2,4)`, "Gradient."), step(m`D_uf=(2,4)\cdot(3/5,4/5)=22/5`, "Dot product.")], "gradient"),
            pr("Max direction", m`f=xy,\ P=(2,3)`, "Gradient gives direction.", [step(m`\nabla f=(y,x)=(3,2)`, "Gradient."), step(m`max=|\nabla f|=\sqrt{13}`, "Magnitude."), step(m`u=(3,2)/\sqrt{13}`, "Unit direction.")], "gradient")
          ],
          recap: ["Normalize direction vectors.", "Dot product gives directional rate.", "Gradient magnitude is steepest slope."]
        },
        {
          id: "tangent-planes",
          number: "4.6",
          title: "Tangent Planes and Normal Vectors",
          hook: "A tangent plane is the local flat approximation to a surface.",
          prerequisites: ["4.5 Directional Derivatives and Gradients"],
          formulas: [m`\nabla F(P)\cdot\langle x-x_0,y-y_0,z-z_0\rangle=0`, m`Normal\ line:\ r(t)=P+t\nabla F(P)`],
          theory: ["For F=0, the gradient is normal to the surface.", "For z=f(x,y), set F=z-f(x,y)."],
          examples: ch13_7_Examples,
          practice: [
            pr("Exercise 13.7 #1: ellipsoid", m`x^2+y^2+4z^2=12,\quad P=(2,2,1)`, "Use the gradient for the plane and normal line; compare its normal with k for the plane angle.", [
              step(m`\nabla F(P)=(4,4,8)\sim(1,1,2)`, "The gradient is a normal vector; scaling it does not change the plane or line direction."),
              step(m`(x-2)+(y-2)+2(z-1)=0\Rightarrow x+y+2z=6`, "Use point-normal form and simplify."),
              step(m`x=2+t,\quad y=2+t,\quad z=1+2t`, "Use the simplified normal direction for the normal line."),
              step(m`\cos\theta=\frac{2}{\sqrt6}\Rightarrow\theta\approx35.3^\circ`, "The acute plane angle equals the acute angle between normal vectors.")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 48, section: "13.7", label: "Exercise 1", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Exercise 13.7 #2: implicit surface", m`xz-yz^3+yz^2=2,\quad P=(2,-1,1)`, "Write F=xz-yz^3+yz^2-2 and evaluate its gradient.", [
              step(m`\nabla F=(z,\ -z^3+z^2,\ x-3yz^2+2yz)`, "Differentiate F with respect to x, y, and z."),
              step(m`\nabla F(2,-1,1)=(1,0,3)`, "Evaluate at the given point."),
              step(m`(x-2)+3(z-1)=0\Rightarrow x+3z=5`, "Use point-normal form."),
              step(m`x=2+t,\quad y=-1,\quad z=1+3t`, "The normal line follows the gradient."),
              step(m`\cos\theta=\frac{3}{\sqrt{10}}\Rightarrow\theta\approx18.4^\circ`, "Compare the surface normal with the xy-plane normal.")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 48, section: "13.7", label: "Exercise 2", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Exercise 13.7 #3: sphere", m`x^2+y^2+z^2=25,\quad P=(-3,0,4)`, "The sphere gradient is radial.", [
              step(m`\nabla F(P)=(-6,0,8)\sim(-3,0,4)`, "Evaluate and simplify the normal vector."),
              step(m`-3(x+3)+4(z-4)=0\Rightarrow -3x+4z=25`, "Use point-normal form."),
              step(m`x=-3-3t,\quad y=0,\quad z=4+4t`, "Use the same normal direction for the line.")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 49, section: "13.7", label: "Exercise 3", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Exercise 13.7 #5: mixed-product surface", m`x^2-xyz=56,\quad P=(-4,5,2)`, "Move 56 to the left, then differentiate the xyz product carefully.", [
              step(m`\nabla F=(2x-yz,\ -xz,\ -xy)`, "Differentiate F=x²-xyz-56."),
              step(m`\nabla F(-4,5,2)=(-18,8,20)\sim(-9,4,10)`, "Evaluate and simplify by 2."),
              step(m`-9(x+4)+4(y-5)+10(z-2)=0\Rightarrow -9x+4y+10z=76`, "Form and simplify the tangent plane."),
              step(m`x=-4-9t,\quad y=5+4t,\quad z=2+10t`, "Use the simplified normal direction.")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 49, section: "13.7", label: "Exercise 5", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Exercise 13.7 #10: logarithmic surface", m`z=\ln\sqrt{x^2+y^2},\quad P=(-1,0,0)`, "Rewrite as one-half ln(x²+y²), then find f_x and f_y.", [
              step(m`f_x=\frac{x}{x^2+y^2},\quad f_y=\frac{y}{x^2+y^2}`, "Differentiate the logarithmic surface."),
              step(m`f_x(-1,0)=-1,\quad f_y(-1,0)=0`, "Evaluate the slopes."),
              step(m`z=-1(x+1)\Rightarrow x+z=-1`, "Use z-z₀=f_x(x-x₀)+f_y(y-y₀)."),
              step(m`x=-1+t,\quad y=0,\quad z=t`, "A normal direction is (1,0,1).")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 49, section: "13.7", label: "Exercise 10", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Exercise 13.7 #11: exponential-trig surface", m`z=e^{3y}\sin3x,\quad P=(\pi/6,0,1)`, "Differentiate with respect to x and y before evaluating.", [
              step(m`f_x=3e^{3y}\cos3x,\quad f_y=3e^{3y}\sin3x`, "Apply chain and product structure."),
              step(m`f_x(P)=0,\quad f_y(P)=3`, "At x=pi/6, cos(pi/2)=0 and sin(pi/2)=1."),
              step(m`z-1=3y\Rightarrow z=3y+1`, "Use the explicit-surface tangent-plane formula."),
              step(m`x=\frac{\pi}{6},\quad y=-3t,\quad z=1+t`, "A normal direction is (0,-3,1).")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 49, section: "13.7", label: "Exercise 11", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Exercise 13.7 #12: square-root surface", m`z=\sqrt{x}+\sqrt{y},\quad P=(4,9,5)`, "Evaluate the reciprocal-square-root partial derivatives.", [
              step(m`f_x=\frac{1}{2\sqrt{x}},\quad f_y=\frac{1}{2\sqrt{y}}`, "Differentiate each square root."),
              step(m`f_x(4,9)=\frac14,\quad f_y(4,9)=\frac16`, "Evaluate at (4,9)."),
              step(m`z-5=\frac14(x-4)+\frac16(y-9)\Rightarrow 3x+2y-12z+30=0`, "Form the plane and clear denominators."),
              step(m`x=4+3t,\quad y=9+2t,\quad z=5-12t`, "A normal direction is (3,2,-12).")
            ], "tangent plane", {
              pdf: "Chapter 13.pdf", page: 49, section: "13.7", label: "Exercise 12", type: "pdf-assigned-exercise", status: "verified"
            }),
            pr("Plane to sphere", m`x^2+y^2+z^2=14,\ P=(1,2,3)`, "Gradient is normal.", [step(m`\nabla F=(2,4,6)`, "Evaluate gradient."), step(m`2(x-1)+4(y-2)+6(z-3)=0`, "Tangent plane.")], "tangent plane"),
            pr("Plane to explicit surface", m`z=x^2-3xy+y^2,\ P=(2,1,-1)`, "Compute partial derivatives f_x and f_y at (2,1).", [
              step(m`f_x = 2x-3y \implies f_x(2,1) = 1`, "Find x-partial derivative and evaluate."),
              step(m`f_y = -3x+2y \implies f_y(2,1) = -4`, "Find y-partial derivative and evaluate."),
              step(m`z - z_0 = f_x(P)(x-x_0) + f_y(P)(y-y_0)`, "Use the tangent plane formula for explicit surfaces."),
              step(m`z + 1 = 1(x-2) - 4(y-1) \implies x-4y-z=1`, "Substitute the values and simplify.")
            ], "tangent plane")
          ],
          recap: ["Gradient is the normal vector.", "Use point-normal plane form.", "Normal line uses the same vector."]
        },
        {
          id: "maxima-minima",
          number: "4.7",
          title: "Maxima and Minima",
          hook: "Critical points are flat spots; the second derivative test tells hill, bowl, or saddle.",
          prerequisites: ["4.3 Partial Derivatives"],
          formulas: [m`f_x=0,\quad f_y=0`, m`D=f_{xx}f_{yy}-(f_{xy})^2`, m`D>0,f_{xx}<0:\ max;\quad D>0,f_{xx}>0:\ min;\quad D<0:\ saddle`],
          theory: ["Relative extrema compare nearby points; absolute extrema compare the whole domain.", "A continuous function on a closed, bounded region attains an absolute maximum and minimum.", "Solve f_x=f_y=0, and also check points where either first partial does not exist.", "Classify interior critical points using D; when D=0, the test is inconclusive."],
          examples: ch13_8_Examples,
          practice: [
            pr("Classify", m`f=x^2+y^2`, "Find critical point and D.", [step(m`f_x=2x,\ f_y=2y\Rightarrow (0,0)`, "Critical point."), step(m`f_{xx}=2,\ f_{yy}=2,\ f_{xy}=0,\ D=4`, "Second partials."), step(m`D>0,\ f_{xx}>0\Rightarrow relative\ minimum`, "Classify.")], "max/min"),
            pr("Saddle", m`f=x^2-y^2`, "Second derivative test.", [step(m`(0,0)`, "Critical point."), step(m`D=(2)(-2)-0=-4<0`, "Discriminant."), step(m`saddle`, "Classify.")], "max/min")
          ],
          recap: ["Critical points solve both first partials zero.", "D classifies the point.", "D=0 means inconclusive."]
        }
      ]
    }
  ];

  const formulas = modules.flatMap((module) =>
    module.topics.flatMap((topic) =>
      (topic.formulas || []).map((formula) => ({
        module: module.title,
        topic: topic.title,
        formula,
        priority: topic.number.startsWith("3") ? "Must Memorize" : "Good to Know"
      }))
    )
  );

  formulas.push(
    { module: "Study Strategy", topic: "Method Recognition", formula: m`Worked\ example\rightarrow cover\ solution\rightarrow mixed\ practice`, priority: "Must Memorize" },
    { module: "Study Strategy", topic: "Spaced Review", formula: m`Review:\ same\ day,\ next\ day,\ 3\ days,\ 7\ days`, priority: "Good to Know" }
  );

  const mixedPractice = modules.flatMap((module) =>
    module.topics.flatMap((topic) =>
      (topic.practice || []).map((item) => ({
        topicId: topic.id,
        topic: topic.title,
        problem: item.problem,
        method: item.method,
        hint: item.hint,
        steps: item.steps
      }))
    )
  );

  const chip = (id, label) => ({ id, label });

  const examSprint = [
    {
      day: 1,
      title: "Rebuild the integration engine",
      timeBox: "2.5–3 hours",
      why: "Most later exam questions punish weak algebra and integration before they punish ODE theory.",
      tasks: [
        "Warm up with differentiation and basic antiderivatives for 20 minutes.",
        "Study integration quick review, then write the core antiderivative table from memory.",
        "Work Chapter 7.2 integration by parts examples on paper before revealing the next step.",
        "Do one trig-integral example slowly and name the identity that unlocks it.",
        "End with 10 mixed-practice method IDs; do not reveal solutions until you commit to a method."
      ],
      routes: [
        chip("calc-integration", "Integration rescue"),
        chip("integration-by-parts", "By parts"),
        chip("trig-integrals", "Trig integrals"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: on paper, solve one by-parts integral and explain why your choice of u makes the remaining integral easier."
    },
    {
      day: 2,
      title: "Finish Chapter 7 exam techniques",
      timeBox: "3–3.5 hours",
      why: "Trig substitution and partial fractions are the integration moves that most often block first-order ODE solutions.",
      tasks: [
        "Review the three trig-substitution radical patterns and draw the matching triangle once.",
        "Work the PDF-aligned trig-substitution examples, especially the arc-length and completing-square patterns.",
        "Study partial fractions by factor type: distinct linear, repeated linear, irreducible quadratic, and improper rational.",
        "Write each partial-fraction setup before looking at coefficients.",
        "Finish with formula-sheet recall: hide formulas, write the Chapter 7 formulas in your notebook, then reveal."
      ],
      routes: [
        chip("trig-substitution", "Trig substitution"),
        chip("partial-fractions", "Partial fractions"),
        chip("formulas", "Formula recall"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: classify three unseen integrals by method before solving any of them."
    },
    {
      day: 3,
      title: "ODE language and solution checking",
      timeBox: "2–2.5 hours",
      why: "Exam questions often start by asking whether something is a solution, linear, or an IVP before asking for a full solve.",
      tasks: [
        "Review order, linearity, explicit solution, and implicit solution vocabulary.",
        "Verify at least two proposed solutions by differentiating and substituting.",
        "Study IVP intervals and write why a solution interval cannot cross a singular point.",
        "Skim the modeling table for recognition, not memorization.",
        "Use the ODE decision tree once, even if the method feels obvious."
      ],
      routes: [
        chip("de-terminology", "Terminology"),
        chip("ivp", "IVPs"),
        chip("models", "Models"),
        chip("decision-tree", "Decision tree")
      ],
      checkpoint: "Confidence check: given an equation, state its order, whether it is linear, and what a solution check would require."
    },
    {
      day: 4,
      title: "Separable and linear first-order ODEs",
      timeBox: "3 hours",
      why: "These are the two fastest-scoring first-order methods if you can recognize them instantly.",
      tasks: [
        "Study separable examples and write the separation line before revealing any integration.",
        "Redo the corrected inverse-tangent IVP carefully so the constant calculation is automatic.",
        "Study linear equations and force standard form before computing the integrating factor.",
        "Solve one separable and one linear problem fully on paper.",
        "Study linear models: population growth, Newton cooling, and circuits.",
        "Do 12 mixed-practice method IDs and track which ones you misclassify."
      ],
      routes: [
        chip("ode-separable", "Separable"),
        chip("ode-linear", "Linear"),
        chip("ode-linear-models", "Linear models"),
        chip("decision-tree", "Decision tree"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: explain the difference between separable and linear using the shape of the equation, not the final answer."
    },
    {
      day: 5,
      title: "Exact and Bernoulli methods",
      timeBox: "3–3.5 hours",
      why: "Exact and Bernoulli problems look messy, but their recognition tests are mechanical once rehearsed.",
      tasks: [
        "Review partial-derivative notation just enough to compute M_y and N_x reliably.",
        "Study exact equations and always test exactness before integrating.",
        "Work one non-exact warning example so you do not force the wrong method.",
        "Study Bernoulli equations and write u=y^(1-n) three times with different n values.",
        "Run mixed practice until you correctly identify exact versus Bernoulli twice in a row."
      ],
      routes: [
        chip("partial-derivatives", "Partial mini-review"),
        chip("ode-exact", "Exact"),
        chip("ode-bernoulli", "Bernoulli"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: on paper, decide whether two first-order equations are exact, linear, separable, or Bernoulli before solving."
    },
    {
      day: 6,
      title: "Chapter 13 high-yield geometry",
      timeBox: "3 hours",
      why: "Partial derivatives, gradients, tangent planes, and extrema are formula-heavy but become quick points with pattern practice.",
      tasks: [
        "Review partial derivatives and second partial notation, then compute one full Hessian-style set.",
        "Study directional derivatives: normalize the direction, take gradient dot unit vector.",
        "Study tangent planes and normal lines; write the point-normal formula from memory.",
        "Work the instructor-marked tangent-plane exercises added from the PDF.",
        "Study the second-derivative test for extrema and write the D cases without looking."
      ],
      routes: [
        chip("partial-derivatives", "Partials"),
        chip("directional-gradients", "Gradients"),
        chip("tangent-planes", "Tangent planes"),
        chip("maxima-minima", "Extrema")
      ],
      checkpoint: "Confidence check: solve one tangent-plane problem and one extrema classification on paper without opening the solution."
    },
    {
      day: 7,
      title: "Exam simulation and weak-spot repair",
      timeBox: "3–4 hours",
      why: "The final day should train recognition under pressure, then repair only the mistakes that actually appear.",
      tasks: [
        "Do a 45-minute mixed-practice block: identify method first, then solve on paper.",
        "Review the formula sheet in hide/reveal mode and write every missed formula once.",
        "Use the decision tree for any first-order ODE you hesitated on.",
        "Revisit the two weakest topics from your mixed-practice mistakes.",
        "Finish with a calm confidence check: write the method-recognition clues for all first-order ODE methods."
      ],
      routes: [
        chip("mixed", "Exam-style mixed"),
        chip("formulas", "Formula recall"),
        chip("decision-tree", "ODE decision tree"),
        chip("ode-exact", "Common weak spot"),
        chip("maxima-minima", "Chapter 13 finish")
      ],
      checkpoint: "Confidence check: make a one-page notebook sheet of method triggers, formulas, and your three most common mistakes."
    }
  ];

  /* ── Midterm exam configuration ── */
  const midterm = {
    date: "2026-07-04",
    label: "Midterm — 04 July 2026",
    /* Topic IDs that fall inside the midterm syllabus */
    topicIds: new Set([
      /* Calculus Chapter 7 */
      "integration-by-parts",   /* 7.2 */
      "trig-integrals",         /* 7.3 */
      "trig-substitution",      /* 7.4 */
      "partial-fractions",      /* 7.5 */
      /* Calculus Chapter 13 */
      "functions-many-vars",    /* 13.1 */
      "limits-continuity",      /* 13.2 */
      "partial-derivatives",    /* 13.3 */
      "chain-rule",             /* 13.5 */
      "directional-gradients",  /* 13.6 */
      "tangent-planes",         /* 13.7 */
      "maxima-minima",          /* 13.8 */
      /* DE Chapter 2.2 */
      "ode-separable",
      /* DE Chapter 2.3 */
      "ode-linear",
      /* DE Chapter 3.1 */
      "ode-linear-models"
    ]),
    /* Source sections that map to midterm chapters */
    sourceChapters: new Set([
      "7.2", "7.3", "7.4", "7.5",
      "13.1", "13.2", "13.3", "13.5", "13.6", "13.7", "13.8",
      "2.2", "2.3", "3.1"
    ])
  };

  /* Build a midterm-only exam sprint (7 days, only midterm topics) */
  const midtermSprint = [
    {
      day: 1,
      title: "Integration engine: by-parts and trig integrals",
      timeBox: "2.5–3 hours",
      why: "Chapter 7 integration is the backbone of most exam problems. Nail by-parts and trig patterns first.",
      tasks: [
        "Warm up with basic antiderivatives for 15 minutes.",
        "Study integration by parts: LIATE, repeated, and cyclic patterns.",
        "Work all Chapter 7.2 PDF examples on paper before revealing steps.",
        "Study trig integrals: odd-power save-one, even-power half-angle, product-to-sum.",
        "Do 8 mixed-practice method IDs covering by-parts and trig integrals."
      ],
      routes: [
        chip("integration-by-parts", "By parts"),
        chip("trig-integrals", "Trig integrals"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: solve one cyclic by-parts integral and one odd-power trig integral on paper without looking."
    },
    {
      day: 2,
      title: "Trig substitution and partial fractions",
      timeBox: "3–3.5 hours",
      why: "These two Chapter 7 methods are the integration moves that most often block first-order ODE solutions.",
      tasks: [
        "Review the three trig-substitution radical shapes and draw each triangle.",
        "Work all PDF-aligned trig-substitution examples, especially arc-length and completing-square.",
        "Study partial fractions by factor type: distinct, repeated, irreducible, improper.",
        "Write each partial-fraction setup before computing coefficients.",
        "Formula recall: hide and rewrite all Chapter 7 formulas, then reveal."
      ],
      routes: [
        chip("trig-substitution", "Trig substitution"),
        chip("partial-fractions", "Partial fractions"),
        chip("formulas", "Formula recall")
      ],
      checkpoint: "Confidence check: classify three unseen integrals by method before solving any of them."
    },
    {
      day: 3,
      title: "Separable and linear first-order ODEs",
      timeBox: "3 hours",
      why: "DE 2.2 and 2.3 are the two fastest-scoring first-order methods on the midterm.",
      tasks: [
        "Study separable examples: write the separation line before revealing integration.",
        "Carefully redo the corrected inverse-tangent IVP so the constant is automatic.",
        "Study linear equations: force standard form before computing integrating factor.",
        "Solve one separable and one linear problem fully on paper.",
        "Study linear models: population growth, Newton cooling, and circuits.",
        "Do 10 mixed-practice method IDs and track which you misclassify."
      ],
      routes: [
        chip("ode-separable", "Separable"),
        chip("ode-linear", "Linear"),
        chip("ode-linear-models", "Linear models"),
        chip("decision-tree", "Decision tree"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: explain the difference between separable and linear using the equation shape, not the final answer."
    },
    {
      day: 4,
      title: "Chapter 13: domains, limits, and partial derivatives",
      timeBox: "3 hours",
      why: "Sections 13.1–13.3 are formula-heavy but become quick points once you see the patterns.",
      tasks: [
        "Study domain restrictions: square root ≥ 0, log > 0, combine constraints.",
        "Work level-curve and contour examples from 13.1.",
        "Study path limits and the two-path DNE test from 13.2.",
        "Study partial derivatives: freeze-other-variables rule from 13.3.",
        "Compute one full set of second partials and verify f_xy = f_yx."
      ],
      routes: [
        chip("functions-many-vars", "13.1 Domains"),
        chip("limits-continuity", "13.2 Limits"),
        chip("partial-derivatives", "13.3 Partials")
      ],
      checkpoint: "Confidence check: prove a limit DNE using two paths, and compute both partials of a polynomial surface."
    },
    {
      day: 5,
      title: "Chapter 13: chain rule and directional derivatives",
      timeBox: "3 hours",
      why: "Chain rule (13.5) and gradients (13.6) connect partial derivatives to real-world rates and directions.",
      tasks: [
        "Study the one-parameter and two-parameter chain rules from 13.5.",
        "Work the implicit differentiation examples: dy/dx = −F_x/F_y.",
        "Study directional derivatives: normalize direction, dot with gradient.",
        "Work all gradient examples and the maximum-increase problem.",
        "Do 8 mixed-practice problems covering chain rule and gradients."
      ],
      routes: [
        chip("chain-rule", "Chain rule"),
        chip("directional-gradients", "Gradients"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: compute a directional derivative and find the direction of fastest increase on paper."
    },
    {
      day: 6,
      title: "Chapter 13: tangent planes and extrema",
      timeBox: "3 hours",
      why: "Tangent planes (13.7) and the second-derivative test (13.8) are frequent exam topics.",
      tasks: [
        "Study tangent planes: F=0 form, gradient as normal, point-normal formula.",
        "Work the instructor-marked tangent-plane exercises from the PDF.",
        "Study normal lines using the same gradient vector.",
        "Study the second-partials test: D = f_xx f_yy − (f_xy)². Write D cases without looking.",
        "Work all extrema classification examples."
      ],
      routes: [
        chip("tangent-planes", "Tangent planes"),
        chip("maxima-minima", "Extrema"),
        chip("formulas", "Formula recall")
      ],
      checkpoint: "Confidence check: solve one tangent-plane problem and one extrema classification fully on paper."
    },
    {
      day: 7,
      title: "Midterm simulation and weak-spot repair",
      timeBox: "3–4 hours",
      why: "The final day trains recognition under pressure, then repairs only the mistakes that actually appear.",
      tasks: [
        "Do a 45-minute mixed-practice block: identify method first, then solve on paper.",
        "Review the formula sheet in hide/reveal mode. Write every missed formula once.",
        "Use the decision tree for any first-order ODE you hesitated on.",
        "Revisit the two weakest topics from your mixed-practice mistakes.",
        "Write a one-page cheat sheet of method triggers, formulas, and your three most common mistakes."
      ],
      routes: [
        chip("mixed", "Exam-style mixed"),
        chip("formulas", "Formula recall"),
        chip("decision-tree", "ODE decision tree")
      ],
      checkpoint: "Confidence check: make a one-page notebook sheet of method triggers, formulas, and your three most common mistakes."
    }
  ];

  window.ODE_COURSE = {
    strategySources: [
      "Worked-example effect and fading examples",
      "Active recall/testing effect",
      "Spaced repetition",
      "Interleaved/varied practice for math method recognition"
    ],
    modules,
    formulas,
    mixedPractice,
    examSprint,
    midterm,
    midtermSprint
  };
})();
