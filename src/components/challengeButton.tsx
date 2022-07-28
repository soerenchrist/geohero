import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./common/button";
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

  const handleCopy = async () => {
    if (data) await navigator.clipboard.writeText(data.token);
  };

  return (
    <>
      {data && (
        <div className="flex">
          <input
            className="w-64 px-4 font-medium disabled:bg-gray-100 placeholder:text-gray-400 text-lg text-center h-12 rounded-l-full"
            disabled
            value={data.token}
          ></input>
          <button
            onClick={handleCopy}
            className="w-12 h-12 rounded-r-full  bg-gradient-to-br from-pink-300 to-rose-500"
          >
            <CopyIcon className="w-6 h-6 m-auto" />
          </button>
        </div>
      )}
      {!data && (
        <Button
          variant="secondary"
          onClick={() => setEnabled(true)}
          disabled={isLoading}
        >
          Create challenge
        </Button>
      )}
    </>
  );
};

export default ChallengeButton;
