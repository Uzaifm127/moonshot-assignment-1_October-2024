import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Email from "./components/Email";
import { EmailBody, EmailType } from "./types/state";
import { useGetFormattedTime } from "./hooks/get-formatted-time";

function App() {
  const [emails, setEmails] = useState<EmailType[] | never[]>([]);
  const [emailListLoading, setEmailListLoading] = useState(false);
  const [emailBodyLoading, setEmailBodyLoading] = useState(false);
  const [emailItemClick, setEmailItemClick] = useState(false);
  const [emailBody, setEmailBody] = useState<EmailBody | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<
    "read" | "favorite" | "unread" | ""
  >("");

  const { date, month, year, formattedTime } = useGetFormattedTime(
    emailBody?.dateAndTime || 0
  );

  useEffect(() => {
    (async () => {
      const emailList = localStorage.getItem(`emails-${page}`);

      if (!emailList) {
        try {
          setEmailListLoading(true);

          const { list } = (
            await axios.get(
              `https://flipkart-email-mock.vercel.app/?page=${page}`
            )
          ).data;

          localStorage.setItem(`emails-${page}`, JSON.stringify(list));
          setEmails(list);
        } catch (error) {
          console.error(error);
        } finally {
          setEmailListLoading(false);
        }
      } else {
        setEmails(JSON.parse(emailList));
      }
    })();
  }, [page]);

  const handleEmailUpdate = useCallback(
    (id: string, property: "read" | "favorite", value: boolean) => {
      setEmails((prev) => {
        const newEmailList = prev.map((email) =>
          email.id === id ? { ...email, [property]: value } : email
        );

        localStorage.setItem(`emails-${page}`, JSON.stringify(newEmailList));

        return newEmailList;
      });
    },
    [setEmails, page]
  );

  const onFilter = useCallback(
    (condition: "read" | "favorite" | "unread" | "all") => {
      const emails = localStorage.getItem(`emails-${page}`);

      if (!emails) {
        return;
      }

      const parsedEmails: EmailType[] = JSON.parse(emails);

      if (condition === "read") {
        setEmails(parsedEmails.filter((email) => email.read));
      } else if (condition === "favorite") {
        setEmails(parsedEmails.filter((email) => email.favorite));
      } else if (condition === "unread") {
        setEmails(parsedEmails.filter((email) => !email.read));
      } else {
        setEmails(parsedEmails);
      }
    },
    [page]
  );

  return (
    <div className="bg-[#F4F5F9] p-10 space-y-7">
      <header className="flex gap-6">
        <h4 className="font-medium">Filter By:</h4>

        <div className="flex gap-3">
          <button
            className={`px-3 rounded-full ${
              filterType === "unread" && "filter-button"
            }`}
            onClick={() => {
              setFilterType("unread");
              onFilter("unread");
            }}
          >
            Unread
          </button>
          <button
            className={`px-3 rounded-full ${
              filterType === "read" && "filter-button"
            }`}
            onClick={() => {
              setFilterType("read");
              onFilter("read");
            }}
          >
            Read
          </button>
          <button
            className={`px-3 rounded-full ${
              filterType === "favorite" && "filter-button"
            }`}
            onClick={() => {
              setFilterType("favorite");
              onFilter("favorite");
            }}
          >
            Favorite
          </button>
          {filterType && (
            <button
              className={`px-3 text-xs text-white rounded-full bg-[#E54065]`}
              onClick={() => {
                setFilterType("");
                onFilter("all");
              }}
            >
              Remove filters
            </button>
          )}
        </div>
      </header>

      <main className="relative">
        <section className="flex gap-5">
          {emailListLoading ? (
            <div className="flex items-center justify-center animate-pulse h-[90vh] w-full">
              <h2 className="text-4xl font-bold">Loading...</h2>
            </div>
          ) : (
            <ul className={`space-y-4 ${emailItemClick ? "w-1/3" : "w-full"}`}>
              {emails.length ? (
                <>
                  {emails.map((email) => (
                    <Email
                      key={email.id}
                      emailItemClick={emailItemClick}
                      email={email}
                      onEmailClick={async () => {
                        if (emailBodyLoading || emailBody?.id === email.id) {
                          return;
                        }

                        if (!email.read) {
                          handleEmailUpdate(email.id, "read", true);
                        }

                        setEmailItemClick(true);

                        setEmailBodyLoading(true);

                        try {
                          const { data } = await axios.get(
                            `https://flipkart-email-mock.now.sh/?id=${email.id}`
                          );

                          setEmailBody({
                            id: data.id,
                            body: data.body,
                            name: email.from.name,
                            favorite: email.favorite || false,
                            subject: email.subject,
                            dateAndTime: email.date,
                          });
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setEmailBodyLoading(false);
                        }
                      }}
                    />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center h-[70vh] w-full">
                  <h2 className="text-4xl font-bold">No mail found</h2>
                </div>
              )}

              <div className="flex">
                {Array.from({ length: 2 }).map((_, index, array) => (
                  <button
                    key={index}
                    className={`${
                      index === 0
                        ? "rounded-l-lg"
                        : index === array.length - 1
                        ? "rounded-r-lg"
                        : "rounded-none"
                    } ${
                      index + 1 === page && "bg-[#e1e4ea]"
                    } border-2 border-[#cfd2dc] px-3 py-1`}
                    onClick={() => {
                      setPage(index + 1);

                      setFilterType("");
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </ul>
          )}

          {emailItemClick && (
            <aside className="w-2/3 bg-white border-2 border-[#cfd2dc] flex gap-4 top-[20px] left-0 h-[80vh] overflow-y-scroll [scrollbar-width:none] text-[#636363] sticky rounded-md p-5 text-sm">
              {emailBodyLoading ? (
                <div className="flex items-center justify-center h-full animate-pulse w-full">
                  <h2 className="text-4xl font-bold">Loading...</h2>
                </div>
              ) : (
                <>
                  <div>
                    <div className="h-10 w-10 rounded-full text-base bg-[#E54065] flex items-center justify-center text-white">
                      {emailBody?.name[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="space-y-6 w-full">
                    <div className="flex justify-between w-full">
                      <h3 className="text-2xl font-bold">
                        {emailBody?.subject}
                      </h3>
                      <button
                        className="px-3 h-7 text-white text-xs rounded-full bg-[#E54065]"
                        onClick={() => {
                          if (!emailBody) {
                            return;
                          }

                          if (emailBody?.favorite) {
                            handleEmailUpdate(emailBody?.id, "favorite", false);

                            setEmailBody((prev) => ({
                              // As emailBody must be defined here
                              ...prev!,
                              favorite: false,
                            }));
                          } else {
                            handleEmailUpdate(emailBody?.id, "favorite", true);

                            setEmailBody((prev) => ({
                              // As emailBody must be defined here
                              ...prev!,
                              favorite: true,
                            }));
                          }
                        }}
                      >
                        {emailBody?.favorite
                          ? "Remove as favorite"
                          : "Mark as favorite"}
                      </button>
                    </div>

                    <p>
                      {date}/{month}/{year} {formattedTime}
                    </p>

                    <p
                      className="text-xs"
                      dangerouslySetInnerHTML={{
                        __html: emailBody?.body || "",
                      }}
                    ></p>
                  </div>
                </>
              )}
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
