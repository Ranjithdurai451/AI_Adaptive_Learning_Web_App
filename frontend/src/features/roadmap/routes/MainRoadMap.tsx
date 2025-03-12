import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { generateQuiz, generateRoadmap } from '@/lib/actions';
import { Questions, Roadmap } from '@/lib/types';
import Loader from '../../../Layouts/Root/components/Loader';
import RoadmapView from '../components/RoadmapvView';
import { skills } from '@/lib/data';

const MainRoadMap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [roadmapData, setroadmapData] = useState<Roadmap>();
  const selectedSkill = searchParams.get('selectedSkill');

  if (!selectedSkill) {
    navigate('/');
    console.error('No skill selected');
  }
  const score = Number(searchParams.get('score'));

  useEffect(() => {
    const data = generateRoadmap(selectedSkill || '', score || 0);
    data.then((response) => {
      setroadmapData(response.roadmap[0]);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  }, [selectedSkill]);

  return (
    <>
      {isLoading ? (
        <Loader
          text={`🚀 Designing your personalized learning roadmap... Get ready to level up! ⏳`}
        />
      ) : (
        <RoadmapView
          skill={
            skills.find((skill) => skill.id === selectedSkill) || {
              id: '0',
              name: '',
              level: 'basic',
            }
          }
          roadmap={
            roadmapData || {
              skillId: '',
              description: '',
              prerequisites: [],
              steps: [],
              projects: [],
              exercises: [],
            }
          }
          onBack={() => {}}
          preferredLanguage="English"
          quizPassed={true}
        />
      )}
    </>
  );
};

export default MainRoadMap;
