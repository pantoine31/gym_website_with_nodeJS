# gym_website_with_nodeJS

# Job description

In the context of this work, a network-centric information system should be developed
to manage users and reservations of a gym. The system will consist of 2
subsystems, the administrative and user system, and will support the following:

# A. Management system

# 1. Manage registration requests in the system:

The system administrator will have access
to the requests for registration in the system and to approve or reject them. The registration process
of users is detailed below.

# 2. System User Management:
   
The system administrator will have access to the users
of the system and will be responsible for updating their data in the database
(Create Read Update Delete - CRUD operations). It will also have the ability to assign or to
modifies a user's role.

# 3. Management of system building blocks:
   
 The system administrator will have access in all elements of the gym system related to the services it provides
offers users and, more specifically, will be responsible for updating the data
of them in the database (Create Read Update Delete - CRUD operations). Among the items
which will be managed are:
• the gymnasts
• the programs offered (eg pilates, strength training, swimming pool).
• The program for group programs (day, time, trainer). For each program a maximum capacity of people should be listed.


# 4. Management of announcements/offers:

The administrator will be able to post announcements and offers which will only be visible to registered users. It will also be able to
modify and delete announcements.


# B. User system

# 1. Browse the gym services. 
A simple user of the system will be able to
displays a list of services offered by the gym (not their program
programs though) without being registered in the system and without having entered it
with his username and password.


# 2. Product/service reservation. 
The use of the gym services will only be done with
appointment. If a user wishes to make an appointment in one of the individual or group settings
programs of the gym should first be entered into the system with his details.
First, he will search for availability based on the program he wants and the date.
If there is a vacancy in the time slot he wishes, he will be able to make an appointment, otherwise he will
must choose another time slot. The user will be able to cancel his appointment up to 2 hours
before the start time, while if he makes 2 cancellations within the week he will not be given it
right to make an appointment for any of the remaining days of the week.

# 3. Booking history: 
The user will be able to see a list of all the bookings he has made on
system until that moment.

# 4. News/announcements.
The user will be able to see news and announcements posted by
the gym


To register users in the system, the following steps should be followed: Each user who
wishes to make a reservation through the system should be registered in it. To make
registration in the system, a user will have to fill in to register in the system a form
with his details, which will be, at a minimum, first name, last name, country, city, address, e-mail,
username and password. The system administrator will then review the registration request at
system and, if it accepts it, will assign a role to the user (simple user or administrator). Depending
with the assigned role a user gains access to its respective subsystem
information system.

## Implementation issues

1. The database of the network-centric information system to be developed can
is SQL (eg MySQL) or noSQL (eg MongoDB)

2. The transactions (transactions) of the administrator and the simple user with the database will
are done through appropriate Rest apis, which will be developed in java or other language of choice
your.

3. The functions of the information system should be accessible through a web browser.

4. The implementation of both the functions and the interface of the information system will be done with
languages of your choice (e.g. HTML/CSS, Javascript, PHP, etc.).

5. In the user registration form the possible values for the fields "Country" and "City" will be available
via drop down list boxes. These values should be retrieved via a REST api available
on the internet (e.g. Countries & Cities API -
https://documenter.getpostman.com/view/1134062/T1LJjU52 ).

6. The application to be implemented should be user-friendly (eg display messages
that inform the user of an action he has taken or is about to take, display a list
options where required etc.).

7. All pages should have appropriate exception handling mechanisms built into them
(exception handling), so that the system is stable.

8. The source code should be adequately commented.































