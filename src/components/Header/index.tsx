import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-space-image bg-cover bg-center bg-no-repeat">
      <div className="relative m-auto flex h-[91vh] w-1/2 min-w-[300px] max-w-lg select-none items-center justify-center">
        <Image
          src="/0800.png"
          alt="0800 Pancho Logo"
          className="relative h-full w-full object-contain"
          width={469}
          height={210}
          priority
        />
      </div>
    </header>
  );
};

export default Header;
