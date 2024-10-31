
import AppName from './components/AppName';
import Main from './components/Main';


export default function Home() {
  return (
    <>
      <AppName>
        <div>
          <span>Grëg&apos;s </span>ChatBot
        </div>
      </AppName>
      <div className="main-container">
        <Main />
      </div>
    </>
  );
}


