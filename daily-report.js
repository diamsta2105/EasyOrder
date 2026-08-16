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

// Επαναρίθμηση επισκέψεων

function renumberDailyVisits() {

    document
        .querySelectorAll(
            "#dailyVisitsTableBody tr"
        )
        .forEach((row, index) => {

            const numberCell =
                row.querySelector(
                    ".dailyVisitNumber"
                );


            if (numberCell) {

                numberCell.textContent =
                    index + 1;

            }

        });

}


// Προσθήκη γραμμής επίσκεψης

function addDailyVisitRow() {

    const tableBody =
        document.getElementById(
            "dailyVisitsTableBody"
        );


    if (!tableBody) {

        return;

    }


    const currentRows =
        tableBody.querySelectorAll("tr");


    if (currentRows.length >= 22) {

        alert(
            "Μπορείτε να καταχωρίσετε μέχρι 22 επισκέψεις."
        );

        return;

    }


    const row =
        document.createElement("tr");


    row.innerHTML = `

<td class="dailyVisitNumber"></td>

<td>
    <input
    type="text"
    class="dailyCustomerCode"
    placeholder="Κωδικός">
</td>

<td>
    <input
    type="text"
    class="dailyCustomerName"
    placeholder="Πελάτης">
</td>

<td>
    <input
    type="number"
    class="dailyOrderCount"
    min="0"
    placeholder="">
</td>

<td>
    <input
    type="number"
    class="dailyProductCount"
    min="0"
    placeholder="">
</td>

<td>
    <input
    type="number"
    class="dailySalesValue"
    min="0"
    step="0.01"
    placeholder="">
</td>

<td>
    <input
    type="number"
    class="dailyCollectionValue"
    min="0"
    step="0.01"
    placeholder="">
</td>

<td>
    <input
    type="checkbox"
    class="dailyNewCustomer">
</td>

<td>
    <input
    type="text"
    class="dailyVisitNote"
    placeholder="Προαιρετική σημείωση">
</td>

<td>
    <button
    type="button"
    class="removeDailyVisitButton"
    title="Αφαίρεση επίσκεψης">

    ✕

    </button>
</td>

`;


    const removeButton =
        row.querySelector(
            ".removeDailyVisitButton"
        );


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

            renumberDailyVisits();

        }
    );


    tableBody.appendChild(row);

    renumberDailyVisits();

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

                const addVisitButton =
            document.getElementById(
                "addDailyVisitButton"
            );


        if (addVisitButton) {

            addVisitButton.addEventListener(
                "click",
                addDailyVisitRow
            );

        }


        addDailyVisitRow();

        updateDailyDayName();

    }
);
