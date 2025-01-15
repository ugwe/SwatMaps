//clearing textbox when clear button clicked
const formTextBox = document.getElementById('formMessage');
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function () {
    formTextBox.value = '';
});

//sending message to db
function inputRow() {
    var input_text = document.getElementById("formMessage").value;
    
    //Request to server
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            //Check to see that we are able to get the input value
            console.log(input_text); 
        }
    };
    xhttp.open("GET", "inputRow/" + input_text, true);
    xhttp.send();
}


const modalButton = document.getElementById("submitButton");

//toggle modal & clear text box
const toggleModal = () => {
    const modal = document.getElementById('thanks-modal');
    modal.style.display = "flex";
    setTimeout(() => {
      const modal = document.getElementById('thanks-modal');
      modal.style.display = "none";
      clearInterval(2300);
    }, 2500)
    formTextBox.value = '';
  }

modalButton.addEventListener("click", toggleModal);