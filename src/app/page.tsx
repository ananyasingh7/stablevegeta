import { FaTwitter, FaInstagram, FaMedium, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-wider animate-pulse mb-8">
          Coming Soon!
        </h1>
        <div className="flex gap-6 justify-center">
          <a
            href="https://twitter.com/stablevegeta"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-blue-400 transition-colors"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="text-2xl hover:text-pink-400 transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="text-2xl hover:text-gray-400 transition-colors"
          >
            <FaMedium />
          </a>
          <a
            href="#"
            className="text-2xl hover:text-blue-600 transition-colors"
          >
            <FaLinkedin />
          </a>
          <a
            href="#"
            className="text-2xl hover:text-red-600 transition-colors"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </main>
  );
}