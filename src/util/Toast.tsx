import { Bounce, toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "colored",
  transition: Bounce,
};

type ToastType = "success" | "error" | "info" | "warning" | "default";

export function mostrarToast(
  mensaje: string,
  tipo: ToastType,
  options: Partial<ToastOptions> = {},
) {
  const configurations = { ...defaultToastOptions, ...options };

  switch (tipo) {
    case "info":
      toast.info(mensaje, configurations);
      break;
    case "success":
      toast.success(mensaje, configurations);
      break;
    case "error":
      toast.error(mensaje, configurations);
      break;
    case "warning":
      toast.warn(mensaje, configurations);
      break;
    default:
      break;
  }
}
