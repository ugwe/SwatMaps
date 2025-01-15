// Create a map
var map = L.map('map').setView([39.906383,-75.353873], 17);

// Add a tile layer (for example, OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//current location
var current_location = L.control.locate({
    flyTo: true,
    returnToPrevBounds: true,
    showPopup: false, 
    locateOptions: {watch: true, enableHighAccuracy: true}
}).addTo(map);

// Define marker coordinates and names
var markerData = [
    {id: 'marker1', lat: 39.905180, lng: -75.354183, name: 'Parrish Hall', nicknames: ['parrish']},
    {id: 'marker2', lat: 39.905890, lng: -75.354825, name: 'Kohlberg Hall', nicknames: ['kohlberg']},
    {id: 'marker3', lat: 39.905411, lng: -75.355315, name: 'Lang Performing Arts Center', nicknames: ['lpac']},
    {id: 'marker4', lat: 39.905461, lng: -75.356120, name: 'Lang Music', nicknames: ['lang music']},
    {id: 'marker5', lat: 39.906681, lng: -75.355772, name: 'Science Center', nicknames: ['sci center', 'sci', 'eldridge commons', 'sci cafe']},
    {id: 'marker6', lat: 39.907020, lng: -75.354306, name: 'Singer Hall', nicknames: ['singer', 'bep']},
    {id: 'marker7', lat: 39.906532, lng: -75.354759, name: 'Beardsley Hall', nicknames: ['beardsley']},
    {id: 'marker8', lat: 39.906421, lng: -75.353911, name: 'Trotter Hall', nicknames: ['trotter']},
    {id: 'marker9', lat: 39.906884, lng: -75.353592, name: 'Pearson Hall', nicknames: ['pearson']},
    {id: 'marker10', lat: 39.908150, lng: -75.353925, name: 'Lang Center for Civic and Social Responsibility', nicknames: ['lang center']},
    {id: 'marker11', lat: 39.908331, lng: -75.354182, name: 'Whittier Hall', nicknames: ['whittier']},
    {id: 'marker12', lat: 39.904494, lng: -75.351963, name: 'Old Tarble', nicknames: ['old tarble']},
    {id: 'marker13', lat: 39.905350, lng: -75.352788, name: 'McCabe', nicknames: ['mccabe', 'mccabe library']},
    {id: 'marker14', lat: 39.904288, lng: -75.354816, name: 'Clothier Hall', nicknames: ['clothier', "essie's", "essies", "essie", "essie mae's", "essie maes"]},
];

//default marker style
//got icon img from https://github.com/lennardv2/Leaflet.awesome-markers
var markerStyle = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}); 

//marker icon to change color on click
var clickedonicon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//fullscreen map button initialization
map.addControl(new L.Control.Fullscreen());

//Slide Menu Instantiation
let slideMenu = L.control.slideMenu("", {
    width: "310px",
    height: "85vh",
});

// function for saving this.responseText to a variable
var building_data;
function processData(data) {
    // Setting global variable 
    building_data = JSON.parse(data);
    // console.log(building_data);

    // Display buildings
    display_building_names();
}

function getRow() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            // console.log("Response Data: " + this.responseText);
            processData(this.responseText);
        }
    };
    xhttp.open("GET", "getRow", true);
    xhttp.send();
}
getRow();

function display_building_names() {
    // Create markers with names
    for (var i = 0; i < markerData.length; i++) {
        var marker = L.marker([markerData[i].lat, markerData[i].lng], {icon: markerStyle, 
            id:markerData[i].id, nicknames:markerData[i].nicknames}).addTo(map);

        // console.log(building_data[1]);
        let generatedHtml = '<strong>' + building_data[i][1] +' </strong>';
        let sidebar_title = '<div class="header">' + building_data[i][1] + '</div>';
        let sidebar_images = '<br>' + building_data[i][2];
        // console.log(generatedHtml);
        marker.bindPopup(generatedHtml)

        //change marker color to original on closing popup
        .on('popupclose', function(e){
            e.target.setIcon(markerStyle);
            try {
                if (slideMenu) {
                    // console.log("slideMenu exists");
                    slideMenu.hide();
                }
            } catch (error) {
                console.error("Error while hiding slideMenu:", error);
            }
        })

        //right slide menu on icon click
        .on('click', function(e){
            e.target.setIcon(clickedonicon);
            e.target.openPopup();
            slideMenu.addTo(map);
            slideMenu.setContents(sidebar_title + sidebar_images);
        })
    }
}

//search bar
const searchInput = document.getElementById('search-bar');
const searchButton = document.getElementById('searchButton');
let previousMarker = null;

