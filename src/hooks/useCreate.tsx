import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

export const useCreate = (resource: string) => {
  const addProduct = async (values: any) => {
    return await axios.post(`http://localhost:3001/${resource}`, values);
  };

  const createMutation = useMutation({
    mutationFn: (values: any) => addProduct(values),
    onSuccess: () => {
      message.success("Thanh cong");
    },
  });

  return createMutation;
};
