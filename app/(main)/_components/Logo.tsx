import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex justify-center items-center">
      <Image src={"/logo.svg"} width={44} height={44} alt="logo" className="w-14 md:w-18 h-14 md:h-18"/>
      <h4 className="text-base md:text-2xl font-bold gradient-logo tracking-wide">FileFlux</h4>
    </Link>
  );
};

export default Logo;
