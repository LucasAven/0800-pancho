/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "components/Loader";
import { GET_DOLLAR_VALUE_KEY, GET_PRICES_KEY } from "constants/index";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import type { PricesObject } from "types";
import {
  convertUSDPricesToARS,
  fetchDollarPrice,
  getPrices,
  updatePrices,
  zObject,
} from "utils";
import { z } from "zod";
import ModalInput from "components/ModalInput";
import Modal from "components/Modal";
import useCustomSwal from "hooks/useCustomSwal";

export interface IEditPricesModalProps {
  isEditingPrices: boolean;
  setIsEditingPrices: React.Dispatch<React.SetStateAction<boolean>>;
}

const pricesSchema = zObject<PricesObject>({
  basic: z.number().min(0),
  custom: z.number().min(0),
  premium: z.number().min(0),
});

const EditPricesModal: React.FC<IEditPricesModalProps> = ({
  isEditingPrices,
  setIsEditingPrices,
}) => {
  const { data: dollarValue } = useQuery(
    [GET_DOLLAR_VALUE_KEY],
    fetchDollarPrice,
    {
      staleTime: Infinity,
      retry: 3,
    }
  );

  const { data: prices } = useQuery([GET_PRICES_KEY], () => getPrices(), {
    staleTime: Infinity,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<PricesObject>({
    defaultValues: {
      basic: 0,
      custom: 0,
      premium: 0,
    },
    values: {
      basic: prices?.basic || 0,
      custom: prices?.custom || 0,
      premium: prices?.premium || 0,
    },
    resolver: zodResolver(pricesSchema),
  });

  const watchFields = watch();
  const convertedPrices = useMemo(
    () => convertUSDPricesToARS(watchFields, dollarValue),
    [watchFields, dollarValue]
  );

  const customSwal = useCustomSwal();

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    reset();
    setIsEditingPrices(false);
  };

  const editPricesMutation = useMutation(
    (data: PricesObject) => updatePrices(data),
    {
      onSettled: () => {
        setIsLoading(false);
      },
      onSuccess: async () => {
        void customSwal.fire(
          "¡Éxito!",
          "Precios actualizados correctamente.",
          "success"
        );
        await queryClient.invalidateQueries([GET_PRICES_KEY], { exact: false });
        closeModal();
      },
      onError: () => {
        void customSwal.fire(
          "¡Error!",
          "Ha ocurrido un error al intentar actualizar los precios. Inténtalo de nuevo.",
          "error"
        );
      },
    }
  );

  const onSubmit = async (data: PricesObject) => {
    setIsLoading(true);
    await editPricesMutation.mutateAsync(data);
  };

  const handleClose = () => {
    if (isDirty) {
      void customSwal
        .fire({
          title: "¿Estás seguro?",
          text: "Si cierras esta ventana, perderás los cambios que hayas hecho.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, cerrar",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) closeModal();
        });
    } else {
      closeModal();
    }
  };

  return (
    <Modal
      title="Editar Precios"
      isOpen={isEditingPrices}
      onClose={handleClose}
    >
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mt-2 flex flex-wrap justify-center gap-4 lg:mx-auto lg:max-w-fit lg:flex-col">
          {prices &&
            Object.entries(prices).map(([license]) => (
              <div
                key={license}
                className="flex items-center justify-start gap-2"
              >
                <ModalInput
                  id={`${license} price`}
                  name={license}
                  label={`${license} (USD)`}
                  type="number"
                  placeholder="10 USD"
                  register={register}
                  error={errors[license as keyof PricesObject]}
                  required
                />
                {!errors[license as keyof PricesObject] &&
                !isNaN(watchFields[license as keyof PricesObject]) ? (
                  <span className="text-gray-400">
                    ${convertedPrices[license as keyof PricesObject]} ARS
                  </span>
                ) : null}
              </div>
            ))}
        </div>
        <button
          type="submit"
          className="primary-button relative mx-auto mt-5"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="p-1.5" /> : "Guardar"}
        </button>
      </form>
    </Modal>
  );
};

export default EditPricesModal;
