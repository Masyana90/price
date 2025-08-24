document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("status").textContent = "✅ Заявка отправлена! Я свяжусь с вами для согласования даты.";
  this.reset();
});
