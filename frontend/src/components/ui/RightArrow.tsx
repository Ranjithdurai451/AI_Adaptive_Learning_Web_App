import { ArrowRight } from "lucide-react";

const RightArrow: React.FC = () => {
  return (
    <div className="w-5 h-5 flex items-center justify-center bg-muted-foreground shadow-2xl shadow-muted rounded-full">
      <ArrowRight size={14} />
    </div>
  );
};

export default RightArrow;
