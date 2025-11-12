import { Input } from "@/ui";

export const InstagramField = ({ register, errors }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold leading-none">Инстаграм</h2>

      <Input
        {...register("instagram_username")}
        className="mt-5"
        placeholder="Ваш username в Instagram"
        error={errors.instagram_username}
      />
    </div>
  );
};
