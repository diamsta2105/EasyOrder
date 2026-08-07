// Easy Order - Customers Management


// Αναζήτηση πελάτη με κωδικό

function findCustomerByCode(element) {

    let code =
        element.value.trim();


    let customer =
        customersDatabase.find(
            item => item.code === code
        );


    if (customer) {

        document.getElementById("customer").value =
            customer.name;


        document.getElementById("area").value =
            customer.area || "";

    }

}





// Αναζήτηση πελάτη με επωνυμία

function searchCustomer(element) {

    

    let text =
        element.value.toLowerCase();


    let box =
        document.querySelector(".customerSuggestions");


    box.innerHTML = "";


    if (text.length < 2) {

        return;

    }


    let results =
        customersDatabase.filter(customer =>
            customer.name
            .toLowerCase()
            .includes(text)
        );



    results.forEach(customer => {


        let option =
            document.createElement("div");


        option.innerText =
            customer.name;



        option.onclick = function () {


            document.getElementById("customer").value =
                customer.name;


            document.getElementById("customerCode").value =
                customer.code;


            document.getElementById("area").value =
                customer.area || "";


            box.innerHTML = "";

        };


        box.appendChild(option);


    });

}

// Εμφάνιση / απόκρυψη στοιχείων νέου πελάτη

function toggleNewCustomerFields() {

    const checkbox =
        document.getElementById("newCustomer");

    const fields =
        document.getElementById("newCustomerFields");


    if (!checkbox || !fields) {

        return;

    }


    if (checkbox.checked) {

        fields.style.display = "block";

    } else {

        fields.style.display = "none";

    }

}
