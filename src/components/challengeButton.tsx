import { useState } from "react";
import { trpc } from "../utils/trpc";
import CopyIcon from "./icons/copy";

const ChallengeButton: React.FC<{
  onTokenGenerate: (token: string) => void;
}> = ({ onTokenGenerate }) => {
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading } = trpc.useQuery(["game.get-game-token"], {
    enabled: enabled,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      onTokenGenerate(data.token);
    },
  });

  return (
    <>
      {data && (
        <div className="flex">
          <input
            className="w-64 px-4 font-medium disabled:bg-gray-100 placeholder:text-gray-400 text-lg text-center h-12 rounded-l-full"
            disabled
            value={data.token}
          ></input>
          <button className="w-12 h-12 rounded-r-full bg-sky-400">
            <CopyIcon className="w-6 h-6 m-auto" />
          </button>
        </div>
      )}
      {!data && (
        <button
          onClick={() => setEnabled(true)}
          disabled={isLoading}
          className="w-48 h-16 text-lg font-medium rounded-full hover:scale-105 bg-gradient-to-br from-sky-300 text-black to-pink-500"
        >
          Create challenge
        </button>
      )}
    </>
  );
};

export default ChallengeButton;
