
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card } from "./ui/card";

interface MatchSetupProps {
  onStartMatch: (player1: string, player2: string, sets: number, opponent: string, isDoubles: boolean) => void;
}

const MatchSetup = ({ onStartMatch }: MatchSetupProps) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [sets, setSets] = useState("3");
  const [opponent, setOpponent] = useState("");
  const [isDoubles, setIsDoubles] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1 && player2 && opponent) {
      onStartMatch(player1, player2, parseInt(sets), opponent, isDoubles);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tennis-light p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg rounded-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">New Tennis Match</h1>
          <p className="text-muted-foreground">Enter match details to begin</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent School</Label>
              <Input
                id="opponent"
                placeholder="Enter opponent school name"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchType">Match Type</Label>
              <RadioGroup
                defaultValue="singles"
                value={isDoubles ? "doubles" : "singles"}
                onValueChange={(value) => setIsDoubles(value === "doubles")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="singles" id="singles" />
                  <Label htmlFor="singles">Singles</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doubles" id="doubles" />
                  <Label htmlFor="doubles">Doubles</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player1">{isDoubles ? "Team 1" : "Player 1"}</Label>
              <Input
                id="player1"
                placeholder={`Enter ${isDoubles ? "team" : "player"} 1 name`}
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="player2">{isDoubles ? "Team 2" : "Player 2"}</Label>
              <Input
                id="player2"
                placeholder={`Enter ${isDoubles ? "team" : "player"} 2 name`}
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Match Format</Label>
              <RadioGroup
                defaultValue="3"
                value={sets}
                onValueChange={setSets}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="best-of-3" />
                  <Label htmlFor="best-of-3">Best of 3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="best-of-5" />
                  <Label htmlFor="best-of-5">Best of 5</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-tennis-purple hover:bg-tennis-purple/90 text-white"
            disabled={!player1 || !player2 || !opponent}
          >
            Start Match
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MatchSetup;
