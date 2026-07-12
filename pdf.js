// Easy Order - PDF Management


function createPDF(index) {


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    let order =
        drafts[index];



    if (!order) {

        return;

    }



    const { jsPDF } =
        window.jspdf;



    let doc =
        new jsPDF();



    doc.setFontSize(18);

    doc.text(
        "FÖRCH - Easy Order",
        20,
        20
    );



    doc.setFontSize(12);


    doc.text(
        "Παραγγελία: " + order.id,
        20,
        35
    );


    doc.text(
        "Πελάτης: " + order.customer,
        20,
        45
    );


    doc.text(
        "Περιοχή: " + order.area,
        20,
        55
    );


    doc.text(
        "Ημερομηνία: " + order.date,
        20,
        65
    );



    let y = 85;



    doc.text(
        "Κωδικός",
        20,
        y
    );


    doc.text(
        "Περιγραφή",
        50,
        y
    );


    doc.text(
        "Ποσ.",
        120,
        y
    );


    doc.text(
        "Τελική",
        150,
        y
    );



    y += 10;



    order.products.forEach(product => {


        doc.text(
            product.code,
            20,
            y
        );


        doc.text(
            product.description,
            50,
            y
        );


        doc.text(
            String(product.quantity),
            120,
            y
        );


        doc.text(
            product.finalPrice + " €",
            150,
            y
        );


        y += 10;


    });



    doc.text(
        "Σύνολο: " + order.total,
        20,
        y + 10
    );



    doc.save(
        order.id + ".pdf"
    );


}
