import { Typography } from "@repo/ui/src/components/typography";

export const PasswordChange = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 w-full">
      <Typography variant="dialogTitle">
        Смена пароля
      </Typography>
      <div className="flex flex-col gap-y-2 w-full p-2">
        <Typography textSize="medium" textColor="shark_white">
          Для того чтобы сменить пароль, в игре введите команду:
        </Typography>
        <Typography textSize="medium">
          <pre className="bg-shark-900 px-2 py-1 rounded-lg">
            <code>/changepassword [старый пароль] [новый пароль]</code>
          </pre>
        </Typography>
      </div>
    </div>
  );
};
