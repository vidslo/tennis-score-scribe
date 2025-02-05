
import { useState } from "react";
import MatchSetup from "@/components/MatchSetup";
import Scoreboard from "@/components/Scoreboard";
import MatchSummary from "@/components/MatchSummary";
import {
  MatchState,
  Shot,
  createInitialMatchState,
  processPoint,
  isMatchOver,
} from "@/utils/tennisLogic";
import { toast } from "sonner";

const Index = () => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [history, setHistory] = useState<MatchState[]>([]);
  const [future, setFuture] = useState<MatchState[]>([]);

  const handleStartMatch = (player1: string, player2: string, sets: number) => {
    const initialState = createInitialMatchState(player1, player2, sets);
    setMatchState(initialState);
    setHistory([initialState]);
    setFuture([]);
  };

  const handlePoint = (player: "player1" | "player2", shot: Shot) => {
    if (!matchState) return;

    const newState = processPoint(matchState, player, shot);
    setMatchState(newState);
    setHistory([...history, newState]);
    setFuture([]);

    if (shot === "Error") {
      toast(`${matchState[player].name} made an unforced error`);
    } else {
      toast(`${matchState[player].name} won point with ${shot}`);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;

    const previousState = history[history.length - 2];
    const newFuture = [matchState!, ...future];

    setMatchState(previousState);
    setHistory(history.slice(0, -1));
    setFuture(newFuture);
  };

  const handleRedo = () => {
    if (future.length === 0) return;

    const nextState = future[0];
    const newFuture = future.slice(1);

    setMatchState(nextState);
    setHistory([...history, nextState]);
    setFuture(newFuture);
  };

  if (!matchState) {
    return <MatchSetup onStartMatch={handleStartMatch} />;
  }

  if (isMatchOver(matchState)) {
    return <MatchSummary matchState={matchState} onNewMatch={() => setMatchState(null)} />;
  }

  return (
    <Scoreboard
      matchState={matchState}
      onPoint={handlePoint}
      onUndo={handleUndo}
      onRedo={handleRedo}
      canUndo={history.length > 1}
      canRedo={future.length > 0}
    />
  );
};

export default Index;
