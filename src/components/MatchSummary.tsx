
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MatchState } from "@/utils/tennisLogic";

interface MatchSummaryProps {
  matchState: MatchState;
  onNewMatch: () => void;
}

const MatchSummary = ({ matchState, onNewMatch }: MatchSummaryProps) => {
  const winner =
    matchState.player1.sets > matchState.player2.sets
      ? matchState.player1
      : matchState.player2;

  const exportMatch = () => {
    const matchData = {
      winner: winner.name,
      finalScore: {
        player1: {
          name: matchState.player1.name,
          sets: matchState.player1.sets,
        },
        player2: {
          name: matchState.player2.name,
          sets: matchState.player2.sets,
        },
      },
      history: matchState.gameHistory,
    };

    const blob = new Blob([JSON.stringify(matchData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "match-summary.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tennis-light p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg rounded-xl">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Match Complete!</h1>
          <p className="text-2xl font-semibold text-tennis-purple">
            {winner.name} Wins!
          </p>
          <div className="text-lg">
            Final Score: {matchState.player1.sets} - {matchState.player2.sets}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Button onClick={exportMatch} variant="outline">
            Export Match Data
          </Button>
          <Button
            onClick={onNewMatch}
            className="bg-tennis-purple hover:bg-tennis-purple/90 text-white"
          >
            Start New Match
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MatchSummary;
