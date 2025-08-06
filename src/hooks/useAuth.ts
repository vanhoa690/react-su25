import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAuth = (resource: string) => {
  const nav = useNavigate();
  const authUser = async (values: any) => {
    const res = await axios.post(`http://localhost:3001/${resource}`, values);
    return res.data;
  };

  const authMutation = useMutation({
    mutationFn: authUser,
    onSuccess: (data) => {
      message.success("Thanh cong");
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      resource === "register" ? nav("/login") : nav("/");
    },
    onError: () => {
      message.error("That bai");
    },
  });

  return authMutation;
};
