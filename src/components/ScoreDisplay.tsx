import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { MatchState, getPointsDisplay } from "@/utils/tennisLogic";

interface ScoreDisplayProps {
  matchState: MatchState;
}

const ScoreDisplay = ({ matchState }: ScoreDisplayProps) => {
  return (
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
  );
};

export default ScoreDisplay;