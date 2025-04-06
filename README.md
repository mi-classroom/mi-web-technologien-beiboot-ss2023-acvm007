[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Z0RQPfMP)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10744754&assignment_repo_type=AssignmentRepo)
# Web Technologien // begleitendes Projekt Sommersemester 2023
Zum Modul Web Technologien gibt es ein begleitendes Projekt. Im Rahmen dieses Projekts werden wir von Veranstaltung zu Veranstaltung ein Projekt sukzessive weiter entwickeln und uns im Rahmen der Veranstaltung den Fortschritt anschauen, Code Reviews machen und Entwicklungsschritte vorstellen und diskutieren.

Als organisatorischen Rahmen für das Projekt nutzen wir GitHub Classroom. Inhaltlich befassen wir uns mit der Entwicklung einer kleinen Web-Anwendung für die Erprobung von Augmented Reality im Browser. Das wird toll!

## Arbeitsweise und Code Reviews
Um eine klare Aufgabetrennung zu haben und auf dem Haptbranch (````main````) nur funktionalen Code zu haben, der am Ende deployed werden, kann wird eine Feature Branch Arbeitsweise angewendet. Für jedes Issue von Prof. Noss wird ein extra branch mit dem Prefix ````Issue/```` erstellt. Falls es eine Ergänzung zu einem bereits deployten Issue gibt, ist dies in einem Feature Branch (````Feature/````) zu implementieren. Nach Beendigung eines Issues oder Features wird ein Pull Request auf den main-Branch gestartet. Erst nachdem der neue Code von 2 Parteien genehmigt wird dieser vom Repo Owner gemerged und es findet (momentan noch manuell) ein deploy statt.

## Aufsetzen der lokalen Entwicklungsumgebung
1. Repo clonen ````git clone https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2023-acvm007.git````
2. In den Client ordner *client* wechseln```cd client```
3. Abhängigkeiten Installieren ```npm i``` oder ```yarn```
4. VueJS Starten ````npm run dev````

## Komponentenbeschreibung
Unter dem ````layouts```` befindet sich das Hauptlayout der Anwendung. Hier werden alle anderen Komponente gerendetr.
Dabei enthält der ````pages```` Ordner alle Unterseiten, die in verschiedenen Routen gerendert werden:
1. ````IndexPage.vue```` wird  unter der Route ````/```` gerendert ist die Startseite und zugleich die Seite um zwischen "Stöbern" und "Nutzen"  zu wählen. Was angezeigt wird regelt der query Parameter  ````start````. Ist dieser gesetzt wird die Auswahl angezeigt, andernfalls das Video.
2. ````InitializeAAction.vue```` wird unter ````/start/[pokeAround|use]```` gerendert und stellt entweder die Liste von ARlebnissen dar oder eine Auswahl zwischen drei Optionen (ARlebnisse in der Umgebung/Mit QR Code starten/Hilfe)
3. ````AREvent.vue```` rendert ein ARLebnis indem es Funktionen aus ````/scripts/tools.js```` aufruft. Die Komponente selbst ist vom HTML minimal stellt aber auch die Renderfunktion der ARLebnisse selbst.

Der Ordner ````components```` enthält alle Komponent, die ausgelagert wurden und innerhalb der einzelnen Seiten gerendert werden.
1. ````ARMap.vue```` rendert die Kartenansicht und bekommt als Prop eine Liste an ARlebnissen (events) übergeben
2. ````CustomLoader.vue```` ist ein Spinner, der einen Loading State anzeigen soll. Dieser wurde ausgelagert, um nicht immer denselben Spinner von Quasar zu importieren. Auch ist es so eijnfacher die Ladeanzeige global anzupassen und um Daten vie Progressindikationn zu erweitern
3. ````EventInformation.vue```` rendert die Informationskarte zu einem Event, falls in diesem Informationen hinterlegt sind.
4. ````EventList.vue```` rendert die Ansicht der ARlebnispfade, wobei die Kartenansicht deaktiviert ist, und gleichzeitig auch die einzelnen Events  eines ARlebnispfades oder alle in der Ungebung (zum aktuellen Stand alle aus der Datenhaltung)
