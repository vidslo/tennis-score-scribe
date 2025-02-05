import { Button } from "./ui/button";
import { Shot } from "@/utils/tennisLogic";

interface ShotButtonsProps {
  playerName: string;
  onPoint: (shot: Shot) => void;
  disabled: boolean;
}

const ShotButtons = ({ playerName, onPoint, disabled }: ShotButtonsProps) => {
  const shots: Shot[] = ["Forehand", "Backhand", "Volley", "Serve", "Error"];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-2 text-center">{playerName}&apos;s Shots</h3>
      <div className="grid grid-cols-2 gap-2">
        {shots.map((shot) => (
          <Button
            key={shot}
            onClick={() => onPoint(shot)}
            variant="outline"
            className="w-full transition-all hover:bg-tennis-purple hover:text-white"
            disabled={disabled}
          >
            {shot}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ShotButtons;