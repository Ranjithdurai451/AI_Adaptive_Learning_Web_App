import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { generateQuiz, generateRoadmap } from '@/lib/actions';
import { Questions, Roadmap } from '@/lib/types';
import Loader from '../../../Layouts/Root/components/Loader';
import { roadmaps, skills } from '@/lib/data';
import RoadmapView from '../components/RoadmapView';

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
      setroadmapData(response.roadmap);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
    // setroadmapData(roadmaps);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader
          text={`🚀 Designing your personalized learning roadmap... Get ready to level up! ⏳`}
        />
      ) : (
        <div className="">
          <RoadmapView
            skill={selectedSkill || ''}
            roadmap={
              roadmapData || {
                title: '',
                skillId: '',
                description: '',
                prerequisites: [],
                steps: [],
                projects: [],
              }
            }
            preferredLanguage="English"
          />
        </div>
      )}
    </>
  );
};

export default MainRoadMap;
