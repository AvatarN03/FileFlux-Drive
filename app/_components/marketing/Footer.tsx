import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "lucide-react";


const Footer = () => {
  return (
    <footer className="md:h-96 w-screen bg-violet  p-8 pt-16">
      <div className="h-full w-full text-center flex justify-center items-center flex-col">
        <h1
          className="text-3xl font-bold mb-4 
  bg-linear-to-r from-ember to-peach 
  bg-clip-text text-transparent tracking-wider"
        >
          FileFlux
        </h1>

        <p className="text-brown/80 md:w-[700px] ">
          FileFlux provides a simple and efficient way to manage your files in one place.
Upload, organize, and access your data securely with ease and speed.
        </p>

        <div className="flex justify-center items-center gap-12 md:gap-16 my-8">
          {/* GitHub */}
          <Link
            href="https://github.com/AvatarN03"
            target="_blank"
            className="p-4 rounded-full bg-ember hover:bg-brown hover:text-violet w-32 h-32 flex justify-center items-center hover:scale-105 transition"
            title="github"
          >
            <GithubIcon size={64} />
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://linkedin.com/in/prashanth-naidu03"
            target="_blank"
            className="p-4 rounded-full bg-ember  hover:bg-brown hover:text-violet w-32 h-32 flex justify-center items-center hover:scale-105 transition"
            title="linkedin"
          >
            <LinkedinIcon size={64} />
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 text-ember">
        <div className="flex-1 text-md">
          &copy; CopyRights by Prashanth Naidu |{" "}
          <span className="text-green">{new Date().getFullYear()}</span>
        </div>
        <div className="hidden md:flex justify-end items-center gap-4">
          <p>Privacy Policy</p> |<p>Terms and Conditions*</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
