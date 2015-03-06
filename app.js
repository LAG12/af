$(function() {
        
        // Creiamo 2 variabili (form - formMessages) che fanno riferimento a corrispondenti
        // elementi HTML nella pagina form.html
	// Get the form.
	var form = $('#contact-form');

	// Get the messages div.
	var formMessages = $('#form-messages');

	// Impostiamo un event listener che intercetterà gli eventi submit sul form. 
        // Possiamo fare ciò attraverso il metodo jQuery submit().
        // All'evento submit (non appena l'utente invia il modulo) viene eseguita una funzione
	$(form).submit(function(e) {
		// Il codice event.preventDefault() fa si che il modulo non venga inviato nella modalità standard 
                // (portandoci quindi alla pagina process.php). Dobbiamo infatti inviare il modulo mediante Ajax
		e.preventDefault();

		// Serializziamo i dati del modulo. Attraverso il metodo jQuery serialize() intercettiamo i dati 
                // del modulo e li immagaziniamo nella variabile dati-form.
                // Per capire meglio ciò che verrà memorizzato nella variabile term, immaginiamo di aver inserito nel 
                // campo nome il valore ciccio e nel campo surname il valore pasticcio, la variabile dati-form sarà così valorizzata:
                // nome=ciccio&cognome=pluto
		var dati_form = $(form).serialize();
                // In questo comodissimo modo ci siamo evitati di dover associare ad ogni elemento del form un valore con val(),
                // Es.:     var nome = $("#nome").val();
                //          var cognome = $("#cognome").val();
                // e di dover scrivere la stringa in ajax.data:
                // data: "nome=" + nome + "&cognome=" + cognome,
                
                // Questo alert potete levarlo, serve solo per farvi capire come vengono passati i dati
                // nella variabile dati_form mediante serialize()
                alert(dati_form);
                
                // I dati del modulo, contenuti nella variabile dati_form, verranno a questo punto (vedi sotto)
                // inviati via Ajax al file process.php che li elaborarà in maniera semplice, usando
                // POST + #id dell’input del form. Es.: 
                // $testo = $_POST['testo'];
                // $testo2 = $_POST['testo2'];
                
                // Un accorgimento importante se usate serialize() potrebbe essere (ma qui non lo userò)
                //  sicuramente quello di filtrare il POST con la funzione PHP urldecode. Es.:
                // //recupero
                // $testo= urldecode($_POST['testo']);
                // $testo2= urldecode($_POST['testo2']);
                    //stampo i risultati
                // echo $testo; echo "<br>";
                // echo $testo2; echo "<br>";

		// Inviamo i dati usando il metodo jquery AJAX.
		$.ajax({
                        //imposto il tipo di invio dati (GET O POST)
			type: 'POST',
                        // Dove devo inviare i dati recuperati dal form?
			url: $(form).attr('action'), // la variabile url memorizza quanto è specificato 
                                                    //nell' action del form (process.php)
                                                    // potremmo anche fare così: -- url: "process.php" --
			//Quali dati devo inviare?
                        // I dati contenuti nella variabile dati_form, ovviamente
                        data: dati_form
		})
                
                // Qui gestiremo la risposta positiva del server attraverso il metodo .done()
                // che è un'alternativa al parametro success del metodo .ajax()
		.done(function(response) {
			// Ci assicuriamo che il div formMessages abbia la classe success
			$(formMessages).removeClass('error');
			$(formMessages).addClass('success');

			// Impostiamo il testo del messaggio.
			$(formMessages).text(response);

			// Puliamo il modulo dopo l'avvenuto invio
			$('#nome').val('');
                        $('#cognome').val('');
			$('#email').val('');
			$('#messaggio').val('');
		})
                // Qui gestiremo una risposta negativa del server attraverso il metodo .fail()
                // che è un'alternativa al parametro error del metodo .ajax();
		.fail(function(data) {
			// Ci assicuriamo che il div formMessages abbia la classe error
			$(formMessages).removeClass('success');
			$(formMessages).addClass('error');

			// Impostiamo il testo del messaggio.
                        // Se la richiesta ajax ha generato un resposeText mostreremo questo messaggio
                        // altrimenti stamperemo un messaggio di errore generico
			if (data.responseText !== '') {
				$(formMessages).text(data.responseText);
			} else {
				$(formMessages).text('Oops! Si è avuto un errore ed il tuo messaggio non è stato inviato.');
			}
		});
                
                // Il vantaggio dei metodi done() e fail() rispetto all'utilizzo dei parametri del metodo ajax()
                // success ed error, consiste nel fatto che vengono "portate fuori" dal metodo .ajax() alcune operazioni 
                // che potranno essere eseguite anche in un secondo momento. 

	});

});
