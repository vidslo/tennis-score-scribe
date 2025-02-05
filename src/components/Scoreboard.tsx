import { MatchState, Shot } from "@/utils/tennisLogic";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScoreDisplay from "./ScoreDisplay";
import ShotButtons from "./ShotButtons";
import MatchStats from "./MatchStats";

interface ScoreboardProps {
  matchState: MatchState;
  onPoint: (player: "player1" | "player2", shot: Shot) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Scoreboard = ({
  matchState,
  onPoint,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ScoreboardProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          className="w-10 h-10 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-center">
          Set {matchState.currentSet}
        </h2>
        <Button
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          className="w-10 h-10 p-0"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {matchState.matchWinner && (
        <div className="text-center py-4">
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-tennis-purple text-white">
            {matchState.matchWinner} wins the match!
          </Badge>
        </div>
      )}

      <ScoreDisplay matchState={matchState} />

      <div className="mt-6 flex justify-center">
        <MatchStats matchState={matchState} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShotButtons
          playerName={matchState.player1.name}
          onPoint={(shot) => onPoint("player1", shot)}
          disabled={!!matchState.matchWinner}
        />
        <ShotButtons
          playerName={matchState.player2.name}
          onPoint={(shot) => onPoint("player2", shot)}
          disabled={!!matchState.matchWinner}
        />
      </div>
    </div>
  );
};

export default Scoreboard;