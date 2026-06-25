(function () {
  const key = "ode-studio-progress-v1";

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      visited: {},
      checks: {},
      practice: {},
      mixed: { attempts: 0, correct: 0 },
      theme: "dark",
      lastStudyDay: null,
      streak: 0
    };
  }

  function load() {
    try {
      return { ...defaultState(), ...JSON.parse(localStorage.getItem(key) || "{}") };
    } catch (_error) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(key, JSON.stringify(state));
  }

  function markStudied(state) {
    const today = todayKey();
    if (state.lastStudyDay === today) return state;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    state.streak = state.lastStudyDay === yesterdayKey ? state.streak + 1 : 1;
    state.lastStudyDay = today;
    save(state);
    return state;
  }

  function setCheck(state, topicId, check, value) {
    state.checks[topicId] = state.checks[topicId] || {};
    state.checks[topicId][check] = value;
    save(state);
  }

  function visitTopic(state, topicId) {
    state.visited[topicId] = new Date().toISOString();
    markStudied(state);
    save(state);
  }

  function recordPractice(state, topicId, result) {
    state.practice[topicId] = state.practice[topicId] || { yes: 0, no: 0 };
    state.practice[topicId][result] += 1;
    save(state);
  }

  function recordMixed(state, isCorrect) {
    state.mixed.attempts += 1;
    if (isCorrect) state.mixed.correct += 1;
    save(state);
  }

  function topicComplete(state, topicId) {
    const checks = state.checks[topicId] || {};
    return Boolean(checks.theory && checks.examples && checks.practice);
  }

  window.ODEProgress = {
    load,
    save,
    setCheck,
    visitTopic,
    recordPractice,
    recordMixed,
    topicComplete,
    todayKey
  };
})();
