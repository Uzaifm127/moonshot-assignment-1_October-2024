## Email Client Application

This application allows users to view and manage emails. 

### Inputs

The application fetches email data from an external API. The API provides two endpoints:

* **Email List:** Retrieves a list of emails, paginated by page number. 
* **Email Body:**  Retrieves the full body of a specific email based on its ID.

The application also interacts with local storage to cache email data.

### Outputs

* **Email List:** Displays a list of emails with sender information, subject, and a short description. Users can filter the list by read, unread, or favorite emails.
* **Email Body:**  Displays the full content of a selected email, including the sender's name, subject, date, and body. Users can mark an email as a favorite or remove it from favorites.

The application provides pagination to view multiple pages of emails and uses animation to indicate loading states while fetching data.