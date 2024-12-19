import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-white text-4xl mb-6">Coming Soon</h1>
      <div className="flex space-x-4 text-white text-2xl">
        <a href="https://x.com/TheStableVegeta" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
          <FaTwitter />
        </a>
      </div>
    </div>
  );
}

export default App;