import Image from "next/image";
import Link from "next/link";

const Logo = ({classes}:{classes?: string}) => {
  return (
    <Link href={"/"} className={`flex justify-center items-center gap-1 md:gap-2 ${classes}`}>
      <Image src={"/logo.png"} width={44} height={44} alt="logo" className="w-10  h-10"/>
      <h4 className="text-2xl lg:text-3xl font-bold tracking-wide">FileFlux</h4>
    </Link>
  );
};

export default Logo;
