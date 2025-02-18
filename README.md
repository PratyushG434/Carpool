# IIT Indore Carpool App

A ride-sharing web application designed for **IIT Indore students**, enabling them to share rides, reduce costs, and travel efficiently.

## Features

- Google OAuth login (restricted to `@iiti.ac.in` emails)  
- Create rides by specifying source, destination, date , time  and seats available and contact info  
- Search for available rides based on source, destination and time 
- Approve or decline ride requests  
- View past requests made by you
- Notification badge for any pending requests on your created rides
- View or delete your created rides
- Withdraw ride requests before approval  
- Rate rides based on your experience after completion 
- View ratings of your past rides
- View all the rides created by others and send request for any ride

## Tech Stack  

**Frontend:**  
- React.js  
- Material-UI (MUI)  
- Bootstrap  

**Backend:**  
- Node.js (Express)  
- PostgreSQL  
- Google OAuth  

## Deployment   
- **Database:** Supabase (PostgreSQL)  


## Steps to Run Locally  

### 1. Clone the Repository  

```sh
git clone https://github.com/PratyushG434/Carpool.git
cd Carpool

```

### 2.Setup backend

```sh
cd backend
npm install
node index.js

```

### 3. Setup frontend in a new terminal leaving the backend running
```sh
cd frontend
npm install
npm run dev

```

### Ensure you are in the right directory that is in backend while running node index.js and frontend while running npm run dev 

### I have included some screenshots of the project for your reference in the screenshots folder