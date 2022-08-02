import { NextPage } from "next";
import { useRouter } from "next/router";
import { Button } from "../components/common/button";
import Container from "../components/common/container";
import Input from "../components/common/input";
import Meta from "../components/common/meta";
import { useUsername } from "../hooks/useUsername";

const NamePage: NextPage = () => {
  const { name, setName, saveName } = useUsername();
  const router = useRouter();
  const handleStart = () => {
    const query = router.query;
    saveName();

    router.push(`/${query.game}?challenge=${query.challenge}`);
  };

  return (
    <>
      <Meta />
      <Container>
        <div className="flex flex-col h-screen justify-center items-center">
          <label className="font-medium text-sm text-white" htmlFor="name">
            Enter your name
          </label>
          <Input
            id="name"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />
          <div className="p-4" />
          <Button
            variant="primary"
            disabled={name.length === 0}
            onClick={handleStart}
          >
            Start game
          </Button>
        </div>
      </Container>
    </>
  );
};

export default NamePage;
