import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

export const useUpdate = (id?: string | number) => {
  const addProduct = async (values: any) => {
    if (!id) return;
    return await axios.put(`http://localhost:3001/products/${id}`, values);
  };

  const updateMutaion = useMutation({
    mutationFn: (values: any) => addProduct(values),
    onSuccess: () => {
      message.success("Thanh cong");
    },
  });

  return updateMutaion;
};
