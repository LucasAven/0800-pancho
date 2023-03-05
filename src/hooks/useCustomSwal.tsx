import Swal from "sweetalert2";
const useCustomSwal = () =>
  Swal.mixin({
    background: "#1a1a1a",
    color: "#eee",
    customClass: {
      actions: "flex justify-center gap-5",
      confirmButton: "primary-button text-white",
      cancelButton: "primary-button hover:!bg-red-700 bg-red-600 text-white",
      denyButton: "primary-button hover:!bg-red-700 bg-red-600 text-white",
    },
    buttonsStyling: false,
  });

export default useCustomSwal;
