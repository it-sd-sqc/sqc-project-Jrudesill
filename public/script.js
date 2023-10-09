//Get the HTML element that will be toggled between light and dark modes
const body = document.body

//Check if the user has a preference for light or dark mode
const prefersDarkMode = window.mathMedia('(prefers-color-scheme: dark)').matches

//Function to toggle between light and dark modes
function toggleTheme() {

    //Check the current theme and toggle it 
    if (body.classList.contains('dark-them')) {
        body.classList.remove('dark-theme')
        body.classList.add('light-theme')
        body.classList.setItem('theme', 'light')

    } else {
        body.classList.remove('light-theme')
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark')
    }

}

//Function to set the theme based on user preferences or stored preference
function setTheme() {
    if (prefersDarkMode) {
        body.classList.add('dark-theme')
    } else {
        body.classList.add('light-theme')
    }

    //Check if there's a stored preference and apply it
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
        body.classList.add('dark-theme')

    } else if (storedTheme === 'light') {
      body.classList.add('light-theme')
    }
}

//Add an event listener to a button or element to trigger the theme toggle
const toggleButton = document.getElementById('toggle-theme-button')
if (toggleButton) {
    toggleButton.addEventListener('click' , toggleTheme)
}


//Initialize the theme
setTheme();