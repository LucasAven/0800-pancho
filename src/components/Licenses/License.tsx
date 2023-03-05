import { LICENSES_PERKS } from "constants/index";
import type { LicenseType } from "types";
import { cn } from "utils";

export interface ILicenseProps {
  licenseType: LicenseType;
  price: number;
}

const License: React.FC<ILicenseProps> = ({ licenseType, price }) => {
  const isCustom = licenseType === "custom";

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center rounded-xl py-5 px-6 text-center shadow-[0_8px_32px_0_rgb(0_0_0_/_86%)] backdrop-blur-sm",
        isCustom
          ? "bg-primary/60 font-medium text-black"
          : "bg-[#ffffff14] text-baseText"
      )}
    >
      <h3
        className={cn(
          "text-3xl font-bold uppercase leading-none",
          isCustom ? "text-black" : "text-primary"
        )}
      >
        {LICENSES_PERKS[licenseType].title.split(" ")[0]}
        <br />
        {LICENSES_PERKS[licenseType].title.split(" ")[1]}
      </h3>
      <h4 className="my-6 text-4xl font-bold tracking-[1px] text-baseText">
        ARS ${price}
      </h4>
      <p className={cn(isCustom ? "mb-5" : "hidden")}>
        {LICENSES_PERKS[licenseType]?.description || ""}
      </p>
      <ul className="flex w-5/6 flex-col gap-2 text-start sm:w-[70%]">
        {LICENSES_PERKS[licenseType].perks.map((perk) => {
          return (
            <li key={`${licenseType}-${perk}`} className="lit-icon">
              {perk}
            </li>
          );
        })}
      </ul>
      <p
        className={cn(
          "mb-0 mt-auto pt-6 font-bold tracking-[1px] text-primary",
          !LICENSES_PERKS[licenseType].instantDelivery && "hidden"
        )}
      >
        🕓 Entrega inmediata
      </p>
    </div>
  );
};

export default License;
