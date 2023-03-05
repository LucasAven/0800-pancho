import SectionTitle from "components/SectionTitle";
import type { PricesObject } from "types";
import License from "./License";

export interface ILicensesProps {
  prices: PricesObject;
}

const Licenses: React.FC<ILicensesProps> = ({ prices }) => {
  return (
    <section className="relative bg-space-image bg-cover bg-center bg-no-repeat shadow-sections">
      <SectionTitle className="bg-transparent bg-space-image bg-top" isAbsolute>
        Licencias
      </SectionTitle>

      <div className="my-0 mx-auto flex min-h-[630px] w-full max-w-2xl flex-col justify-center gap-8 p-6 big-md:max-w-6xl big-md:flex-row">
        <License licenseType="basic" price={prices.basic} />
        <License licenseType="premium" price={prices.premium} />
        <License licenseType="custom" price={prices.custom} />
      </div>
    </section>
  );
};

export default Licenses;
