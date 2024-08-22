import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ChatPage from './components/Chat-page';
import socketIO from 'socket.io-client';
import Navbar from './components/Navbar';

const socket = socketIO.connect('http://192.168.1.4:4000', {transports: ['websocket']});

function App() {
  return (
      <BrowserRouter>
        <Navbar socket={socket}/>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </BrowserRouter>
  );
}
export default App;