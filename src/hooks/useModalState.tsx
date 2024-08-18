import { useCallback, useState } from "react";

const useModalState = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const open = useCallback(() => {
    setVisible(true);
  }, []);
  const close = useCallback(() => {
    setVisible(false);
  }, []);
  return {
    visible,
    open,
    close
  };
};

export default useModalState;
