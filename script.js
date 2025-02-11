document.addEventListener("DOMContentLoaded", () => {
    const addPlayerBtn = document.querySelector(".boton-añadir-participante");
    const startGameBtn = document.querySelector(".boton-iniciar-juego");
    const playerListContainer = document.querySelector(".nombres-participantes");
    const currentPlayerSpan = document.getElementById("current-player");
    const letterDisplay = document.querySelector(".letra-aleatoria");
    const timerSpan = document.getElementById("time");
    const wordInput = document.querySelector(".ingresar-palabra");
    const wordList = document.getElementById("word-list");
    const totalWordsSpan = document.getElementById("total-words");
    const rankingList = document.getElementById("ranking-list");

    let players = [];
    let currentPlayerIndex = 0;
    let timeLeft = 60;
    let timer;
    let wordCount = {};

    // Agregar jugador
    addPlayerBtn.addEventListener("click", () => {
        const playerName = prompt("Ingresa el nombre del jugador:");
        if (playerName && players.length < 4) {
            players.push(playerName);
            wordCount[playerName] = 0; // Inicializa el contador de palabras
            updatePlayerList();
        } else {
            alert("Solo se permiten 4 jugadores.");
        }
    });

    function updatePlayerList() {
        playerListContainer.innerHTML = players.map(p => `<p>${p}</p>`).join("");
    }

    // Iniciar juego
    startGameBtn.addEventListener("click", () => {
        if (players.length < 2) {
            alert("Se necesitan al menos 2 jugadores.");
            return;
        }
        currentPlayerIndex = 0;
        startTurn();
    });

    function startTurn() {
        clearInterval(timer);
        timeLeft = 60;
        timerSpan.textContent = timeLeft;

        currentPlayerSpan.textContent = players[currentPlayerIndex];
        letterDisplay.textContent = getRandomLetter();

        timer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                endTurn();
            }
        }, 1000);
    }

    function endTurn() {
        clearInterval(timer);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        startTurn();
    }

    function getRandomLetter() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Registrar palabra
    wordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && wordInput.value.trim() !== "") {
            const word = wordInput.value.trim().toUpperCase();
            const player = players[currentPlayerIndex];

            const li = document.createElement("li");
            li.textContent = `${player}: ${word}`;
            wordList.appendChild(li);

            wordCount[player] += 1;
            totalWordsSpan.textContent = Object.values(wordCount).reduce((a, b) => a + b, 0);

            updateRanking();
            wordInput.value = "";
        }
    });

    function updateRanking() {
        rankingList.innerHTML = "";
        const sortedPlayers = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

        sortedPlayers.forEach(([player, words]) => {
            const li = document.createElement("li");
            li.textContent = `${player}: ${words} palabras`;
            rankingList.appendChild(li);
        });
    }
});
