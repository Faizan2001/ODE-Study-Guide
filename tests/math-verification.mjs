function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function close(actual, expected, tolerance, message) {
  assert(
    Math.abs(actual - expected) <= tolerance,
    `${message}: expected ${expected}, received ${actual}`,
  );
}

function derivative(fn, x) {
  const h = 1e-6;
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

function secondDerivative(fn, x) {
  const h = 1e-4;
  return (fn(x + h) - 2 * fn(x) + fn(x - h)) / (h * h);
}

function simpson(fn, a, b, intervals = 20000) {
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const h = (b - a) / n;
  let total = fn(a) + fn(b);
  for (let index = 1; index < n; index += 1) {
    total += (index % 2 === 0 ? 2 : 4) * fn(a + index * h);
  }
  return (h / 3) * total;
}

const inverseTangentAntiderivative = (x) =>
  x * Math.atan(x) - 0.5 * Math.log(1 + x * x);

for (const x of [-2, -0.5, 0, 0.75, 3]) {
  close(
    derivative(inverseTangentAntiderivative, x),
    Math.atan(x),
    1e-6,
    `Inverse-tangent antiderivative failed at x=${x}`,
  );
}

close(
  inverseTangentAntiderivative(1) - inverseTangentAntiderivative(0),
  Math.PI / 4 - 0.5 * Math.log(2),
  1e-12,
  "PDF Example 6 bounded variant",
);

const partialContinuity = (x, y) =>
  x === 0 && y === 0 ? 0 : -(x * y) / (x * x + y * y);

close(
  partialContinuity(1e-4, 1e-4),
  -0.5,
  1e-12,
  "Example 9 path y=x",
);
close(
  partialContinuity(1e-4, -1e-4),
  0.5,
  1e-12,
  "Example 9 path y=-x",
);
close(
  partialContinuity(1e-4, 0),
  0,
  1e-12,
  "Example 9 x-axis",
);

const tangentPlaneAngle = (Math.acos(1 / Math.sqrt(66)) * 180) / Math.PI;
close(
  tangentPlaneAngle,
  82.92944488303417,
  1e-10,
  "Tangent-plane angle",
);

const trigSubExample1 = (x) => -Math.sqrt(4 - x * x) / (4 * x);
for (const x of [0.5, 1, 1.5]) {
  close(
    derivative(trigSubExample1, x),
    1 / (x * x * Math.sqrt(4 - x * x)),
    2e-6,
    `Chapter 7.4 Example 1 failed at x=${x}`,
  );
}

const radicalExample = (x) =>
  Math.sqrt(x * x - 25) - 5 * Math.acos(5 / x);
for (const x of [6, 8, 12]) {
  close(
    derivative(radicalExample, x),
    Math.sqrt(x * x - 25) / x,
    2e-6,
    `Chapter 7.4 radical Example 5 failed at x=${x}`,
  );
}

const completingSquare = (x) =>
  0.5 * Math.log((x - 2) ** 2 + 4) + Math.atan((x - 2) / 2);
for (const x of [-1, 0, 3, 6]) {
  close(
    derivative(completingSquare, x),
    x / (x * x - 4 * x + 8),
    2e-6,
    `Chapter 7.4 completing-square example failed at x=${x}`,
  );
}

const sec = (x) => 1 / Math.cos(x);
const tangentSecantExample = (x) =>
  0.5 * sec(x) * Math.tan(x) -
  0.5 * Math.log(Math.abs(sec(x) + Math.tan(x)));
for (const x of [-0.7, -0.2, 0.4, 0.8]) {
  close(
    derivative(tangentSecantExample, x),
    Math.tan(x) ** 2 * sec(x),
    2e-6,
    `Chapter 7.3 Example 4(c) failed at x=${x}`,
  );
}

for (const x of [-3, -1, 0.5, 3]) {
  close(
    -2 / x - 2 / (x * x) + 2 / (x - 2),
    (2 * x + 4) / (x ** 3 - 2 * x * x),
    1e-12,
    `Repeated partial fraction reconstruction failed at x=${x}`,
  );
}

for (const x of [-2, 0, 1, 2]) {
  close(
    (-7 / 5) / (3 * x - 1) + ((4 / 5) * x + 3 / 5) / (x * x + 1),
    (x * x + x - 2) / (3 * x ** 3 - x * x + 3 * x - 1),
    1e-12,
    `Irreducible partial fraction reconstruction failed at x=${x}`,
  );
}

const assigned33Exact =
  Math.sqrt(5) -
  Math.sqrt(2) +
  Math.log((2 * (Math.sqrt(2) + 1)) / (Math.sqrt(5) + 1));
close(
  assigned33Exact,
  simpson((x) => Math.sqrt(1 + 1 / (x * x)), 1, 2),
  1e-10,
  "Assigned Exercise 7.4 #33 arc length",
);

const assigned34Exact =
  Math.sqrt(5) / 2 + 0.25 * Math.log(2 + Math.sqrt(5));
close(
  assigned34Exact,
  simpson((x) => Math.sqrt(1 + 4 * x * x), 0, 1),
  1e-10,
  "Assigned Exercise 7.4 #34 arc length",
);

const explicitVerification = (x) => x ** 4 / 16;
for (const x of [-2, -0.5, 0.75, 3]) {
  close(
    derivative(explicitVerification, x),
    x * Math.sqrt(explicitVerification(x)),
    2e-6,
    `Chapter 1 Example 1(a) failed at x=${x}`,
  );
}

const secondOrderVerification = (x) => x * Math.exp(x);
for (const x of [-1, 0, 1.2]) {
  close(
    secondDerivative(secondOrderVerification, x) -
      2 * derivative(secondOrderVerification, x) +
      secondOrderVerification(x),
    0,
    2e-6,
    `Chapter 1 Example 1(b) failed at x=${x}`,
  );
}

for (const x of [-4, -1, 2, 4]) {
  const y = Math.sqrt(25 - x * x);
  close(-x / y, derivative((value) => Math.sqrt(25 - value * value), x), 2e-6, `Implicit circle derivative failed at x=${x}`);
}

const chapter1Ivp = (t) => -2 * Math.cos(4 * t) + 0.25 * Math.sin(4 * t);
close(chapter1Ivp(Math.PI / 2), -2, 1e-12, "Chapter 1 Example 3 position condition");
close(derivative(chapter1Ivp, Math.PI / 2), 1, 2e-6, "Chapter 1 Example 3 velocity condition");
for (const t of [0, 0.3, 1]) {
  close(secondDerivative(chapter1Ivp, t) + 16 * chapter1Ivp(t), 0, 2e-5, `Chapter 1 Example 3 ODE failed at t=${t}`);
}

const ivp3 = (x) => 1 / (x * x - 1);
close(ivp3(2), 1 / 3, 1e-12, "Exercise 1.2 #3 initial condition");
for (const x of [1.5, 2, 3]) {
  close(derivative(ivp3, x) + 2 * x * ivp3(x) ** 2, 0, 2e-6, `Exercise 1.2 #3 ODE failed at x=${x}`);
}

const ivp4 = (x) => 1 / (x * x - 2);
close(ivp4(-2), 0.5, 1e-12, "Exercise 1.2 #4 initial condition");
for (const x of [-4, -2, -1.5]) {
  close(derivative(ivp4, x) + 2 * x * ivp4(x) ** 2, 0, 2e-6, `Exercise 1.2 #4 ODE failed at x=${x}`);
}

const ivp7 = (t) => -Math.cos(t) + 8 * Math.sin(t);
close(ivp7(0), -1, 1e-12, "Exercise 1.2 #7 position condition");
close(derivative(ivp7, 0), 8, 2e-6, "Exercise 1.2 #7 velocity condition");

const ivp8 = (t) => -Math.cos(t);
close(ivp8(Math.PI / 2), 0, 1e-12, "Exercise 1.2 #8 position condition");
close(derivative(ivp8, Math.PI / 2), 1, 2e-6, "Exercise 1.2 #8 velocity condition");

const separable23 = (t) => Math.tan(4 * t - (3 * Math.PI) / 4);
close(separable23(Math.PI / 4), 1, 1e-12, "Separable Exercise 23 initial condition");
for (const t of [0.6, 0.8, 1]) {
  close(derivative(separable23, t), 4 * (separable23(t) ** 2 + 1), 2e-5, `Separable Exercise 23 failed at t=${t}`);
}

const separable25 = (x) => Math.exp(-(1 / x + 1)) / x;
close(separable25(-1), -1, 1e-12, "Separable Exercise 25 initial condition");
for (const x of [-3, -1.5, -0.75]) {
  close(x * x * derivative(separable25, x), separable25(x) - x * separable25(x), 2e-6, `Separable Exercise 25 failed at x=${x}`);
}

const linear3 = (x) => 0.25 * Math.exp(3 * x) + 2 * Math.exp(-x);
for (const x of [-1, 0, 1]) {
  close(derivative(linear3, x) + linear3(x), Math.exp(3 * x), 2e-6, `Linear Exercise 3 failed at x=${x}`);
}

const linear9 = (x) => -x * Math.cos(x) + 2 * x;
for (const x of [0.5, 1, 2]) {
  close(x * derivative(linear9, x) - linear9(x), x * x * Math.sin(x), 2e-6, `Linear Exercise 9 failed at x=${x}`);
}

const linear27 = (x) => (Math.exp(x) + 2 - Math.E) / x;
close(linear27(1), 2, 1e-12, "Linear Exercise 27 initial condition");
for (const x of [0.5, 1, 2]) {
  close(x * derivative(linear27, x) + linear27(x), Math.exp(x), 2e-6, `Linear Exercise 27 failed at x=${x}`);
}

const exact3Fx = (x, y) => 5 * x + 4 * y;
const exact3Fy = (x, y) => 4 * x - 8 * y ** 3;
const exact3Potential = (x, y) => 2.5 * x * x + 4 * x * y - 2 * y ** 4;
for (const [x, y] of [[1, 2], [-1, 0.5]]) {
  close(derivative((value) => exact3Potential(value, y), x), exact3Fx(x, y), 2e-6, "Exact Exercise 3 x-partial");
  close(derivative((value) => exact3Potential(x, value), y), exact3Fy(x, y), 2e-6, "Exact Exercise 3 y-partial");
}

const exact33Potential = (x, y) => 3 * x * x * y ** 3 + y ** 4;
for (const [x, y] of [[1, 2], [-1, -0.5]]) {
  close(derivative((value) => exact33Potential(value, y), x), 6 * x * y ** 3, 2e-6, "Exact Exercise 33 x-partial");
  close(derivative((value) => exact33Potential(x, value), y), 9 * x * x * y * y + 4 * y ** 3, 2e-6, "Exact Exercise 33 y-partial");
}

const bernoulli15 = (x) => Math.cbrt(1 + 2 / x ** 3);
for (const x of [1, 2, 3]) {
  close(x * derivative(bernoulli15, x) + bernoulli15(x), 1 / bernoulli15(x) ** 2, 2e-6, `Bernoulli Exercise 15 failed at x=${x}`);
}

const bernoulli18 = (x) => {
  const u = 1 / x - 1 + 2 / (x * Math.exp(x));
  return 1 / u;
};
for (const x of [0.25, 0.5, 1]) {
  const y = bernoulli18(x);
  close(x * derivative(bernoulli18, x) - (1 + x) * y, x * y * y, 2e-5, `Bernoulli Exercise 18 failed at x=${x}`);
}

const malthus = (t) => 5 * Math.exp(0.3 * t);
for (const t of [0, 1, 2]) {
  close(derivative(malthus, t), 0.3 * malthus(t), 2e-6, `Malthus model failed at t=${t}`);
}

const a = 3;
const b = 0.25;
close(a * 0 - b * 0 ** 2, 0, 1e-12, "Logistic zero equilibrium");
close(a * (a / b) - b * (a / b) ** 2, 0, 1e-12, "Logistic carrying-capacity equilibrium");

const fallingHeight = (t) => 100 + 12 * t - 0.5 * 9.8 * t * t;
for (const t of [0, 1, 2]) {
  close(secondDerivative(fallingHeight, t), -9.8, 2e-5, `Upward-positive falling-body formula failed at t=${t}`);
}

const partialExample = (x, y) => 2 * x ** 3 * y ** 2 + 2 * y + 4 * x;
close(
  derivative((x) => partialExample(x, 3), 1),
  58,
  2e-6,
  "Chapter 13.3 Example 1 x-partial",
);
close(
  derivative((y) => partialExample(1, y), 3),
  14,
  2e-6,
  "Chapter 13.3 Example 1 y-partial",
);

const secondPartialExample = (x, y) => x * x * y ** 3 + x ** 4 * y;
for (const [x, y] of [[1, 2], [-0.75, 1.25]]) {
  close(
    secondDerivative((value) => secondPartialExample(value, y), x),
    2 * y ** 3 + 12 * x * x * y,
    2e-4,
    "Chapter 13.3 Example 12 f_xx",
  );
  close(
    secondDerivative((value) => secondPartialExample(x, value), y),
    6 * x * x * y,
    2e-4,
    "Chapter 13.3 Example 12 f_yy",
  );
  close(
    derivative(
      (value) => 2 * x * value ** 3 + 4 * x ** 3 * value,
      y,
    ),
    6 * x * y * y + 4 * x ** 3,
    2e-6,
    "Chapter 13.3 Example 12 f_xy",
  );
}

const chainExample3 = (u, v) =>
  Math.exp((2 * u + v) * (u / v));
for (const [u, v] of [[0.4, 1.2], [1.1, 2.3]]) {
  const exponential = chainExample3(u, v);
  close(
    derivative((value) => chainExample3(value, v), u),
    (4 * u / v + 1) * exponential,
    2e-5,
    "Chapter 13.5 Example 3 u-partial",
  );
  close(
    derivative((value) => chainExample3(u, value), v),
    (-2 * u * u / (v * v)) * exponential,
    2e-5,
    "Chapter 13.5 Example 3 v-partial",
  );
}

const chainExample4 = (u, v) => {
  const x = 3 * u + v;
  const y = 3 * u - v;
  const z = u * u * v;
  return Math.exp(x * y * z);
};
for (const [u, v] of [[0.3, 0.8], [0.6, 0.4]]) {
  const x = 3 * u + v;
  const y = 3 * u - v;
  const z = u * u * v;
  const exponential = Math.exp(x * y * z);
  close(
    derivative((value) => chainExample4(value, v), u),
    (3 * y * z + 3 * x * z + 2 * x * y * u * v) * exponential,
    3e-5,
    "Chapter 13.5 Example 4 u-partial",
  );
  close(
    derivative((value) => chainExample4(u, value), v),
    (y * z - x * z + x * y * u * u) * exponential,
    3e-5,
    "Chapter 13.5 Example 4 v-partial",
  );
}

for (const [x, y] of [[1, 1], [0.8, 1.4]]) {
  const implicitSlope = -(3 * x * x + y * y) / (2 * x * y);
  close(
    3 * x * x + y * y + 2 * x * y * implicitSlope,
    0,
    1e-12,
    "Chapter 13.5 Example 7 implicit derivative",
  );
}

close(
  Math.sqrt(3) + 0.5,
  0.5 + Math.sqrt(3),
  1e-12,
  "Chapter 13.6 Example 1 directional derivative",
);
close(
  0 * 0.5 + -2 * (Math.sqrt(3) / 2),
  -Math.sqrt(3),
  1e-12,
  "Chapter 13.6 Example 2 directional derivative",
);
close(
  -4 * (2 / 3) + 1 / 3 - 2 / 3,
  -3,
  1e-12,
  "Chapter 13.6 Example 3 directional derivative",
);
close(Math.hypot(-4, 4), 4 * Math.sqrt(2), 1e-12, "Chapter 13.6 Example 4 maximum");

function planeValue([a, b, c, d], [x, y, z]) {
  return a * x + b * y + c * z + d;
}

for (const [plane, point, message] of [
  [[1, 8, 1, -18], [1, 2, 1], "Chapter 13.7 Example 1 plane"],
  [[-4, -4, 1, 8], [2, 1, 4], "Chapter 13.7 Example 2 plane"],
  [[1, 1, 2, -6], [2, 2, 1], "Exercise 13.7 #1 plane"],
  [[1, 0, 3, -5], [2, -1, 1], "Exercise 13.7 #2 plane"],
  [[-3, 0, 4, -25], [-3, 0, 4], "Exercise 13.7 #3 plane"],
  [[-9, 4, 10, -76], [-4, 5, 2], "Exercise 13.7 #5 plane"],
  [[1, 0, 1, 1], [-1, 0, 0], "Exercise 13.7 #10 plane"],
  [[0, -3, 1, -1], [Math.PI / 6, 0, 1], "Exercise 13.7 #11 plane"],
  [[3, 2, -12, 30], [4, 9, 5], "Exercise 13.7 #12 plane"],
]) {
  close(planeValue(plane, point), 0, 1e-12, message);
}

close(6 * 2 - (-2) ** 2, 8, 1e-12, "Chapter 13.8 Example 3 discriminant");
for (const [x, y, expectedD] of [
  [0, 0, -16],
  [1, 1, 128],
  [-1, -1, 128],
]) {
  close(
    (-12 * x * x) * (-12 * y * y) - 4 ** 2,
    expectedD,
    1e-12,
    `Chapter 13.8 Example 4 discriminant at (${x},${y})`,
  );
}

// Linear Models checks
// Malthus Example 1: P(t) = P0 e^(0.4055 t) where a = ln(1.5) = 0.4054651081
const malthusExample1 = (t) => Math.exp(Math.log(1.5) * t);
close(malthusExample1(1), 1.5, 1e-12, "Example 1 growth at t=1");
close(Math.log(3) / Math.log(1.5), 2.709511291351455, 1e-12, "Example 1 tripling time calculation");

// Exercise 1: doubling in 5 years, tripling, quadrupling
const growthRateExercise1 = Math.log(2) / 5;
const tTripleExercise1 = Math.log(3) / growthRateExercise1;
const tQuadrupleExercise1 = Math.log(4) / growthRateExercise1;
close(tTripleExercise1, 5 * Math.log(3) / Math.log(2), 1e-12, "Exercise 1 tripling time exact");
close(tQuadrupleExercise1, 10, 1e-12, "Exercise 1 quadrupling time exact");

// Exercise 2: P(3) = 10000 => P0 = 10000 / e^(3a) = 10000 / 2^(3/5) = 6597.53955
const p0Exercise2 = 10000 / (2 ** (3 / 5));
close(p0Exercise2, 6597.539553864472, 1e-12, "Exercise 2 initial population value");
const p10Exercise2 = p0Exercise2 * (2 ** (10 / 5)); // p0 * 4 = 26390.1582
close(p10Exercise2, 26390.158215457886, 1e-12, "Exercise 2 population at t=10");
const rate10Exercise2 = p10Exercise2 * growthRateExercise1; // 26390.1582 * ln(2)/5 = 3658.62
close(rate10Exercise2, 3658.452752315102, 1e-12, "Exercise 2 growth rate at t=10");

// Example 4: Cooling Cake: T(t) = 70 + 230 e^(at) where a = 1/3 ln(13/23) = -0.19018
const aCooling = (1 / 3) * Math.log(13 / 23);
const tCooling = (t) => 70 + 230 * Math.exp(aCooling * t);
close(tCooling(0), 300, 1e-12, "Example 4 initial temperature");
close(tCooling(3), 200, 1e-12, "Example 4 temperature at t=3");
close(tCooling(30), 70.76539037916433, 1e-12, "Example 4 temperature at t=30");

// Exercise 15: Metal Bar: T(t) = 100 - 80 e^(at) where a = ln(39/40) = -0.0253178
const aBar = Math.log(39 / 40);
const tBar = (t) => 100 - 80 * Math.exp(aBar * t);
close(tBar(0), 20, 1e-12, "Exercise 15 initial temperature");
close(tBar(1), 22, 1e-12, "Exercise 15 temperature at t=1");
const tReach90 = Math.log(1 / 8) / aBar;
close(tReach90, 82.1335537014169, 1e-12, "Exercise 15 time to reach 90");
const tReach98 = Math.log(1 / 40) / aBar;
close(tReach98, 145.70295565883683, 1e-12, "Exercise 15 time to reach 98");

// Exercise 29: LR Circuit: L=0.1, R=50, E=30 => i(t) = 0.6(1 - e^{-500 t})
const iCircuit = (t) => 0.6 * (1 - Math.exp(-500 * t));
close(iCircuit(0), 0, 1e-12, "Exercise 29 initial current");
close(iCircuit(1), 0.6, 1e-12, "Exercise 29 steady state current");
close(derivative(iCircuit, 0.002), 0.6 * 500 * Math.exp(-1), 2e-4, "Exercise 29 derivative match");
for (const t of [0.001, 0.005, 0.01]) {
  close(0.1 * derivative(iCircuit, t) + 50 * iCircuit(t), 30, 2e-4, `Exercise 29 ODE check at t=${t}`);
}

console.log("Independent math verification checks passed.");
