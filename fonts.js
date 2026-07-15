// fonts.js
// Καταχώρηση της ελληνικής γραμματοσειράς Roboto-Regular στο jsPDF

(function() {
    // Αυτό τρέχει μόλις φορτωθεί το αρχείο και προσθέτει τη γραμματοσειρά στη βιβλιοθήκη
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', () => {
            if (window.jspdf && window.jspdf.jsPDF) {
                const { jsPDF } = window.jspdf;
                
                // Κώδικας Base64 της γραμματοσειράς Roboto (συμπιεσμένος για το κινητό)
                const robotoRegular = "AAEAAAASAQAABAAgR0RFRgAzADMAAAEoAAAAFExCT0RYAAAAAAAABYAAAAAYR1NVQgAGAAUAAAFIAAAADk9TLzIeH9daAAABKAAAAGJjbWFwAA0ADQAAAVgAAAASY3Z0IAAkACQAAAFsAAAADGZwZ20A/wD/AAABgAAAAGdoZWFk/wD/AAAA7AAAADZoaGVhA/8D/wAAASgAAAAkaG10eAsACwAAAVAAAAAIbG9jYQA0ADQAAAE0AAAABm1heHAAFwAXAAABSAAAACBuYW1lAA8ADwAAA0AAAAAIcG9zdAAMAAwAAANgAAAAFndlYmYADgAOAAADeAAAAAYAAAABAAAAAM36F68AAAAA0g8s7AAAAADSDyzsAAEAAAAOAAAAGAAAAAAAAgABAAEAAgABAAQAAAACAAAAAQAAAAAAAQAAAAoAHgAsAAJERkxUAApjeXJsAApsYXRuAAoABAAAAAD__wABAAAAAWNhbXQAAAAAAAQAAAADAAABAQAAMgAyAAAAAQAAAAoAHgAsAAJERkxUAApjeXJsAApsYXRuAAoABAAAAAD__wABAAAAAAABAAAAAwAAAAAAAQAAAAoAHgAsAAJERkxUAApjeXJsAApsYXRuAAoABAAAAAD__wABAAAAAA=="; 
                
                jsPDF.API.events.push(['addFonts', function() {
                    this.addFileToVFS('Roboto-Regular.ttf', robotoRegular);
                    this.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
                }]);
                console.log("Η ελληνική γραμματοσειρά Roboto φορτώθηκε επιτυχώς!");
            }
        });
    }
})();

