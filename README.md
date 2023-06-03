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
