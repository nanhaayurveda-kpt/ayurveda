import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.js",
  dialect: "turso",
  dbCredentials: {
    url: "libsql://ayurveda-ayurveda.aws-ap-south-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA4MTM3NzYsImlkIjoiMDE5ZWEwYzUtMTAwMS03YThjLWE5MjQtYmY3YWQ0YjZiMmFmIiwicmlkIjoiMGU2NDJlNTUtYTNmNS00MDFiLWE4YmQtYzBiOTc5MjExOGViIn0.c4J7GWtu6JJWrv-WQrFhigiYh4EAYlrEtAsSDjwa9ZiegYgiOe45Ylq3kIMWOjytW-fr39YUrl2gt4GyKFevAw",
  },
});