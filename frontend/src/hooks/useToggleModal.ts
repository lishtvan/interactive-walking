import { useCallback, useState } from "react";

const useToggleModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  return { isModalOpen, toggleModal };
};

export default useToggleModal;