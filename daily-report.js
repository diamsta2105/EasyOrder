// ==========================================
// Easy Order - Ημερήσια κατάσταση
// ==========================================


// Σημερινή ημερομηνία σε μορφή YYYY-MM-DD

function getDailyTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// Εμφάνιση ελληνικής ημέρας

function updateDailyDayName() {

    const dateInput =
        document.getElementById(
            "dailyDate"
        );


    const dayInput =
        document.getElementById(
            "dailyDayName"
        );


    if (
        !dateInput ||
        !dayInput ||
        !dateInput.value
    ) {

        return;

    }


    const dayNames = [

        "Κυριακή",
        "Δευτέρα",
        "Τρίτη",
        "Τετάρτη",
        "Πέμπτη",
        "Παρασκευή",
        "Σάββατο"

    ];


    const selectedDate =
        new Date(
            dateInput.value +
            "T12:00:00"
        );


    dayInput.value =
        dayNames[
            selectedDate.getDay()
        ];

}


// Εκκίνηση σελίδας ημερήσιας

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const dateInput =
            document.getElementById(
                "dailyDate"
            );


        const sellerInput =
            document.getElementById(
                "dailySeller"
            );


        if (dateInput) {

            dateInput.value =
                getDailyTodayDate();


            dateInput.addEventListener(
                "change",
                updateDailyDayName
            );

        }


        if (sellerInput) {

            sellerInput.value =
                localStorage.getItem(
                    "todaySeller"
                ) || "";

        }


        updateDailyDayName();

    }
);
