import Image from "next/image";

const Header = () => {
  return (
    <header>
      <div className="header__logo-container">
        <Image
          src="/0800.png"
          alt="0800 Pancho Logo"
          layout="fill"
          className="header__logo-img"
        />
      </div>
    </header>
  );
};

export default Header;
