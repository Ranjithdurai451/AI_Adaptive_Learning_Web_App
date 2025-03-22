import { Navigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { generateRoadmap } from '@/lib/actions';
import { Roadmap } from '@/lib/types';
import Loader from '../../../Layouts/Root/components/Loader';
import RoadmapView from '../components/RoadmapView';

const MainRoadMap = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [roadmapData, setroadmapData] = useState<Roadmap | null>();
  const selectedSkill = searchParams.get('selectedSkill');
  const preferredLanguage = searchParams.get('preferredLanguage')
  console.log(selectedSkill);
  if (!selectedSkill) {
    return <Navigate to="/" />;
  }

  const score = Number(searchParams.get('score') || '0');
  useEffect(() => {
    if (!localStorage.getItem(`${selectedSkill}-${score}`)) {
      const data = generateRoadmap(selectedSkill || '', score || 0);
      data.then((response) => {
        if (response.roadmap) {
          localStorage.setItem(
            `${selectedSkill}-${score}`,
            JSON.stringify(response.roadmap)
          );
        }
        setroadmapData(response.roadmap);
      });
    } else {
      setroadmapData(
        JSON.parse(localStorage.getItem(`${selectedSkill}-${score}`) || '')
      );
    }
  }, []);
  useEffect(() => {
    if (roadmapData) {
      setIsLoading(false);
    }
  }, [roadmapData]);

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
            preferredLanguage={preferredLanguage || "English"}
          />
        </div>
      )}
    </>
  );
};

export default MainRoadMap;
