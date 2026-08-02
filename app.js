// ==========================================
// Easy Order - Main App
// ==========================================

// Επιστρέφει τη σημερινή ημερομηνία
// στη μορφή YYYY-MM-DD
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


// Ορίζει τη σημερινή ημερομηνία
function setTodayDate() {
    const dateInput =
        document.getElementById("date");

    if (dateInput) {
        dateInput.value =
            getTodayDate();
    }
}


// Εκτελείται όταν φορτώσει η σελίδα
window.addEventListener(
    "DOMContentLoaded",
    function () {

        setTodayDate();

    }
);
