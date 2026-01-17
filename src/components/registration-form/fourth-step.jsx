import { Button } from "@/ui";
import { Spinner, AnimatedText } from "@/components";

const welcomeLines = [
  "Добро пожаловать",
  "в экосистему Luvo —",
  "знакомься,",
  "общайся,",
  "влюбляйся.",
];

export const FourthStep = ({ onContinue, isLoading }) => {
  return (
    <>
      <div className="mt-16">
        <AnimatedText lines={welcomeLines} baseDelay={400} wordDelay={70} />
      </div>

      <Button className="mt-[400px] w-full" type="button" onClick={onContinue} disabled={isLoading}>
        {!isLoading ? "Добро пожаловать" : <Spinner size="sm" />}
      </Button>
    </>
  );
};
