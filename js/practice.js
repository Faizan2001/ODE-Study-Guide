(function () {
  function createPracticeSession(items) {
    let index = Math.floor(Math.random() * items.length);
    let answered = false;

    function current() {
      return items[index];
    }

    function next() {
      index = Math.floor(Math.random() * items.length);
      answered = false;
      return current();
    }

    function markAnswered() {
      answered = true;
    }

    function hasAnswered() {
      return answered;
    }

    return { current, next, markAnswered, hasAnswered };
  }

  window.ODEPractice = { createPracticeSession };
})();
