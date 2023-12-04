
import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";



const initialState = {
  questions: [],
  // "loading" , "error" ,"ready" ,"active" ,"finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0

}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error"
      };
    case "start":
      return {
        ...state,
        status: "active"
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case "nextQuestion":
      return {
        ...state, index: state.index + 1
      }

    default:
      throw new Error('Beklenmeyen durum!');
  }
}
// anladığım kadarıyla state : status ve qustions barındırırken... action : type ve payload döndürüyor ,type ve payload da dispatch ile sevkiyatı yapılıyor. 
export default function App() {
  // önceki durum const [state, dispatch] = useReducer(reducer, initialState); state yerine {question,status}
  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));

  }, [])


  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && <> <Question question={questions[index]} dispatch={dispatch} answer={answer} />
          <NextButton dispatch={dispatch} answer={answer} /> </>
        }
      </Main>
    </div>
  )
}