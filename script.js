// Store your OpenWeatherMap API key.
const apiKey = "YOUR_API_KEY";

// Find the HTML element where we display the weather data.
const weatherData = document.getElementById("weatherdata");
const fetchButton = document.getElementById("fetchWeather");

const searchInput = document.getElementById("citysearch");
const searchButton = document.getElementById("search");

const cityDropdown = document.getElementById("city");

// Run this function when the user clicks the "Fetch data" button.
// async allows us to use await inside the function.
async function fetchWeather(city)  {

    // Try to fetch and process the weather data.
    try {

        // Display a loading message.
        weatherData.textContent = "Loading weather data...";

    

        // Send a GET request to the weather API and wait for the response.
        // q=Helsinki selects the city.
        // units=metric gives the temperature in Celsius.
        // mode=xml requests the data in XML format.
        // ${apiKey} inserts our API key into the URL.
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&mode=xml&appid=${apiKey}`;

        const response = await fetch(url);

        // Check whether the API returned a successful HTTP status.
        if (!response.ok) {

            // Create an error and jump to the catch block.
            throw new Error("Something went wrong!");
        }

        // Read the response body as text and wait until it is ready.
        const xmlText = await response.text();
        
        // Create a parser and convert the XML text into an XML document.
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        if (xmlDoc.querySelector("parsererror")) {
        throw new Error("Could not parse XML data.");
}
        // Parse the XML and extract the weather information.
        const cityName = xmlDoc.querySelector("city").getAttribute("name");
        const temperature = xmlDoc.querySelector("temperature").getAttribute("value");
        const humidity = xmlDoc.querySelector("humidity").getAttribute("value");
        const clouds = xmlDoc.querySelector("clouds").getAttribute("value");
        
        // Display the weather information on the webpage.
       weatherData.innerHTML = `
       <h3>Weather in ${cityName}</h3>
       <p>Temperature: ${temperature} °C</p>
       <p>Humidity: ${humidity}%</p>
       <p>Cloudiness: ${clouds}%</p>
`;
    }
        // Handle errors from the request or the code above.
        catch (error) {

        // Choose an error message in the page's language.
        const errorMessage = "Unable to retrieve weather information.";


        // Display the message and details of the error.
        weatherData.textContent = errorMessage + " " + error.message;

        console.error(error);
    }

} 

// Listen for clicks on the Fetch data button.
fetchButton.addEventListener("click", function () {
    fetchWeather(cityDropdown.value);
});

// Listen for changes to the city dropdown and fetch weather for the selected city.
cityDropdown.addEventListener("change", function () {
    fetchWeather(cityDropdown.value);
});

// Listen for clicks on the search button.
searchButton.addEventListener("click", function () {

    // Get the city name entered by the user.
    const city = searchInput.value.trim();

    // Check that the search box is not empty.
    if (city === "") {
        weatherData.textContent = "Please enter a city name.";
        return;
    }

    fetchWeather(city);
});
