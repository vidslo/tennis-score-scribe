
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
  const [player1Partner, setPlayer1Partner] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player2Partner, setPlayer2Partner] = useState("");
  const [sets, setSets] = useState("3");
  const [opponent, setOpponent] = useState("");
  const [isDoubles, setIsDoubles] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent) return;

    let team1Name = player1;
    let team2Name = player2;

    if (isDoubles) {
      if (!player1Partner || !player2Partner) return;
      team1Name = `${player1} / ${player1Partner}`;
      team2Name = `${player2} / ${player2Partner}`;
    }

    if (team1Name && team2Name) {
      onStartMatch(team1Name, team2Name, parseInt(sets), opponent, isDoubles);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-4">
      <img 
        src="/lovable-uploads/e957e173-11e2-42da-a45f-433b12960eb1.png" 
        alt="Manson Trojans Logo" 
        className="w-32 h-32 mb-6"
      />
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg rounded-xl border-[#004b8d]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-[#004b8d]">New Tennis Match</h1>
          <p className="text-[#b7b7b7]">Enter match details to begin</p>
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
                className="w-full border-[#004b8d] focus:ring-[#004b8d]"
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
              <Label>{isDoubles ? "Manson Team" : "Manson Player"}</Label>
              <div className="space-y-2">
                <Input
                  placeholder={`Enter ${isDoubles ? "first player" : "player"} name`}
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  required
                  className="w-full border-[#004b8d] focus:ring-[#004b8d]"
                />
                {isDoubles && (
                  <Input
                    placeholder="Enter second player name"
                    value={player1Partner}
                    onChange={(e) => setPlayer1Partner(e.target.value)}
                    required
                    className="w-full border-[#004b8d] focus:ring-[#004b8d]"
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{isDoubles ? "Opponent Team" : "Opponent Player"}</Label>
              <div className="space-y-2">
                <Input
                  placeholder={`Enter ${isDoubles ? "first player" : "player"} name`}
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  required
                  className="w-full border-[#004b8d] focus:ring-[#004b8d]"
                />
                {isDoubles && (
                  <Input
                    placeholder="Enter second player name"
                    value={player2Partner}
                    onChange={(e) => setPlayer2Partner(e.target.value)}
                    required
                    className="w-full border-[#004b8d] focus:ring-[#004b8d]"
                  />
                )}
              </div>
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
            className="w-full bg-[#004b8d] hover:bg-[#004b8d]/90 text-white"
            disabled={!player1 || !player2 || !opponent || (isDoubles && (!player1Partner || !player2Partner))}
          >
            Start Match
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MatchSetup;
