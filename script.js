document.querySelector(".hamburger").onclick = function() {
    document.querySelector(".navbar").classList.toggle("active");
    document.querySelector(".header").classList.toggle("active");
    this.classList.toggle("is-active"); 
}


function calculateWages() {
    const jobTitle = document.getElementById('searchInput').value;
    let wages = parseFloat(document.getElementById('wages').value);
    const timeframe = document.getElementById('timeframe').value;
    const hours = parseFloat(document.getElementById('hours').value);
    
    // Check data in all input fields 
    if (jobTitle === '' || wages === '' || hours === '' || timeframe === '') {
        alert('Please fill in all required details.');
        return; 
    }
    if(hours > 168){
        alert('Please enter a valid number of hours per week. There are only a total of 168 hours per week.');
        return; 
    }

    const weeksPerYear = 52;
    const monthsPerYear = 12;

    let perYear, perMonth, perWeek, perHour;
    switch (timeframe) {
        case 'year':
            perYear = wages;
            perMonth = wages / monthsPerYear;
            perWeek = wages / weeksPerYear;
            perHour = perWeek / hours;
            break;
        case 'month':
            perMonth = wages;
            perYear = wages * monthsPerYear;
            perWeek = perYear / weeksPerYear;
            perHour = perWeek / hours;
            break;
        case 'week':
            perWeek = wages;
            perHour = wages / hours;
            perYear = perWeek * weeksPerYear;
            perMonth = perYear / monthsPerYear;
            break;
        case 'hour':
            perHour = wages;
            perWeek = perHour * hours;
            perYear = perWeek * weeksPerYear;
            perMonth = perYear / monthsPerYear;
            break;
    }
    function Rounded(wages) {
        return `£${wages.toFixed(2)}`;
    }
    // First letter in uppercase
    let jobName = jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1)

    const resultsHTML = `
    <div class="pay-result-con">
        <div class="pay-result-title">
        <h3><a href="vacancies.html" onclick="searchVacancies()"><strong>${jobName}</strong></a></h3>
            <p>Working ${hours} hours a week for ${Rounded(wages)} per ${timeframe} breaks down into:</p>
        </div>
        <div class="wages-result">
            <div>
                <h4>${Rounded(perHour)}</h4>
                <p> per hour</p>
            </div>
            <div>
                <h4>${Rounded(perWeek)} </h4>
                <p> per hour</p>
            </div>
            <div>
                <h4>${Rounded(perMonth)}</h4>
                <p> per hour</p>
            </div>
            <div>
                <h4>${Rounded(perYear)}</h4>
                <p> per hour</p>
            </div>
        </div>
    </div>
`;

// Create a new list item element
const listItem = document.createElement('li');

// Set the inner HTML of the list item to the results HTML
listItem.innerHTML = resultsHTML;

// Append the list item to the results list
document.getElementById('resultsList').appendChild(listItem);

// Clear the form
document.getElementById('wageForm').reset();
}
