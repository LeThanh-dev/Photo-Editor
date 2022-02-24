import logo from './logo.svg';
import Editor from "./Components/Editor"
import styles from "./App.module.scss"
function App() {
  return (
    <div className={styles.app}>
      <Editor />
    </div>
  );
}

export default App;
