import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { Input, Button, Textarea, DateInput } from "@/ui";

export const SecondStep = ({
  errors,
  control,
  setValue,
  register,
  aboutPlaceholder,
}) => {
  return (
    <>
      <h2 className="text-[32px] font-bold">Данные о Вас</h2>

      <div className="mt-10">
        <Input
          {...register("first_name")}
          placeholder="Имя"
          error={errors.first_name}
        />

        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                field.onChange(date);
                // Триггерим валидацию сразу после выбора даты
                if (date) {
                  setValue("birthdate", date, {
                    shouldValidate: true,
                  });
                }
              }}
              customInput={<DateInput error={errors.birthdate} />}
              dateFormat="dd.MM.yyyy"
              wrapperClassName="mt-3 w-full"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          )}
        />

        <div className="mt-4">
          <div className="flex gap-6">
            {["male", "female"].map((value) => {
              const label = value === "male" ? "Мужской" : "Женский";
              return (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register("gender")}
                    className="hidden peer"
                  />

                  <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-400 peer-checked:border-primary-red">
                    <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary-red transition-all" />
                  </div>

                  <span className="transition font-semibold">{label}</span>
                </label>
              );
            })}
          </div>

          {errors.gender && (
            <p className="mt-2 text-light-red font-semibold">
              {errors.gender.message}
            </p>
          )}
        </div>

        <Textarea
          {...register("about")}
          className="mt-4"
          placeholder={aboutPlaceholder}
          error={errors.about}
        />
      </div>

      <Button className="mt-4 w-full" type="submit">
        Далее
      </Button>
    </>
  );
};
