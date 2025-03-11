import { useSearchParams } from 'react-router';
import QuizLoader from '../components/QuizLoader';
import { useEffect, useState } from 'react';
import { generateQuiz } from '@/lib/actions';
import QuizView from '../components/QuizView';
import { Questions } from '@/lib/types';

const MainQuiz = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [quizData, setQuizData] = useState<Questions>([]);
  const selectedSkill = searchParams.get('selectedSkill');

  useEffect(() => {
    const data = generateQuiz(selectedSkill || '');
    console.log(selectedSkill);
    data.then((response) => {
      setQuizData(response.quiz.questions);
      console.log(response.quiz.questions);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  }, [selectedSkill]);

  return (
    <div>
      {isLoading ? (
        <QuizLoader />
      ) : (
        <QuizView
          Questions={quizData}
          skillName={selectedSkill || ''}
          onComplete={() => {}}
          onBack={() => {}}
        />
      )}
    </div>
  );
};

export default MainQuiz;
