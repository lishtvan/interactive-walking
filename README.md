# Interactive Walking

## Setup

```bash
git clone git@github.com:lishtvan/interactive-walking.git
```

Run the server, make sure to have redis running on your machine.

```bash
cd backend

npm i

npm run start
```

Run the frontend.

```bash
cd frontend

npm i

npm run dev
```

## Logs

```
userC joined explore
userB joined explore
userA joined explore

userC invited userB to walk
User accepted walk invite, and 2 users joined walk: userC, userB

User exited walk
userC joined explore
userB joined explore
```
