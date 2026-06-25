import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "audit/pdf-ledger.json");
const pdfs = [
  {
    id: "chapter-7",
    file: "Chapter 7.pdf",
    pageCount: 30,
    scope: "Integration techniques",
  },
  {
    id: "chapter-13",
    file: "Chapter 13.pdf",
    pageCount: 55,
    scope: "Multivariable calculus",
  },
  {
    id: "chapter-1",
    file: "Chapter 01_ODE_new02.pdf",
    pageCount: 26,
    scope: "ODE foundations and models",
  },
  {
    id: "chapter-2",
    file: "Chapter 02_ODE04.pdf",
    pageCount: 15,
    scope: "First-order ODE methods",
  },
];

const reviewed = new Map([
  [
    "chapter-13:19",
    ["pdf_images/ch13/page-19.png", "Verified negative sign in Example 9"],
  ],
  [
    "chapter-13:20",
    ["pdf_images/ch13/page-20.png", "Verified Example 9 continuity conclusion"],
  ],
  [
    "chapter-13:21",
    [
      "pdf_images/ch13/ch13_3_partials_ex12_second_order.png",
      "Verified Example 12 function",
    ],
  ],
  [
    "chapter-13:47",
    [
      "pdf_images/ch13/ch13_7_tangent_ex1c_angle.png",
      "Verified tangent-plane angle",
    ],
  ],
]);

const chapter7Pages = [
  ["Integration-by-parts formula and Example 1: integral of x cos x.", "Teach formula and include Example 1."],
  ["LIATE; Examples 2 and 3; start of repeated Example 4.", "Teach LIATE and include Examples 2–4."],
  ["Finish Example 4 and begin cyclic Example 5.", "Include both repeated and cyclic patterns."],
  ["Finish Example 5; printed Example 6 asks for an indefinite inverse-tangent integral.", "Teach Example 5 and the printed indefinite Example 6."],
  ["Example 6 solution silently inserts bounds 0 and 1; sine/cosine reduction formulas.", "Flag source inconsistency; teach the indefinite answer and optional definite variant.", "issue"],
  ["Derivation of cosine reduction formula and Example 8.", "Teach the reduction idea and include Example 8."],
  ["Exercise 7.2 problems 1–28.", "Select one problem per distinct by-parts pattern; omit repetition."],
  ["Applied by-parts exercises 55–58 on area and volume.", "Keep as optional transfer practice, not primary-path requirements."],
  ["Section 7.3 sine/cosine reduction and half-angle identities.", "Teach as the recognition toolkit."],
  ["Odd powers, cubic formulas, and homework fourth-power identities.", "Include fourth-power identities in the formula sheet."],
  ["Example 1 volume of revolution; products of sine and cosine.", "Include Example 1 and connect disks to trig integration."],
  ["Decision table and Example 2(a–b).", "Teach odd/even decision rules and both examples."],
  ["Finish Example 2(b); product-to-sum formulas and Example 3.", "Teach product-to-sum recognition and include Example 3."],
  ["Tangent/secant reduction and standard antiderivatives.", "Teach the tangent/secant decision toolkit."],
  ["Tangent/secant decision table and Example 4(a).", "Include decision table and Example 4(a)."],
  ["Example 4(b–c).", "Include both examples and contrast substitution choices."],
  ["Alternative odd-power method; Exercise 7.3 problems 1–10.", "Select representative sine/cosine power practice."],
  ["Exercise 7.3 problems 11–30.", "Select product-to-sum and tangent/secant practice by pattern."],
  ["Section 7.4 radical forms and Example 1.", "Teach the three radical shapes and include Example 1."],
  ["Finish Example 1 and solve definite Example 2 two ways.", "Include Example 2 and emphasize bound conversion."],
  ["Homework Example 3 ellipse area; substitution table; Example 4 prompt.", "Include ellipse and arc-length applications."],
  ["Example 4 arc-length solution.", "Include the complete verified solution without duplicate steps."],
  ["First printed Example 5: radical sqrt(x²−25)/x.", "Include with domain restriction x ≥ 5."],
  ["Second printed Example 5: completing-square integral.", "Preserve repeated source label and include the solution.", "issue"],
  ["Exercise 7.4 problems 1–20.", "Select representative problems for each radical shape."],
  ["Assigned arc lengths 33–34; additional exercises; Section 7.5 introduction.", "Include assigned Exercises 33–34; sample later integrals only if useful."],
  ["Introductory partial-fraction decomposition and Example 1.", "Teach distinct linear factors and include Example 1."],
  ["Example 2 repeated factor and start of Example 3.", "Teach repeated factors and irreducible quadratics."],
  ["Finish Example 3 and Example 5 improper rational function.", "Include both irreducible and long-division patterns."],
  ["Exercise 7.5 problems 9–24.", "Select one practice problem for each denominator/improper pattern."],
].map(([summary, courseDecision, status = "reviewed"], index) => ({
  page: index + 1,
  status,
  scope: "Integration techniques",
  summary,
  courseDecision,
  evidence: [
    `Chapter 7.pdf page ${index + 1}`,
    "Rendered to PNG at 95 DPI and visually inspected on 2026-06-23.",
  ],
}));

