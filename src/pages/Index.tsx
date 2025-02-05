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
    console.log("New state after point:", newState);
    console.log("Current history before update:", history);
    
    setMatchState(newState);
    setHistory((prev) => {
      const newHistory = [...prev, { ...newState }];
      console.log("Updated history:", newHistory);
      return newHistory;
    });
    setFuture([]);

    if (shot === "Error") {
      const opponent = player === "player1" ? matchState.player2.name : matchState.player1.name;
      toast.success(`Point to ${opponent} due to ${matchState[player].name}'s error`, {
        style: { background: '#004b8d', color: 'white' }
      });
    } else {
      toast.success(`${matchState[player].name} won point with ${shot}`, {
        style: { background: '#004b8d', color: 'white' }
      });
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;

    console.log("Current history before undo:", history);
    const newHistory = history.slice(0, -1);
    const lastState = history[history.length - 1];
    const previousState = newHistory[newHistory.length - 1];

    console.log("Previous state to restore:", previousState);
    
    setMatchState({ ...previousState });
    setHistory(newHistory);
    setFuture((prev) => {
      const newFuture = [lastState, ...prev];
      console.log("Updated future states:", newFuture);
      return newFuture;
    });

    toast.info("Previous point undone", {
      style: { background: '#004b8d', color: 'white' }
    });
  };

  const handleRedo = () => {
    if (future.length === 0) return;

    console.log("Current future states before redo:", future);
    const [nextState, ...remainingFuture] = future;
    
    console.log("Next state to restore:", nextState);
    
    setMatchState({ ...nextState });
    setHistory((prev) => {
      const newHistory = [...prev, nextState];
      console.log("Updated history after redo:", newHistory);
      return newHistory;
    });
    setFuture(remainingFuture);

    toast.info("Point redone", {
      style: { background: '#004b8d', color: 'white' }
    });
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
          className="flex items-center gap-2 bg-[#004b8d] text-white hover:bg-[#004b8d]/90 disabled:bg-[#b7b7b7]"
        >
          <Undo2 className="w-4 h-4" />
          Undo Previous Point
        </Button>
        <Button 
          onClick={handleRedo} 
          disabled={future.length === 0}
          variant="outline"
          className="flex items-center gap-2 bg-[#004b8d] text-white hover:bg-[#004b8d]/90 disabled:bg-[#b7b7b7]"
        >
          <Redo2 className="w-4 h-4" />
          Redo Point
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