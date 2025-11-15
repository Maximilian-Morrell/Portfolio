document.addEventListener("DOMContentLoaded", () => {
  const url = "https://raw.githubusercontent.com/Maximilian-Morrell/Portfolio/Dev/data.json";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("countdown-container");

      data.forEach(item => {
        const box = document.createElement("div");
        box.classList.add("box");

        box.innerHTML = `
          <h1 class="title is-centered is-size-1 has-text-centered">${item.title}</h1>
          <div class="content">
            <p class="countdown subtitle is-size-2 has-text-centered"
               data-target="${item.target}"
               data-finished="${item.finished}">
            </p>
            <div class="progress-container">
              <progress class="progress" value="0" max="100"></progress>
              <span class="progress-text">0%</span>
            </div>
          </div>
        `;

        container.appendChild(box);
      });

      updateCountdowns();               // first render
      setInterval(updateCountdowns, 1000); // update every second
    })
    .catch(err => console.error("JSON load error:", err));
});


const startDate = new Date(2025, 10, 2, 12, 0, 0); // October = 9
const decimalPlaces = 2;

function getProgressColor(percent) {
  if (percent < 25) return "is-danger";
  if (percent < 50) return "is-warning";
  if (percent < 75) return "is-link";
  return "is-link";
}

function bounceDigit(span, newDigit) {
  if (span.textContent !== newDigit) {
    span.textContent = newDigit;
    span.classList.add("bounce");
    setTimeout(() => span.classList.remove("bounce"), 500);
  }
}

function wrapUnit(labelObj) {
  const unit = document.createElement("span");
  unit.classList.add("unit");
  unit.style.display = "inline-flex"; // keep units in a line

  // placeholder digit
  const span = document.createElement("span");
  span.classList.add("digit");
  span.textContent = "0";
  unit.appendChild(span);

  const spanLabel = document.createElement("span");
  spanLabel.classList.add("label");
  spanLabel.textContent = labelObj.plural;
  unit.appendChild(spanLabel);

  return unit;
}

function updateUnitDigits(unitEl, value, labelObj, isFirstVisible) {
  const digits = unitEl.querySelectorAll(".digit");
  const valStr = isFirstVisible ? value.toString() : value.toString().padStart(2, "0");

  // Ensure each character has a span
  if (digits.length !== valStr.length) {
    // Clear old digits
    digits.forEach(d => d.remove());
    // Add new digit spans
    valStr.split("").forEach(d => {
      const span = document.createElement("span");
      span.classList.add("digit");
      span.textContent = d;
      unitEl.insertBefore(span, unitEl.querySelector(".label"));
      // Add bounce animation
      span.classList.add("bounce");
      setTimeout(() => span.classList.remove("bounce"), 500);
    });
  } else {
    // Update existing digits with bounce
    valStr.split("").forEach((d, i) => bounceDigit(digits[i], d));
  }

  // Update label
  const spanLabel = unitEl.querySelector(".label");
  spanLabel.textContent = value === 1 ? labelObj.singular : labelObj.plural;
}


function updateCountdowns() {
  const countdowns = document.querySelectorAll(".countdown");
  const now = Date.now();

  countdowns.forEach(cd => {
    const target = new Date(cd.dataset.target);
    let distance = target - now;

    const container = cd.nextElementSibling;
    const progress = container.querySelector("progress");
    const progressText = container.querySelector(".progress-text");

    if (distance <= 0) {
      const finishedMessage = cd.dataset.finished || "Countdown finished!";
      cd.innerHTML = finishedMessage; // display your message

      progress.value = 100;
      progress.className = "progress is-success";
      progressText.textContent = "100%";
      return;
    }

    // Progress
    const totalDuration = target - startDate;
    const elapsed = now - startDate;
    const percent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    progress.value = percent;
    progress.className = "progress " + getProgressColor(percent);
    progressText.textContent = percent.toFixed(decimalPlaces) + "%";

    // Time breakdown
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const units = [
      { value: days, singular: "Day", plural: "Days" },
      { value: hours, singular: "Hour", plural: "Hours" },
      { value: minutes, singular: "Minute", plural: "Minutes" },
      { value: seconds, singular: "Second", plural: "Seconds" },
    ];

    // Initialize units if not exists
    if (!cd.hasChildNodes()) {
      cd.innerHTML = "";
      units.forEach(u => cd.appendChild(wrapUnit(u)));
    }

    const unitEls = cd.querySelectorAll(".unit");

    // Determine first visible unit index
    let firstVisibleIndex = units.findIndex(u => u.value > 0);
    if (firstVisibleIndex === -1) firstVisibleIndex = units.length - 1;

    // Update each unit
    units.forEach((u, i) => {
      const isFirstVisible = i === firstVisibleIndex;
      updateUnitDigits(unitEls[i], u.value, u, isFirstVisible);
      unitEls[i].style.display = i < firstVisibleIndex ? "none" : "inline-flex";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
});
