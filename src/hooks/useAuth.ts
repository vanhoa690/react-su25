import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

export const useAuth = (resource: string) => {
  const authUser = async (values: any) => {
    const res = await axios.post(`http://localhost:3001/${resource}`, values);
    return res.data;
  };

  const authMutation = useMutation({
    mutationFn: (values: any) => authUser(values),
    onSuccess: (data) => {
      message.success("Thanh cong");
      localStorage.setItem("token", data.accessToken);
    },
    onError: () => {
      message.error("That bai");
    },
  });

  return authMutation;
};
