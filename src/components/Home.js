import { useNavigate } from "react-router-dom";
// import './Home.css'
const Home = ({ socket }) => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    //generates a random username for the user using uuid library
    const userName = Math.random().toString(32);
    localStorage.setItem("userName", userName);
    //sends the username and socket ID to the Node.js server
    socket.emit("newUser", { userName, socketID: socket.id });
    navigate("/chat");
  };
  return (
    // create a start chatting button in the center of the screen that will take the user to the chat page the user don't have to enter the username
    <div className="flex justify-center items-center h-svh mx-auto">
      <button
        onClick={handleSubmit}
        className="font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-400"
      >
        Start Chatting
      </button>
    </div>
  );
};
export default Home;
