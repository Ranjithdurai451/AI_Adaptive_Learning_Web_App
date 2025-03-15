import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { generateRoadmap } from '@/lib/actions';
import { Roadmap } from '@/lib/types';
import Loader from '../../../Layouts/Root/components/Loader';
import RoadmapView from '../components/RoadmapView';

const MainRoadMap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [roadmapData, setroadmapData] = useState<Roadmap>();
  const selectedSkill = searchParams.get('selectedSkill');
  console.log(selectedSkill);
  if (!selectedSkill) {
    return <Navigate to="/" />;
  }

  const score = Number(searchParams.get('score') || '0');
  useEffect(() => {
    const data = generateRoadmap(selectedSkill || '', score || 0);
    data.then((response) => {
      setroadmapData(response.roadmap);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
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
            score={score}
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
