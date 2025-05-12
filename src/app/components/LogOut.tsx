"use client";

import { Button } from "@/components/ui/button";
import { DOMAIN } from "../utils/constant";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LogOut = () => {
  const router = useRouter();
  const LogOutHandler = async () => {
    try {
      await axios.get(`${DOMAIN}/api/users/logout`);
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.warning("someting went wrong");
      console.log(err);
    }
  };
  return (
    <Button
      className="cursor-pointer"
      variant={"ghost"}
      onClick={LogOutHandler}
    >
      Logout
    </Button>
  );
};

export default LogOut;
