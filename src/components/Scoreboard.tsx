
import { MatchState, getPointsDisplay, Shot } from "@/utils/tennisLogic";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const shots: Shot[] = ["Forehand", "Backhand", "Volley", "Serve", "Error"];

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

      <Card className="p-6 bg-white shadow-lg rounded-xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{matchState.player1.name}</h3>
            <Badge variant="secondary" className="text-tennis-purple">
              Sets: {matchState.player1.sets}
            </Badge>
          </div>
          <div className="font-bold text-xl">VS</div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{matchState.player2.name}</h3>
            <Badge variant="secondary" className="text-tennis-purple">
              Sets: {matchState.player2.sets}
            </Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="text-3xl font-bold">
            {matchState.inTiebreak
              ? matchState.player1.points
              : getPointsDisplay(matchState.player1.points)}
            {matchState.player1.advantage && "Ad"}
          </div>
          <div className="text-xl font-semibold">Points</div>
          <div className="text-3xl font-bold">
            {matchState.inTiebreak
              ? matchState.player2.points
              : getPointsDisplay(matchState.player2.points)}
            {matchState.player2.advantage && "Ad"}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="text-2xl font-bold">{matchState.player1.games}</div>
          <div className="text-xl font-semibold">Games</div>
          <div className="text-2xl font-bold">{matchState.player2.games}</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold mb-2 text-center">
            {matchState.player1.name}&apos;s Shots
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {shots.map((shot) => (
              <Button
                key={`p1-${shot}`}
                onClick={() => onPoint("player1", shot)}
                variant="outline"
                className="w-full transition-all hover:bg-tennis-purple hover:text-white"
              >
                {shot}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold mb-2 text-center">
            {matchState.player2.name}&apos;s Shots
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {shots.map((shot) => (
              <Button
                key={`p2-${shot}`}
                onClick={() => onPoint("player2", shot)}
                variant="outline"
                className="w-full transition-all hover:bg-tennis-purple hover:text-white"
              >
                {shot}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