function pageRecords(scope, file, rows) {
  return rows.map(([summary, courseDecision, status = "reviewed"], index) => ({
    page: index + 1,
    status,
    scope,
    summary,
    courseDecision,
    evidence: [
      `${file} page ${index + 1}`,
      "Rendered to PNG and visually inspected on 2026-06-23.",
    ],
  }));
}

const chapter1Pages = pageRecords("ODE foundations and models", "Chapter 01_ODE_new02.pdf", [
  ["Chapter introduction, differential-equation definition, and exponential-growth example; domain is misprinted as (∞,∞).", "Teach the definition and correct the interval to all real numbers.", "issue"],
  ["ODE versus PDE and classification by order.", "Teach type and order recognition."],
  ["General nth-order form and linearity criteria.", "Teach both linearity conditions with counterexamples."],
  ["Verification Examples 1(a–b) and 2; assigned Exercises 1.1 numbers.", "Include all printed verification examples."],
  ["Printed Exercises 1, 2, 11, and 13; Exercise 11's proposed function fails the equation.", "Include classification items and teach Exercise 11 as a corrected-source check.", "issue"],
  ["Section 1.2 and first-order IVP Example 1.", "Teach how one initial condition selects one family member."],
  ["Solution-interval Example 2.", "Teach maximal intervals containing the initial point."],
  ["Second-order IVP Example 3.", "Teach two conditions for a two-parameter family."],
  ["Assigned IVP Exercises 3, 4, 7, and 8.", "Include all four printed exercises with maximal intervals."],
  ["Model-building process and Malthusian population setup.", "Teach variable/parameter/assumption translation."],
  ["Malthus equation, parameter meaning, and IVP.", "Include equation, units, and initial condition."],
  ["Malthus solution, applications, and limitations.", "Teach exponential solution and why carrying capacity is missing."],
  ["Biological motivation for carrying capacity.", "Condense to the intuition needed for logistic modeling."],
  ["Derivation of the logistic competition term.", "Teach dP/dt=aP-bP² and term meanings."],
  ["Logistic law, carrying capacity a/b, and IVP statement.", "Include equilibria and carrying capacity."],
  ["Logistic graph and radioactive-decay model.", "Teach growth-versus-decay sign recognition."],
  ["Newton cooling/warming and start of disease model.", "Teach sign checks and susceptible/infected variables."],
  ["Disease equation and first-order chemical reactions.", "Teach product-contact and proportional-decay models."],
  ["Second-order chemical reaction model.", "Include dx/dt=k(a-x)(b-x)."],
  ["Mixing-tank assumptions and rate-in-minus-rate-out setup.", "Include as a fully worked model."],
  ["Mixing equation dA/dt+A/100=6.", "Include units and identify it as linear."],
  ["RLC series-circuit model.", "Include component meanings and the second-order equation."],
  ["Falling-body equations mix upward/downward conventions and omit t in the displayed position formula.", "Teach one declared convention and disclose the source defects.", "issue"],
  ["Simple harmonic-motion setup and Hooke's law.", "Teach restoring force and equilibrium displacement."],
  ["Simple and damped harmonic-motion equations.", "Teach qualitative distinction and parameter meanings."],
  ["Damped equation completion and external Zill exercise-number list.", "Cover model recognition; do not invent absent external exercise statements."],
]);

