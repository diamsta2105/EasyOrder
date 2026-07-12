// Easy Order - Main App


// Ημερομηνία εκκίνησης

window.onload = function () {


    let today = new Date();


    let year =
        today.getFullYear();


    let month =
        String(today.getMonth() + 1)
        .padStart(2, "0");


    let day =
        String(today.getDate())
        .padStart(2, "0");



    document.getElementById("date").value =
        year + "-" + month + "-" + day;


};
