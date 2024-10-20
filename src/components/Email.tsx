import { useGetFormattedTime } from "../hooks/get-formatted-time";
import { EmailProps } from "../types/props";

const Email: React.FC<EmailProps> = ({
  email,
  emailItemClick,
  onEmailClick,
}) => {
  const { date, month, year, formattedTime } = useGetFormattedTime(email.date);

  return (
    <li
      className={`border-2 border-[#cfd2dc] text-[#636363] cursor-pointer ${
        email.read ? "bg-[#F2F2F2]" : "bg-white"
      } rounded-md flex gap-5 w-full py-2 px-5`}
      onClick={() => onEmailClick()}
    >
      <div className="h-10 w-10 rounded-full bg-[#E54065] flex items-center justify-center text-white">
        {email.from.name[0].toUpperCase()}
      </div>
      <div
        className={`text-sm space-y-2 ${
          emailItemClick ? "w-[19rem]" : "w-full"
        }`}
      >
        <p>
          From:{" "}
          <strong>
            {email.from.name} {email.from.email}
          </strong>
        </p>
        <p>
          Subject: <strong>{email.subject}</strong>
        </p>
        <p>{email.short_description}</p>

        <div className="flex items-center gap-8">
          <p>
            {date}/{month}/{year} {formattedTime}
          </p>{" "}
          {email.favorite && <p className="text-[#E54065]">Favorite</p>}
        </div>
      </div>
    </li>
  );
};

export default Email;
