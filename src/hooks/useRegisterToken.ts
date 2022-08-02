import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export const useRegisterToken = (game: string) => {
  const router = useRouter();
  const { mutate: registerToken, isLoading } = trpc.useMutation(
    "game.register-token",
    {
      onSuccess(token) {
        router.push(`/name?game=${game}&challenge=${token}`);
      },
    }
  );

  return {
    registerToken,
    isLoading,
  };
};
