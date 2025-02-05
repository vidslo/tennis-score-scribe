export type Player = {
  name: string;
  points: number;
  games: number;
  sets: number;
  advantage: boolean;
};

export type MatchState = {
  player1: Player;
  player2: Player;
  currentSet: number;
  totalSets: number;
  inTiebreak: boolean;
  gameHistory: string[];
  opponent: string;
  isDoubles: boolean;
  matchWinner?: string;
  pointHistory: {
    winner: "player1" | "player2";
    shot: Shot;
  }[];
};

export type Shot = "Forehand" | "Backhand" | "Volley" | "Serve" | "Error";

export const createInitialMatchState = (
  player1Name: string,
  player2Name: string,
  totalSets: number,
  opponent: string,
  isDoubles: boolean
): MatchState => ({
  player1: {
    name: player1Name,
    points: 0,
    games: 0,
    sets: 0,
    advantage: false,
  },
  player2: {
    name: player2Name,
    points: 0,
    games: 0,
    sets: 0,
    advantage: false,
  },
  currentSet: 1,
  totalSets: totalSets,
  inTiebreak: false,
  gameHistory: [],
  opponent: opponent,
  isDoubles: isDoubles,
  pointHistory: [],
});

export const getPointsDisplay = (points: number): string => {
  switch (points) {
    case 0:
      return "0";
    case 1:
      return "15";
    case 2:
      return "30";
    case 3:
      return "40";
    default:
      return String(points);
  }
};

export const isTiebreakNeeded = (player1Games: number, player2Games: number): boolean => {
  return player1Games === 6 && player2Games === 6;
};

export const isMatchWinner = (state: MatchState): string | undefined => {
  const setsToWin = Math.ceil(state.totalSets / 2);
  if (state.player1.sets >= setsToWin) {
    return state.player1.name;
  } else if (state.player2.sets >= setsToWin) {
    return state.player2.name;
  }
  return undefined;
};

export const processTiebreakPoint = (
  state: MatchState,
  winningPlayer: "player1" | "player2"
): MatchState => {
  const updatedState = { ...state };
  updatedState[winningPlayer].points += 1;

  if (
    updatedState[winningPlayer].points >= 7 &&
    updatedState[winningPlayer].points - updatedState[winningPlayer === "player1" ? "player2" : "player1"].points >= 2
  ) {
    updatedState[winningPlayer].games += 1;
    updatedState[winningPlayer].sets += 1;
    updatedState.inTiebreak = false;
    updatedState.player1.points = 0;
    updatedState.player2.points = 0;
    updatedState.player1.games = 0;
    updatedState.player2.games = 0;
    updatedState.currentSet += 1;
    
    const winner = isMatchWinner(updatedState);
    if (winner) {
      updatedState.matchWinner = winner;
    }
  }

  return updatedState;
};

export const processPoint = (
  state: MatchState,
  player: "player1" | "player2",
  shot: Shot
): MatchState => {
  if (shot === "Error") {
    const opponent = player === "player1" ? "player2" : "player1";
    const updatedState = { ...state };
    updatedState.pointHistory.push({ winner: opponent, shot });
    return processNormalPoint(updatedState, opponent);
  }

  const updatedState = { ...state };
  updatedState.pointHistory.push({ winner: player, shot });
  return processNormalPoint(updatedState, player);
};

const processNormalPoint = (
  state: MatchState,
  winningPlayer: "player1" | "player2"
): MatchState => {
  if (state.inTiebreak) {
    return processTiebreakPoint(state, winningPlayer);
  }

  const updatedState = { ...state };
  const losingPlayer = winningPlayer === "player1" ? "player2" : "player1";

  if (updatedState[winningPlayer].points === 3 && updatedState[losingPlayer].points === 3) {
    updatedState[winningPlayer].advantage = true;
    updatedState[losingPlayer].advantage = false;
  } else if (updatedState[losingPlayer].advantage) {
    updatedState[losingPlayer].advantage = false;
    updatedState[winningPlayer].advantage = false;
  } else if (updatedState[winningPlayer].advantage) {
    updatedState[winningPlayer].games += 1;
    updatedState.player1.points = 0;
    updatedState.player2.points = 0;
    updatedState.player1.advantage = false;
    updatedState.player2.advantage = false;
  } else if (updatedState[winningPlayer].points === 3 && updatedState[losingPlayer].points < 3) {
    updatedState[winningPlayer].games += 1;
    updatedState.player1.points = 0;
    updatedState.player2.points = 0;
  } else {
    updatedState[winningPlayer].points += 1;
  }

  if (updatedState[winningPlayer].games >= 6) {
    if (updatedState[winningPlayer].games - updatedState[losingPlayer].games >= 2) {
      updatedState[winningPlayer].sets += 1;
      updatedState.player1.games = 0;
      updatedState.player2.games = 0;
      updatedState.currentSet += 1;
      
      const winner = isMatchWinner(updatedState);
      if (winner) {
        updatedState.matchWinner = winner;
      }
    } else if (isTiebreakNeeded(updatedState.player1.games, updatedState.player2.games)) {
      updatedState.inTiebreak = true;
    }
  }

  return updatedState;
};

export const isMatchOver = (state: MatchState): boolean => {
  return !!state.matchWinner;
};

export const getMatchStats = (state: MatchState) => {
  const stats = {
    player1: {
      name: state.player1.name,
      forehand: 0,
      backhand: 0,
      volley: 0,
      serve: 0,
      errors: 0,
    },
    player2: {
      name: state.player2.name,
      forehand: 0,
      backhand: 0,
      volley: 0,
      serve: 0,
      errors: 0,
    },
  };

  state.pointHistory.forEach(({ winner, shot }) => {
    if (shot === "Error") {
      const loser = winner === "player1" ? "player2" : "player1";
      stats[loser].errors++;
    } else {
      stats[winner][shot.toLowerCase() as keyof typeof stats.player1]++;
    }
  });

  return stats;
};