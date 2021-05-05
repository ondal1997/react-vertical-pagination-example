import logo from "./logo.svg";
import "./App.css";
import Page from "./Page";
import { useRef, useState } from "react";

function App() {
  const [a, setA] = useState(true);
  const ref = useRef(null);
  const [projectId, setProjectId] = useState('1343');

  return (
    <div className="App">
      <button
        onClick={() => {
          setA(!a);
        }}
      >
        컴포넌트 마운트 토글
      </button>
      <input defaultValue={'1343'} ref={ref} />
      <button
        onClick={() => {
          setProjectId(ref.current.value);
        }}
      >
        프로젝트 id 변경
      </button>
      {a ? <Page projectId={projectId} /> : <h1>Component not mounted</h1>}
    </div>
  );
}

export default App;
