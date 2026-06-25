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
    ], "Newton's law of cooling: rate of change of temperature is proportional to temperature difference.", "Chapter 3.1")
  ];

  markSourceExamples(linearModelsExamples, "Chapter 3_ODE.pdf", "3.1", {
    "Example 1": { page: 1, label: "Example 1" },
    "Example 4: Cooling of a Cake": { page: 5, label: "Example 4" }
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

const modules = [
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
          prerequisites: ["Calculus"],
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
          prerequisites: ["Calculus"],
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
      title: "Module 2: First-Order Differential Equations",
      description: "First-order solving methods: separable, linear, and linear models.",
      topics: [
        {
          id: "ode-separable",
          number: "2.1",
          title: "Separable Variables",
          hook: "If you can put all y terms with dy and all x terms with dx, the ODE becomes two integrals.",
          prerequisites: ["Calculus"],
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
          number: "2.2",
          title: "Linear Equations",
          hook: "A linear first-order ODE is solved by multiplying by a magic factor that makes the left side one derivative.",
          prerequisites: ["2.1 Separable Variables"],
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
          id: "ode-linear-models",
          number: "2.3",
          title: "Linear Models",
          hook: "From population growth to cooling cakes, linear models apply first-order ODEs to real-world rates.",
          prerequisites: ["2.1 Separable Variables", "2.2 Linear Equations"],
          formulas: [
            m`\frac{dp}{dt} = ap \quad (\text{Malthusian population growth})`,
            m`\frac{dT}{dt} = a(T - T_m) \quad (\text{Newton's law of cooling})`
          ],
          theory: [
            "Malthusian growth models population change as rate proportional to population itself.",
            "Newton's law of cooling/warming states that rate of temperature change of an object is proportional to the difference between its temperature and ambient temperature."
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
            )
          ],
          recap: [
            "Translate rates of growth or cooling into standard differential equations.",
            "Identify constants and initial conditions to obtain particular solutions.",
            "Linear models are solved using separable variable integration or standard integrating factors."
          ]
        }
      ]
    },
    {
      id: "module-3",
      title: "Module 3: Multivariable Derivatives",
      description: "Partial derivatives and the multivariable chain rule.",
      topics: [
        {
          id: "partial-derivatives",
          number: "3.1",
          title: "Partial Derivatives",
          hook: "A partial derivative freezes all but one input and asks for the rate in that direction.",
          prerequisites: ["Calculus"],
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
          number: "3.2",
          title: "The Chain Rule",
          hook: "The multivariable chain rule adds every route by which a variable can affect another.",
          prerequisites: ["3.1 Partial Derivatives"],
          formulas: [m`\frac{dz}{dt}=f_x\frac{dx}{dt}+f_y\frac{dy}{dt}`, m`\frac{dy}{dx}=-\frac{F_x}{F_y}`],
          theory: ["Draw dependency arrows if you feel lost.", "Implicit differentiation is a chain-rule application."],
          examples: ch13_5_Examples,
          practice: [
            pr("Chain rule", m`z=xy^2,\ x=t,\ y=t^2`, "Compute z_x, z_y, x', y'.", [step(m`z_x=y^2,\ z_y=2xy`, "Partials."), step(m`x'=1,\ y'=2t`, "Derivatives."), step(m`dz/dt=y^2+2xy(2t)=t^4+4t^4=5t^4`, "Substitute.")], "chain rule"),
            pr("Implicit", m`x^2+y^2=10`, "Use -Fx/Fy.", [step(m`F_x=2x,\ F_y=2y`, "Partials."), step(m`dy/dx=-x/y`, "Formula.")], "implicit differentiation")
          ],
          recap: ["Follow every dependency path.", "Implicit derivative = -Fx/Fy.", "Check by direct substitution when possible."]
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
        priority: topic.number.startsWith("2") ? "Must Memorize" : "Good to Know"
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
      title: "Integration engine: by-parts and trig integrals",
      timeBox: "2.5–3 hours",
      why: "Chapter 7 integration is the backbone of most exam problems. Nail by-parts and trig patterns first.",
      tasks: [
        "Warm up with derivative and basic antiderivatives for 15 minutes.",
        "Study integration by parts: LIATE, repeated, and cyclic patterns.",
        "Work all Chapter 7.2 PDF examples on paper before revealing steps.",
        "Study trig integrals: odd-power save-one, even-power half-angle, product-to-sum.",
        "Do 6 mixed-practice method IDs covering by-parts and trig integrals."
      ],
      routes: [
        chip("integration-by-parts", "By parts"),
        chip("trig-integrals", "Trig integrals"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: classify three unseen integrals by method before solving any of them."
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
      title: "Separable first-order ODEs",
      timeBox: "2.5–3 hours",
      why: "Separation is the most fundamental ODE solving technique. Get it completely solid.",
      tasks: [
        "Study separable examples: write the separation line before revealing integration.",
        "Carefully redo the initial value problems on paper so constant tracking is automatic.",
        "Work the Exercise 25 IVP and identify its maximal interval.",
        "Do 6 mixed-practice method IDs to practice spotting separable forms."
      ],
      routes: [
        chip("ode-separable", "Separable"),
        chip("decision-tree", "Decision tree"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: explain when an ODE is separable and how to handle the constant of integration."
    },
    {
      day: 4,
      title: "Linear first-order ODEs",
      timeBox: "3 hours",
      why: "Linear ODEs appear constantly in physical models; the integrating factor method is extremely high-yield.",
      tasks: [
        "Study linear equations: force standard form before computing integrating factor.",
        "Work the general linear examples and initial value problems fully on paper.",
        "Rehearse finding the integrating factor for P(x) = -1/x and standard P(x) functions.",
        "Do 6 mixed-practice method IDs to distinguish linear from separable."
      ],
      routes: [
        chip("ode-linear", "Linear"),
        chip("decision-tree", "Decision tree"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: explain the role of standard form and the integrating factor in solving linear first-order ODEs."
    },
    {
      day: 5,
      title: "Real-world applications: Linear Models",
      timeBox: "3 hours",
      why: "Newton cooling and Malthusian growth are guaranteed points on the exam if you can translate the story to math.",
      tasks: [
        "Study population growth examples: solve for growth constant a and answer tripling/quadrupling times.",
        "Study Newton cooling/warming: write the temperature difference equation and find the cooling constant.",
        "Work practice exercises on paper before checking steps.",
        "Formula recall: hide and rewrite all linear models formulas, then reveal."
      ],
      routes: [
        chip("ode-linear-models", "Linear models"),
        chip("formulas", "Formula recall")
      ],
      checkpoint: "Confidence check: write the general solutions for both Malthusian growth and Newton's law of cooling from memory."
    },
    {
      day: 6,
      title: "Chapter 13: partials and chain rule",
      timeBox: "3 hours",
      why: "Partial derivatives and chain rule are the core multivariable calculus topics on the midterm.",
      tasks: [
        "Review partial derivatives: freeze-other-variables rule.",
        "Compute sets of second-order partial derivatives and verify Clairaut's theorem.",
        "Study the multivariable chain rule for one and multiple parameters.",
        "Work implicit differentiation: dy/dx = -F_x/F_y.",
        "Do 8 mixed-practice problems covering partial derivatives and chain rule."
      ],
      routes: [
        chip("partial-derivatives", "Partials"),
        chip("chain-rule", "Chain rule"),
        chip("mixed", "Mixed IDs")
      ],
      checkpoint: "Confidence check: compute both partial derivatives of a product expression and apply the chain rule to verify a derivative on paper."
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
        "Revisit the weakest topic from your mixed-practice mistakes.",
        "Finish with a calm confidence check: write the method-recognition clues for all first-order ODE methods."
      ],
      routes: [
        chip("mixed", "Exam-style mixed"),
        chip("formulas", "Formula recall"),
        chip("decision-tree", "ODE decision tree")
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
      "integration-by-parts",
      "trig-integrals",
      "trig-substitution",
      "partial-fractions",
      "partial-derivatives",
      "chain-rule",
      "ode-separable",
      "ode-linear",
      "ode-linear-models"
    ]),
    /* Source sections that map to midterm chapters */
    sourceChapters: new Set([
      "7.2", "7.3", "7.4", "7.5",
      "13.3", "13.5",
      "2.2", "2.3", "3.1"
    ])
  };

  /* Build a midterm-only exam sprint (7 days, only midterm topics) */
  const midtermSprint = examSprint;

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
