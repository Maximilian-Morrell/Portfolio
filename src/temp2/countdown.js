const decimalPlaces = 2;

document.addEventListener("DOMContentLoaded", () => {
  const url = "https://max.morrell.at/data.json";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const newContainer = document.getElementById("countdown-container");
      const oldContainer = document.getElementById("old-countdown-container");

      data.forEach((item, index) => {
        if(!item.isHidden) {
       const box = document.createElement("div");
        box.classList.add("box");
        box.style.cursor = "pointer";

        box.addEventListener("click", () => {
          window.location.href = `/countdown/countdown.html?id=${index}`;
        });

        const date = new Date(item.target);
        const startdate = new Date(item.start);
        const pad = n => String(n).padStart(2, "0");

        const visualDate =
          `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
          `${pad(date.getHours())}:${pad(date.getMinutes())}`;

        box.innerHTML = `
          <h1 class="title is-size-1 has-text-centered">${item.title}</h1>
          <h2 class="subtitle is-size-3 has-text-centered">${visualDate}</h2>

          <p class="countdown subtitle is-size-2 has-text-centered"
            data-target="${item.target}"
            data-start="${item.start}"
            data-finished="${item.finished}"
            data-is-count-up="${item.isCountUp}">
            Loading
          </p>


          <div class="progress-container">
            <progress class="progress" value="0" max="100"></progress>
            <span class="progress-text">0%</span>
          </div>
        `;

        if (item.isFinished) {
          oldContainer.appendChild(box);
        } else {
          newContainer.appendChild(box);
        }
      };
    })

      if (oldContainer.children.length === 0) {
        document.getElementById("Seperator-Old-Countown").style.display = "none";
        oldContainer.style.display = "none";
      }

      updateCountdowns();
      setInterval(updateCountdowns, 1000);
    })
    .catch(err => console.error("JSON load error:", err));
});


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
  unit.style.display = "inline-flex";

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
  const valStr = isFirstVisible
    ? value.toString()
    : value.toString().padStart(2, "0");

  if (digits.length !== valStr.length) {
    digits.forEach(d => d.remove());
    valStr.split("").forEach(d => {
      const span = document.createElement("span");
      span.classList.add("digit");
      span.textContent = d;
      unitEl.insertBefore(span, unitEl.querySelector(".label"));
      span.classList.add("bounce");
      setTimeout(() => span.classList.remove("bounce"), 500);
    });
  } else {
    valStr.split("").forEach((d, i) => bounceDigit(digits[i], d));
  }

  const spanLabel = unitEl.querySelector(".label");
  spanLabel.textContent = value === 1
    ? labelObj.singular
    : labelObj.plural;
}

function updateCountdowns() {
  const countdowns = document.querySelectorAll(".countdown");
  const now = Date.now();

  countdowns.forEach(cd => {
    const target = new Date(cd.dataset.target);
    const start = new Date(cd.dataset.start);
    const isOver = now >= target;
    const isCountUp = cd.dataset.isCountUp === "true"; // read from dataset

    let distance = isCountUp && isOver ? now - target : target - now;

    const container = cd.nextElementSibling;
    const progress = container.querySelector("progress");
    const progressText = container.querySelector(".progress-text");

    // Hide progress bar if counting up
    if (isCountUp) {
      container.style.display = "none";
    } else {
      container.style.display = "block";
    }

    if (!isCountUp && distance <= 0) {
      cd.innerHTML = cd.dataset.finished || "Countdown finished!";
      progress.value = 100;
      progress.className = "progress is-success";
      progressText.textContent = "100%";
      return;
    }

    const totalDuration = target - start;
    const elapsed = now - start;
    const percent = isCountUp
      ? 0
      : Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    if (!isCountUp) {
      progress.value = percent;
      progress.className = "progress " + getProgressColor(percent);
      progressText.textContent = percent.toFixed(decimalPlaces) + "%";
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((distance / (1000 * 60)) % 60);
    let seconds = Math.floor((distance / 1000) % 60);

    if (days < 0) days = hours = minutes = seconds = 0;

    const units = [
      { value: days, singular: "Day", plural: "Days" },
      { value: hours, singular: "Hour", plural: "Hours" },
      { value: minutes, singular: "Minute", plural: "Minutes" },
      { value: seconds, singular: "Second", plural: "Seconds" }
    ];

    if (!cd.querySelector(".unit")) {
      cd.innerHTML = "";
      units.forEach(u => cd.appendChild(wrapUnit(u)));
    }

    const unitEls = cd.querySelectorAll(".unit");
    let firstVisibleIndex = units.findIndex(u => u.value > 0);
    if (firstVisibleIndex === -1) firstVisibleIndex = units.length - 1;

    units.forEach((u, i) => {
      updateUnitDigits(unitEls[i], u.value, u, i === firstVisibleIndex);
      unitEls[i].style.display = i < firstVisibleIndex ? "none" : "inline-flex";
    });
  });
}

