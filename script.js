document.addEventListener("DOMContentLoaded", () => {
    let matches = [];
    let history = [];
    let redoStack = [];

    document.getElementById("newMatchForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const matchName = document.getElementById("matchName").value.trim();
        const player1 = document.getElementById("player1").value.trim();
        const player2 = document.getElementById("player2").value.trim();
        const rounds = parseInt(document.getElementById("rounds").value);

        if (matchName && player1 && player2) {
            const match = {
                id: matches.length + 1,
                name: matchName,
                player1,
                player2,
                rounds,
                sets: [0, 0],
                games: [0, 0],
                points: [0, 0],
                log: [],
            };
            matches.push(match);
            updateMatchesList();
            document.getElementById("newMatchForm").reset();
        }
    });

    function updateMatchesList() {
        const list = document.getElementById("matchesList");
        list.innerHTML = "";
        matches.forEach((match) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `<span>${match.name}</span>
                <button class="btn btn-sm btn-info" onclick="openMatch(${match.id})">View</button>`;
            list.appendChild(li);
        });
    }

    window.openMatch = function (matchId) {
        const match = matches.find((m) => m.id === matchId);
        document.getElementById("matchTitle").innerText = match.name;
        document.getElementById("player1Name").innerText = match.player1;
        document.getElementById("player2Name").innerText = match.player2;
        updateScoreDisplay(match);
        $("#matchModal").modal("show");
    };

    window.recordShot = function (player, shotType) {
        const match = matches.find((m) => m.name === document.getElementById("matchTitle").innerText);
        if (!match) return;

        history.push({ matchId: match.id, player, shotType, score: [...match.points] });
        redoStack = [];

        if (shotType === "Error") {
            match.points[player === 1 ? 1 : 0]++;
        } else {
            match.points[player - 1]++;
        }

        checkGameWin(match);
        updateScoreDisplay(match);
        logAction(match, player, shotType);
    };

    function checkGameWin(match) {
        const [p1, p2] = match.points;
        if ((p1 >= 4 && p1 - p2 >= 2) || (p2 >= 4 && p2 - p1 >= 2)) {
            match.games[p1 > p2 ? 0 : 1]++;
            match.points = [0, 0];

            if ((match.games[0] >= 6 || match.games[1] >= 6) && Math.abs(match.games[0] - match.games[1]) >= 2) {
                match.sets[match.games[0] > match.games[1] ? 0 : 1]++;
                match.games = [0, 0];

                if (match.sets[0] >= Math.ceil(match.rounds / 2) || match.sets[1] >= Math.ceil(match.rounds / 2)) {
                    alert(`${match.sets[0] > match.sets[1] ? match.player1 : match.player2} wins the match!`);
                }
            }
        }
    }

    function updateScoreDisplay(match) {
        document.getElementById("setScore").innerText = `${match.sets[0]} - ${match.sets[1]}`;
        document.getElementById("gameScore").innerText = `${translateScore(match.points[0])} - ${translateScore(match.points[1])}`;
    }

    function translateScore(points) {
        return ["0", "15", "30", "40", "Adv"][points] || points;
    }

    function logAction(match, player, shotType) {
        const log = document.getElementById("matchLog");
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = `${player === 1 ? match.player1 : match.player2} - ${shotType}`;
        log.appendChild(li);
    }

    window.undo = function () {
        if (history.length > 0) {
            const lastAction = history.pop();
            redoStack.push(lastAction);
            const match = matches.find((m) => m.id === lastAction.matchId);
            if (match) {
                match.points = [...lastAction.score];
                updateScoreDisplay(match);
            }
        }
    };

    window.redo = function () {
        if (redoStack.length > 0) {
            const redoAction = redoStack.pop();
            history.push(redoAction);
            const match = matches.find((m) => m.id === redoAction.matchId);
            if (match) {
                match.points[redoAction.player - 1]++;
                updateScoreDisplay(match);
            }
        }
    };
});
