import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Check } from "lucide-react";
import { prerequisites, skills } from "@/lib/data";
import type { Skill } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollableFilterButtons } from "./ScrollableFilterButtons";
import { useNavigate } from "react-router";
import RightArrow from "@/components/ui/RightArrow";

export default function SkillSelector() {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [activeFilter, setActiveFilter] = useState("all");
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempSelectedSkill, setTempSelectedSkill] = useState<Skill | null>(
    null
  );

  const filteredSkills = skills.filter((skill: any) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "recommended" &&
        recommendedSkills.includes(skill.id)) ||
      (activeFilter === "beginner" && skill.level === "basic") ||
      (activeFilter === "intermediate" && skill.level === "intermediate") ||
      (activeFilter === "advanced" && skill.level === "advanced");
    return matchesSearch && matchesFilter;
  });

  const handleSkillSelect = (skill: Skill) => {
    setTempSelectedSkill(skill.id === tempSelectedSkill?.id ? null : skill);
  };

  const handleDialogConfirm = () => {
    setSelectedSkill(tempSelectedSkill);
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    const prerequisiteTopics = selectedSkill
      ? prerequisites[selectedSkill.id] || []
      : [];

    if (prerequisiteTopics.length > 0) {
      navigate(`/quiz?selectedSkill=${selectedSkill?.id}`);
    } else {
      navigate(`/roadmap?selectedSkill=${selectedSkill?.id}&score=100`);
    }
  };

  const handleOpenDialog = () => {
    setTempSelectedSkill(selectedSkill);
    setDialogOpen(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-20 p-4">
      <div className="flex flex-col items-center p-5 pb-[25px] bg-black/5 mt-5 rounded-md backdrop-blur-[4px] border-b border-border">
        <p className="bg-primary p-[0.2rem] rounded-md text-[0.875rem] px-3 py-1 font-medium text-muted">
          AI-Powered Learning
        </p>
        <h3 className="text-[3rem] font-bold text-center capitalize leading-[1] p-4">
          Master Technical Skills <br />
          <span className="dark:text-white/30 text-black/30">
            with Personalized Roadmaps
          </span>
        </h3>
        <p className="text-[1.125rem] text-center capitalize max-w-[42rem] pt-2 pb-6">
          Tell us what you want to learn, and we'll create a customized learning
          path with hand-picked resources tailored to your skill level and
          preferences.
        </p>
        <button className=" cursor-pointer shadow-lg hover:scale-[1.1] transition-all flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground">
          {" "}
          Get Started
          <RightArrow />
        </button>
      </div>
      <Card className="w-full max-w-[420px] mb-[20px]">
        <CardHeader className="p-4 md:p-6 space-y-2">
          <div>
            <CardTitle className="text-lg md:text-xl">
              Select a Technical Skill
            </CardTitle>
            <CardDescription className="text-xs md:text-sm mt-1">
              Choose a skill you want to learn. Please select only one skill.
            </CardDescription>
          </div>

          <div className="w-full">
            <Select
              value={preferredLanguage}
              onValueChange={setPreferredLanguage}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="px-4 md:px-6 pt-0 space-y-4">
          <div className="relative">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer" onClick={handleOpenDialog}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search skills..."
                    className="pl-10 pr-4 py-2 text-sm"
                    value={selectedSkill ? selectedSkill.name : ""}
                    readOnly
                  />
                </div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[650px] max-h-[80dvh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="px-4 py-3 md:p-4 border-b sticky top-0 bg-background z-10">
                  <DialogTitle className="text-lg">
                    Select a Technical Skill
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col p-4 gap-4 flex-1 overflow-hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      className="pl-10 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="sticky top-0 z-10 bg-background py-2">
                    <ScrollableFilterButtons
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      hasRecommended={recommendedSkills.length > 0}
                    />
                  </div>

                  <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => (
                          <motion.div key={skill.id} variants={item}>
                            <Button
                              variant="outline"
                              className={`h-auto py-3 px-3 w-full justify-between group hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm ${
                                recommendedSkills.includes(skill.id)
                                  ? "border-primary/30 bg-primary/5"
                                  : ""
                              } ${
                                tempSelectedSkill?.id === skill.id
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                  : ""
                              }`}
                              onClick={() => handleSkillSelect(skill)}
                            >
                              <div className="flex flex-col items-start text-left">
                                <span className="font-semibold">
                                  {skill.name}
                                </span>
                                <span className="text-xs mt-1 text-muted-foreground">
                                  {skill.level.charAt(0).toUpperCase() +
                                    skill.level.slice(1)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                {recommendedSkills.includes(skill.id) && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 bg-primary/10 text-primary text-xs"
                                  >
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">
                                      Recommended
                                    </span>
                                    <span className="sm:hidden">Rec</span>
                                  </Badge>
                                )}
                                {tempSelectedSkill?.id === skill.id && (
                                  <Check className="h-4 w-4 ml-2 text-primary" />
                                )}
                              </div>
                            </Button>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-1 sm:col-span-2 text-center py-8 text-muted-foreground text-sm">
                          No skills found matching your search criteria
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                <DialogFooter className="p-4 border-t sticky bottom-0 bg-background z-10 flex justify-between">
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDialogConfirm}
                    disabled={!tempSelectedSkill}
                    size="sm"
                  >
                    {tempSelectedSkill
                      ? `Select ${
                          tempSelectedSkill.name.length > 10
                            ? "Skill"
                            : tempSelectedSkill.name
                        }`
                      : "Select a skill"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {selectedSkill && (
            <div className="bg-primary/5 p-3 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="font-medium text-sm truncate">
                    {selectedSkill.name} - {selectedSkill.level.toUpperCase()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs flex-shrink-0"
                  onClick={handleOpenDialog}
                >
                  Change
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 md:p-6 pt-2">
          <Button
            className="w-full text-sm md:text-base py-2"
            onClick={handleSubmit}
            disabled={!selectedSkill}
          >
            {selectedSkill
              ? `Continue with ${selectedSkill.name}`
              : "Select a skill to continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
