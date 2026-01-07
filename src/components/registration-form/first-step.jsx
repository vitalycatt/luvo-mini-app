import { Input, Button } from "@/ui";

export const FirstStep = ({ register, errors }) => {
  return (
    <>
      <h2 className="text-[32px] font-bold">Привяжите Instagram/Telegram</h2>

      <p className="text-lg text-gray-400">
        Первое впечатление начинается здесь!
      </p>

      <Input
        {...register("instagram_username")}
        className="mt-10"
        placeholder="Ваш username в Instagram или Telegram"
        error={errors.instagram_username}
      />

      <Button className="mt-3 w-full" type="submit">
        Далее
      </Button>
    </>
  );
};
