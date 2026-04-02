import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/lib/types";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KPICardsProps {
  cards: KpiCard[];
}

export function KPICards({ cards }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-white">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-3xl font-bold">{card.value}</p>
              <div className="flex items-center gap-2 pt-2">
                <Badge
                  variant={card.trend === "up" ? "success" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {card.trend === "up" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(card.change)}%
                </Badge>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
