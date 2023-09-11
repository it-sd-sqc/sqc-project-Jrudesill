const toggleButton = document.getElementById('toggle-mode');
const body = document.body;

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark');
});