const chapter2Pages = pageRecords("First-order ODE methods", "Chapter 02_ODE04.pdf", [
  ["Separable-equation definition, introductory solution, and non-separable counterexample.", "Teach recognition before procedure."],
  ["Example 1 and exercise list; printed solution to Exercise 1.", "Include Example 1 and representative assigned exercises."],
  ["Printed solutions to Exercises 5 and 23.", "Include both and verify the IVP constant."],
  ["Printed solution to separable IVP Exercise 25.", "Include the solution and maximal interval containing x=-1."],
  ["Linear-equation definition, standard form, algorithm, and exercise list.", "Teach standard form and integrating-factor derivation."],
  ["Printed solutions to linear Exercises 3 and 9.", "Include both and state interval assumptions around x=0."],
  ["Printed linear IVP Exercise 27.", "Include the IVP and interval x>0."],
  ["Exact-differential and exact-equation definitions.", "Teach the hidden-potential interpretation."],
  ["Exactness criterion, example references, and start of Exercise 3.", "Include a partial-derivative mini-review and Exercise 3."],
  ["Completion of exact Exercise 3.", "Include verified potential function."],
  ["Non-exact Exercise 33 and integrating factor y².", "Include domain caveat and conversion to exact form."],
  ["Completion of exact Exercise 33.", "Include verified implicit solution."],
  ["Bernoulli definition and start of Exercise 15.", "Teach n recognition and u=y^(1-n)."],
  ["Completion of Exercise 15 and start of Exercise 18.", "Include both substitution-to-linear workflows."],
  ["Completion of Bernoulli Exercise 18 and reference.", "Include verified back-substitution."],
]);

