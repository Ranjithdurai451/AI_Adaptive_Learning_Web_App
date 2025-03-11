import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, ChevronRight, Check } from 'lucide-react';
import { skills } from '@/lib/data';
import type { Skill } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableFilterButtons } from './ScrollableFilterButtons';
import { useNavigate } from 'react-router';

export default function SkillSelector() {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [activeFilter, setActiveFilter] = useState('all');
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempSelectedSkill, setTempSelectedSkill] = useState<Skill | null>(
    null
  );
  const [viewMode, setViewMode] = useState('list');

  // useEffect(() => {
  //   // Generate recommended skills based on user data
  //   if (userData) {
  //     let recommended: string[] = [];
  //     if (userData.experience === 'beginner') {
  //       recommended = ['html', 'css', 'git'];
  //     } else if (userData.experience === 'intermediate') {
  //       recommended = ['javascript', 'python', 'sql'];
  //     } else {
  //       recommended = ['react', 'node', 'typescript'];
  //     }
  //     setRecommendedSkills(recommended);
  //   }
  // }, [userData]);

  const filteredSkills = skills.filter((skill: any) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'recommended' &&
        recommendedSkills.includes(skill.id)) ||
      (activeFilter === 'beginner' && skill.level === 'basic') ||
      (activeFilter === 'intermediate' && skill.level === 'intermediate') ||
      (activeFilter === 'advanced' && skill.level === 'advanced');
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
    navigate(`/quiz?selectedSkill=${selectedSkill?.id}`);
    // if (selectedSkill && onSubmit) {
    //   onSubmit(selectedSkill);
    // }
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
    <Card className="w-full max-w-[420px]">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col space-y-3  md:items-center md:justify-between md:space-y-0 md:gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">
              Select a Technical Skill
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Choose a skill you want to learn. Please select only one skill.
            </CardDescription>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-2">
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
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
        <div className="space-y-4 md:space-y-6">
          <div className="relative">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer" onClick={handleOpenDialog}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search skills..."
                    className="pl-10 pr-4 py-2 text-sm"
                    value={selectedSkill ? selectedSkill.name : ''}
                    readOnly
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl max-h-[90vh] sm:max-h-[80vh] w-full m-4 p-0 overflow-hidden">
                <DialogHeader className="px-4 py-3 md:p-6 border-b sticky top-0 bg-background z-10">
                  <DialogTitle className="text-lg">
                    Select a Technical Skill
                  </DialogTitle>
                  <DialogDescription className="text-xs md:text-sm">
                    Choose a skill you want to learn from our catalog.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 px-4 py-4 md:p-6 overflow-hidden">
                  <div className=" sticky top-0 z-10">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      className="pl-10 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="sticky top-12 z-10 bg-background pt-2 pb-3">
                    <ScrollableFilterButtons
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      hasRecommended={recommendedSkills.length > 0}
                    />
                  </div>

                  <Tabs
                    value={viewMode}
                    onValueChange={setViewMode}
                    className="w-full"
                  >
                    <div className="flex justify-end mb-4 sticky top-24 z-10 bg-background">
                      <TabsList className="h-8 md:h-10">
                        <TabsTrigger
                          value="grid"
                          className="flex items-center gap-1 text-xs md:text-sm h-full px-2 md:px-3  sm:flex"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="md:mr-1"
                          >
                            <rect width="7" height="7" x="3" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="14" rx="1" />
                            <rect width="7" height="7" x="3" y="14" rx="1" />
                          </svg>
                          <span className="hidden md:inline">Grid</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="list"
                          className="flex items-center gap-1 text-xs md:text-sm h-full px-2 md:px-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="md:mr-1"
                          >
                            <line x1="8" x2="21" y1="6" y2="6" />
                            <line x1="8" x2="21" y1="12" y2="12" />
                            <line x1="8" x2="21" y1="18" y2="18" />
                            <line x1="3" x2="3.01" y1="6" y2="6" />
                            <line x1="3" x2="3.01" y1="12" y2="12" />
                            <line x1="3" x2="3.01" y1="18" y2="18" />
                          </svg>
                          <span className="hidden md:inline">List</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="overflow-y-auto max-h-[45vh] sm:max-h-[50vh] scrollbar-thin">
                      <TabsContent value="grid" className="m-0">
                        <motion.div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4"
                          variants={container}
                          initial="hidden"
                          animate="show"
                        >
                          {filteredSkills.length > 0 ? (
                            filteredSkills.map((skill) => (
                              <motion.div key={skill.id} variants={item}>
                                <Button
                                  variant="outline"
                                  className={`h-auto py-3 md:py-6 px-3 md:px-4 w-full justify-between group hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm ${
                                    recommendedSkills.includes(skill.id)
                                      ? 'border-primary/30 bg-primary/5'
                                      : ''
                                  } ${
                                    tempSelectedSkill?.id === skill.id
                                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                      : ''
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
                                        className="ml-2 bg-primary/10 text-primary text-xs whitespace-nowrap"
                                      >
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        <span className="hidden sm:inline">
                                          Recommended
                                        </span>
                                        <span className="sm:hidden">Rec</span>
                                      </Badge>
                                    )}
                                    {tempSelectedSkill?.id === skill.id && (
                                      <Check className="h-4 w-4 md:h-5 md:w-5 ml-2 text-primary" />
                                    )}
                                  </div>
                                </Button>
                              </motion.div>
                            ))
                          ) : (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 text-muted-foreground text-sm">
                              No skills found matching your search criteria
                            </div>
                          )}
                        </motion.div>
                      </TabsContent>
                      <TabsContent value="list" className="m-0">
                        <motion.div
                          className="space-y-2"
                          variants={container}
                          initial="hidden"
                          animate="show"
                        >
                          {filteredSkills.length > 0 ? (
                            filteredSkills.map((skill) => (
                              <motion.div key={skill.id} variants={item}>
                                <Button
                                  variant="outline"
                                  className={`h-auto py-2 md:py-4 px-3 md:px-4 w-full justify-between group hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm ${
                                    recommendedSkills.includes(skill.id)
                                      ? 'border-primary/30 bg-primary/5'
                                      : ''
                                  } ${
                                    tempSelectedSkill?.id === skill.id
                                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                      : ''
                                  }`}
                                  onClick={() => handleSkillSelect(skill)}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                                      <span className="text-primary font-medium text-xs md:text-sm">
                                        {skill.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-start text-left">
                                      <span className="font-semibold truncate max-w-36 sm:max-w-full">
                                        {skill.name}
                                      </span>
                                      <span className="text-xs mt-0.5 md:mt-1 text-muted-foreground">
                                        {skill.level.charAt(0).toUpperCase() +
                                          skill.level.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {recommendedSkills.includes(skill.id) && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-primary/10 text-primary text-xs whitespace-nowrap"
                                      >
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        <span className="hidden sm:inline">
                                          Recommended
                                        </span>
                                        <span className="sm:hidden">Rec</span>
                                      </Badge>
                                    )}
                                    {tempSelectedSkill?.id === skill.id ? (
                                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    )}
                                  </div>
                                </Button>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                              No skills found matching your search criteria
                            </div>
                          )}
                        </motion.div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                <DialogFooter className="flex justify-between p-4 md:p-6 border-t sticky bottom-0 bg-background z-10">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs md:text-sm sm:size-default"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDialogConfirm}
                    disabled={!tempSelectedSkill}
                    size="sm"
                    className="text-xs md:text-sm sm:size-default"
                  >
                    {tempSelectedSkill
                      ? `Select ${
                          tempSelectedSkill.name.length > 10
                            ? ''
                            : tempSelectedSkill.name
                        }`
                      : 'Select a skill'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {selectedSkill && (
            <div className="bg-primary/5 p-3 md:p-4 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <p className="font-medium text-sm md:text-base">
                    {selectedSkill.name} - ( {selectedSkill.level.toUpperCase()}{' '}
                    )
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleOpenDialog()}
                >
                  Change
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 md:p-6 pt-0 md:pt-0">
        <Button
          className="w-full text-sm md:text-base py-2 md:py-6"
          onClick={handleSubmit}
          disabled={!selectedSkill}
        >
          {selectedSkill
            ? `Continue with ${selectedSkill.name}`
            : 'Select a skill to continue'}
        </Button>
      </CardFooter>
    </Card>
  );
}
