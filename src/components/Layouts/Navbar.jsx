import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-between my-8 items-center p-4 text-white">
      {/* Left side - Dashboard */}
      <div>
        <p className="text-slate-100">Pages / Dashboard</p>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Right side - Search input, Sign In button, logos, settings */}
      <div className="flex items-center space-x-4">
        {/* Search Input with Image */}
        <div className="relative">
          <Image
            src="/images/search-icon.svg"
            alt="search"
            width={26}
            height={26}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Type here..."
            className="border pl-8 pr-2 py-2 rounded-md"
          />
        </div>

        {/* Sign In Button */}
        <div className="flex items-center pl-2">
          <Image
            src="/images/person-icon.svg"
            alt="person"
            width={24}
            height={24}
          ></Image>
          <p className="ml-2">Sign In</p>
        </div>

        {/* Logos (Replace with your actual logo components) */}
        <Link href="/">
          <Image
            src="/images/sharp.svg"
            alt="Logo1"
            width={24}
            height={24}
            className="object-contain ml-2"
          />
        </Link>
        <Link href="/">
          <Image
            src="/images/default.svg"
            alt="Logo2"
            width={24}
            height={24}
            className="object-contain mx-2"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
