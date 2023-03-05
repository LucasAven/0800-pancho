import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { useRouter } from "next/router";

export interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<ILayoutProps> = ({ children, className = "" }) => {
  const { pathname } = useRouter();

  return (
    <div className="flex h-screen flex-col justify-between pt-12">
      <Navbar className={className} />
      <main className={`${className} grow`}>{children}</main>
      {!pathname.includes("admin") && <Footer className={className} />}
    </div>
  );
};

export default Layout;
