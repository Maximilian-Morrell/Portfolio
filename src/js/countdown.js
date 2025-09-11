function pad(number) {
  return number.toString().padStart(2, "0");
}

function updateCountdowns() {
  const countdowns = document.querySelectorAll(".countdown");
  const now = new Date().getTime();

  countdowns.forEach(countdown => {
    const targetDate = new Date(countdown.dataset.target).getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      countdown.textContent = "Countdown finished!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.textContent =
      `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });
}

// Refresh every second
setInterval(updateCountdowns, 1000);

// Run immediately on load
updateCountdowns();