//search function
function searching (markerData) {
    const userSearchLocation = searchInput.value.toLowerCase();
    //change marker styling and color to gold when search found
    var newMarkerStyle = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [37.5, 61.5],
        iconAnchor: [18, 61],
        popupAnchor: [0, -55],
        shadowSize: [41, 41]
    });

    //iterate over the markerData array and check if the user input matches a marker name or nickname
    for (i = 0; i < markerData.length; i++) {
        const markerName = markerData[i].name.toLowerCase();
        const markerNicknames = markerData[i].nicknames;
        const markerId = markerData[i].id;

        if (userSearchLocation === markerName || markerNicknames.includes(userSearchLocation)) { 
            if (previousMarker) {
                previousMarker.setIcon(markerStyle);
            }
            //access the existing marker directly and update its icon
            const existingMarker = findMarkerById(markerId);
            if (existingMarker) {
                existingMarker.setIcon(newMarkerStyle).openPopup();
                previousMarker = existingMarker;
                return;
            }
        }
        //if searched for just lang, alert user to specify which lang building
        else if (userSearchLocation == "lang") {
            alert("Please specify which Lang building you are looking for...(we have three of them!)"); 
            if (previousMarker) {
                previousMarker.setIcon(markerStyle);
                previousMarker.closePopup();
                previousMarker = null;
            }
            return;
        }
        //silly easter egg
        else if (userSearchLocation == "your mum" || userSearchLocation == "your mom" 
        || userSearchLocation.includes("urmum") || userSearchLocation.includes("ur mum")
        || userSearchLocation.includes("urmom") || userSearchLocation.includes("ur mom")
        || userSearchLocation.includes("your mama") || userSearchLocation.includes("yo mum")
        || userSearchLocation.includes("yo mama") || userSearchLocation.includes("yo mom")
        || userSearchLocation == "ur mom's house" || userSearchLocation == "your mom's house"
        || userSearchLocation == "ur moms house" || userSearchLocation == "your moms house") {
        alert("very funny... >:(("); 
        if (previousMarker) {
            previousMarker.setIcon(markerStyle);
            previousMarker.closePopup();
            previousMarker = null;
        }
        return;
        }
    }
    alert("Location not found. Please try again.")

    //returns last clicked marker to original red icon color and size 
    if (previousMarker) {
        previousMarker.setIcon(markerStyle);
        previousMarker.closePopup();
        previousMarker = null;
    }

    map.closePopup();
}
 
function findMarkerById(markerId) {
    //iterate over the markers on the map and find the one with the matching id
    for (const markerIdName in map._layers) {
        const marker = map._layers[markerIdName];
        if (marker instanceof L.Marker && marker.options.id === markerId) {
            return marker;
        }
    }
    return null; //return null if no matching marker is found
}

//event listener for the search button & resets search bar input text after search
searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    searching(markerData);
    searchInput.value = '';
});

//reset marker to original icon when map is clicked
map.on('click', () => {
    if (previousMarker) {
        previousMarker.setIcon(markerStyle);
        previousMarker = null; 
    }
});

var githubbutton = new L.Control.Button('GitHub');
githubbutton.addTo(map);
githubbutton.on('click', function () {
    window.open('https://github.swarthmore.edu/tchen7/SWE-SWAT-MAPS');
});

//search box autocomplete feature
const destinations = ["Beardsley Hall", "Clothier Hall", "Eldridge Commons",
                "Essie's","Kohlberg Hall", "Lang Music", 
                "Lang Performing Arts Center", "Lang Center for Civic and Social Responsibility", 
                "McCabe Library", "Old Tarble", "Parrish Hall", "Pearson Hall", 
                "Science Center", "Singer Hall", "Trotter Hall", "Whittier Hall"];

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            // searching(markerData);
            // searchInput.value = '';
            closeAllLists();
            });
        a.appendChild(b);
        }
    }
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
            if (currentFocus >= 0 && currentFocus < x.length) {
                searchInput.value = x[currentFocus].getElementsByTagName("input")[0].value;
            }
        } else if (e.keyCode == 38) { 
            currentFocus--;
            addActive(x);
            if (currentFocus >= 0 && currentFocus < x.length) {
                searchInput.value = x[currentFocus].getElementsByTagName("input")[0].value;
            }
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
              if (x) x[currentFocus].click();
            }
            searching(markerData);
            searchInput.value = '';
            closeAllLists();
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
        }
    }
    }

    document.addEventListener("click", function (e) {
    closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("search-bar"), destinations);