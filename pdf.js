// pdf.js

function createPDF(order) {

    const { jsPDF } = window.jspdf;


    let doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });


    let pageWidth = doc.internal.pageSize.getWidth();


    // Ελληνική γραμματοσειρά
    doc.addFont(
        "NotoSans-Regular.ttf",
        "NotoSans",
        "normal"
    );

    doc.setFont(
        "NotoSans"
    );


    let y = 15;


    // Κεφαλίδα

    doc.setFontSize(14);

    doc.text(
        "FÖRCH",
        15,
        y
    );


    doc.text(
        "Easy Order",
        pageWidth - 45,
        y
    );


    y += 10;


    doc.setFontSize(18);

    doc.text(
        "ΔΕΛΤΙΟ ΠΑΡΑΓΓΕΛΙΑΣ",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 12;


    doc.setFontSize(10);
    // Στοιχεία παραγγελίας

    doc.text(
        "Αριθμός:",
        15,
        y
    );

    doc.text(
        String(order.number),
        45,
        y
    );


    y += 6;


    doc.text(
        "Ημερομηνία:",
        15,
        y
    );

    doc.text(
        order.date,
        45,
        y
    );


    y += 6;


    doc.text(
        "Πελάτης:",
        15,
        y
    );

    doc.text(
        order.customer,
        45,
        y
    );


    y += 6;


    doc.text(
        "Περιοχή:",
        15,
        y
    );

    doc.text(
        order.area,
        45,
        y
    );


    y += 10;



    // Πίνακας προϊόντων

    let columns = [
        "Κωδικός",
        "Περιγραφή",
        "Ποσ.",
        "Τιμή",
        "Έκπτωση",
        "Σύνολο"
    ];


    let rows = [];


    order.products.forEach(product => {

        rows.push([

            product.code,

            product.description,

            product.quantity,

            product.price,

            product.discount + "%",

            product.finalPrice

        ]);

    });



    doc.autoTable({

        startY: y,

        head: [columns],

        body: rows,

        styles: {
            font: "NotoSans",
            fontSize: 8
        },

        headStyles: {
            font: "NotoSans"
        }

    });


    y =
    doc.lastAutoTable.finalY + 10;
// Σύνολο παραγγελίας

doc.setFontSize(12);

doc.text(
    "Σύνολο:",
    15,
    y
);


doc.text(
    order.total,
    45,
    y
);


y += 10;



// Παρατηρήσεις (μόνο αν υπάρχουν)

if (order.notes && order.notes.trim() !== "") {


    doc.setFontSize(11);


    doc.text(
        "Παρατηρήσεις:",
        15,
        y
    );


    y += 6;


    doc.setFontSize(10);


    let notes =
        doc.splitTextToSize(
            order.notes,
            170
        );


    doc.text(
        notes,
        15,
        y
    );


}

return doc;

}


// Δημιουργία αρχείου PDF

function downloadPDF(order) {

    let doc = createPDF(order);

    doc.save(
        "Παραγγελία-" +
        order.number +
        ".pdf"
    );

}
