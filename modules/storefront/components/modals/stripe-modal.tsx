import { useModalStore } from "@/utils/ModalState";


export default function StripeModal() {
  const { open, src } =
    useModalStore(state => state.modals.stripe);
  const { close } = useModalStore(state => state);

  if (!open) return;

  return (
    <div className="absolute top-0 z-100 flex items-center-safe w-screen h-screen p-5">
      <button
        onClick={() => close("stripe")}
      >
        Close
      </button>
      <iframe
        src={src}
        title="Stripe Checkout"
        className="w-1/2 h-full"
      />
    </div>
  )
}