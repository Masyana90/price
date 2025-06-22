
document.querySelectorAll('.accordion button').forEach(btn => {
  btn.addEventListener('click', function () {
    const panel = this.nextElementSibling;
    const isOpen = this.classList.contains('active');
    document.querySelectorAll('.accordion button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.accordion .panel').forEach(p => p.style.display = 'none');
    if (!isOpen) {
      this.classList.add('active');
      panel.style.display = 'block';
    }
  });
});

// Ограничения по датам — только Пн, Пт, Сб
const allowedDays = [1, 5, 6]; // Пн, Пт, Сб
document.getElementById("date").addEventListener("input", function () {
  const day = new Date(this.value).getDay();
  if (!allowedDays.includes(day)) {
    alert("Вы можете записаться только на понедельник, пятницу или субботу.");
    this.value = "";
  }
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("status").textContent = "✅ Заявка отправлена! Мы свяжемся с вами.";
  this.reset();
});
