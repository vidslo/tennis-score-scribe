
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card } from "./ui/card";

interface MatchSetupProps {
  onStartMatch: (player1: string, player2: string, sets: number) => void;
}

const MatchSetup = ({ onStartMatch }: MatchSetupProps) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [sets, setSets] = useState("3");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1 && player2) {
      onStartMatch(player1, player2, parseInt(sets));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tennis-light p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg rounded-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">New Tennis Match</h1>
          <p className="text-muted-foreground">Enter player details to begin</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Player 1</Label>
              <Input
                id="player1"
                placeholder="Enter player 1 name"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="player2">Player 2</Label>
              <Input
                id="player2"
                placeholder="Enter player 2 name"
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
            disabled={!player1 || !player2}
          >
            Start Match
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MatchSetup;
