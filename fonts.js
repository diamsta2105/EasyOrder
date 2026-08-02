// fonts.js
(function () {

    const fontUrl = "NotoSans-Regular.ttf";

    fetch(fontUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {

            const fontBytes = new Uint8Array(buffer);

            let binary = "";

            for (let i = 0; i < fontBytes.length; i++) {
                binary += String.fromCharCode(fontBytes[i]);
            }

            const base64Font = btoa(binary);

            const { jsPDF } = window.jspdf;

            jsPDF.API.events.push([
                "addFonts",
                function () {

                    this.addFileToVFS(
                        "NotoSans-Regular.ttf",
                        base64Font
                    );

                    this.addFont(
                        "NotoSans-Regular.ttf",
                        "NotoSans",
                        "normal"
                    );

                }
            ]);

            console.log("Η ελληνική γραμματοσειρά φορτώθηκε σωστά.");

        })
        .catch(error => {
            console.error(
                "Σφάλμα φόρτωσης γραμματοσειράς:",
                error
            );
        });

})();