const chapter13Pages = pageRecords("Multivariable calculus", "Chapter 13.pdf", [
  ["Section 13.1 introduces functions of several variables, natural domains, and Example 1.", "Teach domain restrictions as intersections and include Example 1."],
  ["Completion of Example 1 and Example 2 on a three-variable square-root domain.", "Include both domain examples and identify the solid unit ball."],
  ["Example 3 describes a plane, an upper hemisphere, and the lower nappe of a cone.", "Include the three graph identifications as a visual-recognition example."],
  ["Example 4 introduces level curves for y²−x².", "Teach the k>0, k<0, and k=0 families."],
  ["Example 5 uses elliptical contours for 4x²+y² and begins the exercise set.", "Include the contour example and one matching level-curve practice."],
  ["End of Exercise Set 13.1 and start of Section 13.2 with the geometry of approaching along curves.", "Select only representative domain/level-curve exercises; teach the many-path idea."],
  ["Section 13.2 Example 1 begins path-limit analysis of −xy/(x²+y²).", "Include the coordinate-axis paths and retain the negative sign."],
  ["Example 1 continues with diagonal paths and demonstrates path dependence.", "Show y=x and y=−x explicitly."],
  ["Formal multivariable limit definition and supporting geometric discussion.", "Condense the epsilon-delta definition to exam-useful meaning without deleting the formal condition."],
  ["Examples 2 and 3 cover direct substitution and a two-path nonexistence proof.", "Include both patterns."],
  ["Continuity definitions and Example 4 on polynomial/composite continuity.", "Teach continuity through standard function classes and composition."],
  ["Examples 5 and 6 cover rational evaluation and continuity domain xy≠1.", "Include both rational-function patterns."],
  ["Example 7 proves a logarithmic radial limit using polar coordinates and L'Hôpital's rule.", "Include the proof and correctly label the −∞/∞ indeterminate form."],
  ["Exercise Set 13.2 contains direct, path-test, radial-substitution, and general limit problems.", "Select one problem per distinct proof method rather than reproducing the entire set."],
  ["Section 13.3 introduces partial derivatives, notation, and geometric slope meaning.", "Teach the freeze-other-variables rule and both slope interpretations."],
  ["Example 1 computes f_x(1,3)=58 and f_y(1,3)=14 from the limit definition.", "Include the full definition-based calculation."],
  ["Example 2 obtains the same partials by ordinary differentiation.", "Include as the efficient method and compare with Example 1."],
  ["Examples 3 and 5 cover chain-rule partials and tangent slopes −4 and 61.", "Include both symbolic and geometric patterns."],
  ["Example 9 begins a piecewise function with both coordinate partials at the origin.", "Retain the PDF's negative numerator and compute both partials from definitions."],
  ["Example 9 concludes that partials may exist without continuity; higher-order notation begins.", "Emphasize that partial derivatives alone do not imply continuity."],
  ["Example 12 begins first- and second-order partials for x²y³+x⁴y.", "Use the exact PDF function."],
  ["Example 12 finishes with matching mixed partials.", "Include all four second partials and the smooth-function equality condition."],
  ["Exercise Set 13.3 begins with first-partial and slope problems.", "Select representative polynomial, chain-rule, and slope exercises."],
  ["Exercise Set 13.3 continues with two- and three-variable partial derivatives.", "Use only patterns not already covered by worked examples."],
  ["Exercise Set 13.3 ends with rates along surface intersections.", "Keep one applied slope problem as optional transfer practice."],
  ["Section 13.5 states chain rules; Example 1 gives dz/dt=7t⁶; Example 2 is only labelled H.W. with no supplied problem.", "Include Example 1 and do not invent an Example 2 statement."],
  ["Two-parameter chain-rule theorem and start of Example 3.", "Teach dependency paths for u and v."],
  ["Completion of Example 3 and Example 4 for three intermediate variables.", "Include both exact PDF examples."],
  ["Implicit differentiation formula and Example 7.", "Teach dy/dx=−F_x/F_y with its nonzero-denominator condition."],
  ["Implicit partial theorem and Example 8 on the unit sphere.", "Include z_x=−1 and z_y=−1/2 at the printed point."],
  ["Exercise Set 13.5 covers one-parameter and two-parameter chain rules.", "Select one ordinary and one multivariable chain-rule exercise."],
  ["Exercise Set 13.5 continues with polar and nested-variable problems.", "Treat polar-coordinate dependency trees as optional enrichment."],
  ["Applied related-rate and implicit-differentiation exercises.", "Keep one real-use chain-rule problem if study time permits."],
  ["Identity-verification exercises for functions of combined variables.", "Omit from the primary path; they are proof-style enrichment."],
  ["Exercise 57 derives polar derivative identities and the polar Laplace equation.", "Label as advanced enrichment, not a one-week exam prerequisite unless assigned."],
  ["Section 13.6 introduces directional derivatives with geometric diagrams and the definition.", "Teach direction as rate per unit distance and require a unit vector."],
  ["Example 1 computes D_u f(1,2)=1/2+√3 directly from the definition.", "Include this foundational definition example and its interpretation."],
  ["Directional-derivative theorem, Example 2, and start of Example 3.", "Include the angle-to-unit-vector pattern and begin 3D normalization."],
  ["Completion of Example 3 and definition of the gradient.", "Include the normalized 3D direction and dot-product calculation."],
  ["Gradient notation and maximum/minimum slope properties.", "Teach D_u f=∇f·u and why |∇f| is the largest directional derivative."],
  ["Gradient theorem and Example 4 on maximum increase.", "Include maximum value 4√2 and the corresponding unit vector."],
  ["Exercise Set 13.6 begins with directional derivatives using supplied unit vectors.", "Select one 2D and one 3D dot-product problem."],
  ["Exercise Set 13.6 continues with non-unit direction vectors.", "Include normalization practice."],
  ["Exercise Set 13.6 continues with angle, axis, and vector-direction questions.", "Select one angle-based exercise if extra practice is needed."],
  ["Exercise Set 13.6 ends with fastest-increase and fastest-decrease questions.", "Include one gradient-direction practice and omit repetitive variants."],
  ["Section 13.7 defines tangent planes and normal lines; Example 1 begins.", "Teach the gradient-normal principle and include all parts of Example 1."],
  ["Example 1 finishes, including the 83° plane angle, and Example 2 begins.", "Include the simplified plane, normal line, and angle calculation."],
  ["Example 2 finishes; theorem for z=f(x,y); marked Exercises 1 and 2.", "Include Example 2 and selected marked practice."],
  ["Marked Exercises 3, 5, 10, 11, and 12 cover implicit and explicit surfaces.", "Include compact practice spanning each distinct marked pattern."],
  ["Section 13.8 introduces relative and absolute extrema with geometric figures and definitions.", "Teach relative versus absolute extrema briefly."],
  ["Extreme-value theorem on closed bounded regions and motivation for critical points.", "Include the existence theorem as recognition knowledge."],
  ["Critical-point definition and the second partials test.", "Teach all D>0, D<0, and D=0 outcomes."],
  ["The supplied excerpt jumps to Example 3, a quadratic with a relative minimum, then starts Example 4.", "Include Example 3 and disclose that Examples 1–2 are absent from the supplied PDF excerpt.", "issue"],
  ["Example 4 finishes with maxima at (1,1), (−1,−1) and a saddle at (0,0).", "Include the full classification table logic."],
  ["Exercise Set 13.8 contains classification and optimization applications.", "Select one extra classification problem; keep word optimization as optional transfer practice."],
]);

const ledger = {
  version: 1,
  generatedAt: "2026-06-23",
  pdfs: pdfs.map((pdf) => ({
    ...pdf,
    pages: pdf.id === "chapter-7"
      ? chapter7Pages
      : pdf.id === "chapter-1"
        ? chapter1Pages
        : pdf.id === "chapter-2"
          ? chapter2Pages
          : pdf.id === "chapter-13"
            ? chapter13Pages
          : Array.from({ length: pdf.pageCount }, (_, index) => {
      const page = index + 1;
      const evidence = reviewed.get(`${pdf.id}:${page}`);
      return {
        page,
        status: evidence ? "reviewed" : "pending",
        scope: pdf.scope,
        evidence: evidence || [],
      };
    }),
  })),
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(ledger, null, 2)}\n`);
console.log(`Wrote ${output}`);
