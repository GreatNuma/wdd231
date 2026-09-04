// Output current year
const currentYearElement = document.getElementById("currentyear");
const currentYear = new Date().getFullYear();
currentYearElement.innerHTML = currentYear;

// Output last modified date
const lastModifiedElement = document.getElementById("lastModified");
lastModifiedElement.innerHTML = `Last Modification: ${document.lastModified}`;