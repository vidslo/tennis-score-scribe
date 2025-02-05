
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
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [history, setHistory] = useState<MatchState[]>([]);
  const [future, setFuture] = useState<MatchState[]>([]);

  const handleStartMatch = (
    player1: string,
    player2: string,
    sets: number,
    opponent: string,
    isDoubles: boolean
  ) => {
    const initialState = createInitialMatchState(player1, player2, sets, opponent, isDoubles);
    setMatchState(initialState);
    setHistory([initialState]);
    setFuture([]);
  };

  const handlePoint = (player: "player1" | "player2", shot: Shot) => {
    if (!matchState) return;

    const newState = processPoint(matchState, player, shot);
    setMatchState(newState);
    setHistory((prevHistory) => [...prevHistory, newState]);
    setFuture([]);

    if (shot === "Error") {
      const opponent = player === "player1" ? matchState.player2.name : matchState.player1.name;
      toast(`Point to ${opponent} due to ${matchState[player].name}'s error`);
    } else {
      toast(`${matchState[player].name} won point with ${shot}`);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;

    const previousState = history[history.length - 2];
    const currentState = matchState!;
    
    setMatchState(previousState);
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [currentState, ...prev]);
    
    toast("Move undone");
  };

  const handleRedo = () => {
    if (future.length === 0) return;

    const nextState = future[0];
    
    setMatchState(nextState);
    setHistory((prev) => [...prev, nextState]);
    setFuture((prev) => prev.slice(1));
    
    toast("Move redone");
  };

  if (!matchState) {
    return <MatchSetup onStartMatch={handleStartMatch} />;
  }

  if (isMatchOver(matchState)) {
    return <MatchSummary matchState={matchState} onNewMatch={() => setMatchState(null)} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-2 mb-4">
        <Button 
          onClick={handleUndo} 
          disabled={history.length <= 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Undo2 className="w-4 h-4" />
          Undo
        </Button>
        <Button 
          onClick={handleRedo} 
          disabled={future.length === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Redo2 className="w-4 h-4" />
          Redo
        </Button>
      </div>
      <Scoreboard
        matchState={matchState}
        onPoint={handlePoint}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 1}
        canRedo={future.length > 0}
      />
    </div>
  );
};

export default Index;
