<?php

    // Controlliamo che la richiesta sia stata effettuata mediante il metodo POST
    // altrimenti lo script ritornerà un messaggio di errore 403 Forbidden
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Verificato che sia stato utilizzato il corretto metodo HTTP estraiamo i dati del modulo e li 
        // immagazziniamo in 4 variabili.
        // Utilizziamo il metodo PHP trim() per eliminare eventuali spazi bianchi 
        // ad inizio o alla fine della stringa. 
        // Con la funzione strip_tags rimuoviamo eventuali tag HTML e PHP. 
        // str_replace — Sostituisce tutte le occorrenze della stringa cercata con la stringa di sostituzione. 
        // Il filtro FILTER_SANITIZE_EMAIL, utilizzato come secondo argomento per la funzione filter_var(), 
        // consente di rimuovere da una determinata stringa tutti i caratteri non consentiti per un indirizzo di 
        // posta elettronica, permette invece di utilizzare tutte le lettere dell’alfabeto, simboli numerici e i 
        // caratteri !#$%&’*+-/=?^_`{|}~@.[]
        $nome = strip_tags(trim($_POST["nome"]));
            $nome = str_replace(array("\r","\n"),array(" "," "),$nome);
        $cognome = strip_tags(trim($_POST["cognome"]));
            $cognome = str_replace(array("\r","\n"),array(" "," "),$cognome);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $messaggio = trim($_POST["messaggio"]);

        // Verifichiamo che i campi siano stati compilati
        if ( empty($nome) OR empty($cognome) OR empty($messaggio) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // 400 Bad Request - La richiesta non può essere soddisfatta a causa di errori di sintassi.
            header("HTTP/1.0 400 bad request" ); // Utilizziamo la funzione header() invece della più recente http_response_code perchè ancora non sempre supportata
            echo "Uhm... Hai completato tutti i campi richiesti? Completa il modulo "
            . "ed invialo nuovamente. Grazie.";
            exit;
        }

        // Impostiamo l'indirizzo del destinatario dei dati del modulo
        // N.B.: Metti qui l'email a cui arriveranno i dati del modulo
        $destinatario = "tuo.indirizzo@email.com";

        // Impostiamo il soggetto della email
        $soggetto = "Nuovo contatto da $nome"." $cognome";

        // Impostiamo il contenuto della email
        $contenuto_email = "Nome: $nome\n";
        $contenuto_email .= "Cognome: $cognome\n";
        $contenuto_email .= "Email: $email\n\n";
        $contenuto_email .= "Messaggio:\n$messaggio\n";

        // Impostiamo l'intestazione della email
        $intestazioni_email = "From: $nome $cognome <$email>";
        
        // Inviamo l'email
        if (mail($destinatario, $soggetto, $contenuto_email, $intestazioni_email)) {
            // 200 OK - Risposta standard per le richieste HTTP andate a buon fine.
            header("HTTP/1.1 200 OK"); // Utilizziamo la funzione header() invece della più recente http_response_code perchè ancora non sempre supportata
            echo "Grazie! Il tuo messaggio e' stato inviato.";
        } else {
            // 500 Internal Server Error - Messaggio di errore generico senza alcun dettaglio
            header('HTTP/1.1 500 Internal Server Error');
            echo "Oops! Qualcosa e' andato storto e non è stato possibile inviare il messaggio";
        }

    } else {
        // 403 Forbidden - La richiesta è legittima ma il server si rifiuta di soddisfarla.
        header('HTTP/1.1 403 Forbidden'); // Utilizziamo la funzione header() invece della più recente http_response_code perchè ancora non sempre supportata
        echo "C'e' stato un problema con l'invio. Riprova. Grazie.";
    }

?>
