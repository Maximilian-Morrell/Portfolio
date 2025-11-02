function pad(number) {
  return number.toString().padStart(2, "0");
}

function parseLocalTarget(value) {
  const m = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (m) {
    const [, y, M, d, h = "0", min = "0", s = "0"] = m;
    return new Date(
      Number(y),
      Number(M) - 1,
      Number(d),
      Number(h),
      Number(min),
      Number(s)
    );
  }
  return new Date(value);
}

// 🕛 Start date: 02.11.2025 12:00
const startDate = new Date(2025, 10, 2, 12, 0, 0);

// ⚙️ Adjustable decimal precision for percentage
const decimalPlaces = 2; // ← change this to 0, 1, 2, etc.

function getProgressColor(percent) {
  if (percent < 25) return "is-info";       // blue
  if (percent < 50) return "is-success";    // green
  if (percent < 75) return "is-warning";    // yellow
  return "is-danger";                       // red
}

function updateCountdowns() {
  const countdowns = document.querySelectorAll(".countdown");
  const now = Date.now();

  countdowns.forEach(countdown => {
    const target = parseLocalTarget(countdown.dataset.target);
    const distance = target - now;
    const container = countdown.nextElementSibling;
    const progress = container.querySelector("progress");
    const progressText = container.querySelector(".progress-text");

    if (distance <= 0) {
      countdown.textContent = "Countdown finished!";
      progress.value = 100;
      progress.className = "progress is-danger";
      progressText.textContent = "100%";
      return;
    }

    // Calculate progress
    const totalDuration = target - startDate;
    const elapsed = now - startDate;
    const percent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    // Apply settings
    progress.value = percent;
    progress.className = "progress " + getProgressColor(percent);
    progressText.textContent = percent.toFixed(decimalPlaces) + "%";

    // Countdown display
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let parts = [];
    if (days > 0) parts.push(`${days} Day${days > 1 ? 's' : ''}`);
    if (hours > 0 || days > 0) parts.push(`${pad(hours)} Hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${pad(minutes)} Minute${minutes !== 1 ? 's' : ''}`);
    parts.push(`${pad(seconds)} Second${seconds !== 1 ? 's' : ''}`);

    countdown.textContent = parts.join(' ');
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
});
