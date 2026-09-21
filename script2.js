document.addEventListener('DOMContentLoaded', function() {
    searchVacancies(); // Fetch and display recent vacancies on load
});

function searchVacanciesInput(){
    let jobInput = document.getElementById("searchInput").value.toLowerCase();
    let locationInput = document.getElementById("locationInput").value.toLowerCase();

    // Check if the jobInput is empty
    if (jobInput === "" && locationInput === "") {
        alert("Please enter a job title or location.");
        return; // Exit the function if input is empty            
    }
    searchVacancies();
    document.getElementById('searchForm').reset();
}

function searchVacancies() {
    let jobInput = document.getElementById("searchInput").value.toLowerCase();    
    let locationInput = document.getElementById("locationInput").value.toLowerCase();

    let baseUrl = "https://api.lmiforall.org.uk/api/v1/vacancies/search?";
    let url = "";
       
    if (locationInput.length > 0) {
        url += "location=" + encodeURIComponent(locationInput);
    }
    if (jobInput.length > 0) {
        if (url !== ""){
            url += "&";
        }
        url += "keywords=" + encodeURIComponent(jobInput);
    }


    url = baseUrl + url;


    console.log(url);

    fetch(url)
        .then(response => {
            // error handling
            if (response.status == 404) {
                alert("Job not found");  
                // Throwing an error ensures that the rest of the code is not executed
                throw new Error("Job not found");
            }
            // If the status code is not 404, we can assume that we have received data 
            // and we can return the response
            return response;
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayJobs(data);

        })
        .catch(error => {
            console.error(error);
            alert("Failed to fetch data .");
        })
        
}

function collapseResult() {

    let resultContent = this.nextElementSibling;
    resultContent.classList.toggle("hidden");

    let colSymbol = this.querySelector(".col_symbol");
    let icon = colSymbol.querySelector("i");
    if (icon.classList.contains('bx-chevron-down')) {
        icon.classList.remove('bx-chevron-down');
        icon.classList.add('bx-chevron-up');
        // Change bg and font color of result_header
        this.style.backgroundColor = '#0D698B';
        this.style.color = "white";
    } else {
        icon.classList.remove('bx-chevron-up');
        icon.classList.add('bx-chevron-down');
        // Return to original color
        this.style.backgroundColor = '';
        this.style.color = "";
    }
}

function displayJobs(data) {
    const resultsDiv = document.getElementById("jobResults");
    resultsDiv.innerHTML = ''; // Clear previous results

    // Add title
    const titleDiv = document.createElement("div");
    titleDiv.innerHTML = "<h2> Recent <span class='highlight'> Job Vacancies </span> </h2>"; 
    resultsDiv.appendChild(titleDiv);

        
    // If there is no result, display message
    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No jobs found. Try different keywords.</p>';
        return;
    }

    data.slice(0, 10).forEach(job => {
        // For each job, create a div and append information
        const jobDiv = document.createElement("div");
        const str = job.title;
        let title = str.charAt(0).toUpperCase() + str.slice(1);
        jobDiv.classList.add("job-item");
        jobDiv.innerHTML = `
            <section id="result">
                <h3 class="result_header">${title}
                    <span class="col_symbol"> <i class='bx bx-chevron-down'></i></span> 
                </h3>
                <div class="result_div"> 
                    <div class="result_content"> 
                        <div class="space-between">
                            <div> 
                                <h4>Location: </h4> 
                                <p>${job.location.location}</p>
                            </div>
                            <div>
                                <h4>Company:</h4>
                                <p>${job.company}</p>
                            </div>
                        </div>
                        <h4>Summary:</h4>
                        <p>${job.summary}</p>
                        <a href="${job.link}" target="_blank">Apply Now</a>
                    </div>
                    <div id="soc_div">
                        <h2>Related <span class='highlight'> Job Description: </span> </h2>
                    </div>
                </div>
            </section>
        `;
        resultsDiv.appendChild(jobDiv);

        // Event listener to collapse result content
        let resultHeader = jobDiv.querySelector(".result_header");
        resultHeader.addEventListener("click", collapseResult);

        // Collapse the result content
        let resultContent = jobDiv.querySelector(".result_div");
        resultContent.classList.add("hidden");

        // Get job title for new API call
        let jobTitle = job.title;
        newAPI(jobTitle, jobDiv);
    });
}

function newAPI(jobTitle, jobDiv) {
    let baseUrlSoc = "https://api.lmiforall.org.uk/api/v1/soc/search?q=";
    let socUrl = baseUrlSoc + encodeURIComponent(jobTitle);
    fetch(socUrl)
        .then(response => {
            // error handling
            if (response.status == 404) {
                alert("Title not found");  
                // Throwing an error ensures that the rest of the code is not executed
                throw new Error("Title not found");
            }
            // If the status code is not 404, we can assume that we have received data 
            // and we can return the response
            return response;
        })
        .then(response => response.json())
        .then(socdata => {
            console.log(socdata);
            const socDiv = jobDiv.querySelector("#soc_div");
            if (socdata.length === 0) {
                const jobDiv2 = document.createElement("div");
                jobDiv2.innerHTML = '<p>No available result for related job description.</p>';
                socDiv.appendChild(jobDiv2);
                return;
            }
          
            socdata.forEach(job => {
                const jobDiv2 = document.createElement("div");
                jobDiv2.innerHTML = `
                <li> <h3>${job.title}</h3>
                        <p>
                            ${job.description} 
                        </p>
                        </li>
                `;
                socDiv.appendChild(jobDiv2);
            });
        })
        .catch(error => {
            console.error(error);
            alert("Failed to fetch data .");
        });
}
