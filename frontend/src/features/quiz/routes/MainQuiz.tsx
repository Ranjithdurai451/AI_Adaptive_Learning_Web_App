import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { generateQuiz } from '@/lib/actions';
import QuizView from '../components/QuizView';
import { Questions } from '@/lib/types';
import Loader from '../../../Layouts/Root/components/Loader';
import { skills } from '@/lib/data';

const MainQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [quizData, setQuizData] = useState<Questions>([]);
  const selectedSkill = searchParams.get('selectedSkill');

  useEffect(() => {
    const data = generateQuiz(selectedSkill || '');
    console.log(selectedSkill);
    data.then((response) => {
      setQuizData(response.prerequisiteQuiz.questions);
      console.log(response.prerequisiteQuiz.questions);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  }, [selectedSkill]);

  return (
    <>
      {isLoading ? (
        <Loader
          text={`Generating a to evaluate your skills... Get ready to learn smarter!🚀...`}
        />
      ) : (
        <QuizView
          Questions={quizData}
          skillName={selectedSkill || ''}
          onBack={() => {
            navigate('/');
          }}
        />
      )}
    </>
  );
};

export default MainQuiz;
