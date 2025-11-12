import { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { ABOUT_PLACEHOLDER } from "@/constants";
import { Input, Textarea, DateInput } from "@/ui";

const getRandomAboutPlaceholder = () => {
  return ABOUT_PLACEHOLDER[
    Math.floor(Math.random() * ABOUT_PLACEHOLDER.length)
  ];
};

export const AboutField = ({
  errors,
  control,
  setValue,
  register,
  genericError,
}) => {
  const [aboutPlaceholder] = useState(getRandomAboutPlaceholder());

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold">О себе</h2>

      <div className="mt-5">
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
              selected={field.value}
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

        <Textarea
          {...register("about")}
          className="mt-3"
          placeholder={aboutPlaceholder}
          error={errors.about}
        />
      </div>

      {genericError && (
        <div className="mt-4 w-full p-4 border-2 border-primary-gray/30 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-2xl font-semibold text-light-red">
          {genericError}
        </div>
      )}
    </div>
  );
};
