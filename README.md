# **erasmus-tsd-project**
### *Developed by Lucas BUTERY (ER) & Erwann GAUTHIER (ER1684)*

## **Tools used**
- **Frontend**
    - NextJs (React, Typescript)
    - Socket.io-client
- **Backend**
    - ExpressJS (Typescript)
    - Socket.io
    - Prisma (ORM)
- **Database**
    - PostgreSQL

## **Configuration**

### **Common**
- Create a PostgreSQL Database
- Install dependencies 
```bash
cd frontend/
npm install
cd ../backend/
npm install
```
- Create a .env file in the backend folder with this lines :
```txt
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
PORT="3001"
JWT_SECRET_KEY="YOUR_SECRET_KEY"
```
- Run Prisma migration
```bash
npx prisma migrate dev --name init
```

### **Developers Mode**
- In a terminal, run the frontend
```bash
cd frontend/
npm run dev
```
- In an other terminal, run the backend
```bash
npm run dev
```

### **Production mode**

- In a terminal, run the frontend
```bash
cd frontend/
npm run build
npm run start
```
- In an other terminal, run the backend
```bash
npm run build
npm run start
```
