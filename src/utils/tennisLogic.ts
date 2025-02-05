
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
};

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

export type Shot = "Forehand" | "Backhand" | "Volley" | "Serve" | "Error";

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
  }

  return updatedState;
};

export const processPoint = (
  state: MatchState,
  player: "player1" | "player2",
  shot: Shot
): MatchState => {
  // For errors, award the point to the opponent
  if (shot === "Error") {
    const opponent = player === "player1" ? "player2" : "player1";
    const updatedState = { ...state };
    updatedState.gameHistory.push(`${updatedState[player].name} made an unforced error`);
    return processNormalPoint(updatedState, opponent);
  }

  return processNormalPoint(state, player);
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
  } else if (updatedState[winningPlayer].advantage) {
    updatedState[winningPlayer].points = 0;
    updatedState[losingPlayer].points = 0;
    updatedState[winningPlayer].games += 1;
    updatedState.player1.advantage = false;
    updatedState.player2.advantage = false;
  } else if (updatedState[losingPlayer].advantage) {
    updatedState[losingPlayer].advantage = false;
  } else if (updatedState[winningPlayer].points === 3) {
    updatedState[winningPlayer].points = 0;
    updatedState[losingPlayer].points = 0;
    updatedState[winningPlayer].games += 1;
  } else {
    updatedState[winningPlayer].points += 1;
  }

  if (updatedState[winningPlayer].games >= 6) {
    if (updatedState[winningPlayer].games - updatedState[losingPlayer].games >= 2) {
      updatedState[winningPlayer].sets += 1;
      updatedState.player1.games = 0;
      updatedState.player2.games = 0;
      updatedState.currentSet += 1;
    } else if (isTiebreakNeeded(updatedState.player1.games, updatedState.player2.games)) {
      updatedState.inTiebreak = true;
    }
  }

  return updatedState;
};

export const isMatchOver = (state: MatchState): boolean => {
  const setsToWin = Math.ceil(state.totalSets / 2);
  return state.player1.sets === setsToWin || state.player2.sets === setsToWin;
};
