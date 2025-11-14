import { Input, Button } from "@/ui";

export const FirstStep = ({ register, errors }) => {
  return (
    <>
      <h2 className="text-[32px] font-bold">Привяжите Instagram</h2>

      <p className="text-lg text-gray-400">
        Первое впечатление начинается здесь!
      </p>

      <Input
        {...register("instagram_username")}
        className="mt-10"
        placeholder="Ваш username в Instagram"
        error={errors.instagram_username}
      />

      <Button className="mt-3 w-full" type="submit">
        Далее
      </Button>
    </>
  );
};
