import { navLinks } from "@/constant";
import Logo from "../(main)/_components/Logo";
import Link from "next/link";

const Navbar = ({ navColor }: { navColor: boolean }) => {
  return (
    <header className="w-screen p-[0.5px] sticky top-0 z-50 bg-transparent backdrop-blur-lg shadow-md ">
      <div className="max-w-7xl mx-auto h-20 flex justify-between items-center gap-4 px-4">
        {/* logo  */}
        <Logo />
        <div className="flex-1 hidden md:block">
          <ul className="flex justify-center items-center gap-4">
            {navLinks.map((nav, idx) => (
              <li
                key={idx}
                className={`  hover:font-bold  ${
                  navColor ? "text-peach hover:text-ember" : "text-red-800 hover:text-violet"
                }`}
              >
                <Link className="text-inherit text-base" href={nav.link}>{nav.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center items-center h-full">
          <Link
            href={"/auth?continueTo=dashboard"}
            className="px-3 py-2 bg-violet text-peach rounded-md hover:text-green hover:font-bold transition-all ease duration-100 mx-4 "
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
