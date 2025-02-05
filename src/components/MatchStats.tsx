import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { BarChart2 } from "lucide-react";
import { MatchState, getMatchStats } from "@/utils/tennisLogic";

interface MatchStatsProps {
  matchState: MatchState;
}

const MatchStats = ({ matchState }: MatchStatsProps) => {
  const stats = getMatchStats(matchState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Match Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Match Statistics</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="font-semibold">{stats.player1.name}</div>
          <div className="text-center font-bold">Shot Type</div>
          <div className="text-right font-semibold">{stats.player2.name}</div>
        </div>
        {Object.entries(stats.player1)
          .filter(([key]) => key !== "name")
          .map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-4 py-2">
              <div>{value}</div>
              <div className="text-center capitalize">{key}</div>
              <div className="text-right">
                {stats.player2[key as keyof typeof stats.player2]}
              </div>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default MatchStats;