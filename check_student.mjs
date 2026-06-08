// check_student.mjs
import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://ayurveda-ayurveda.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA4MTM3NzYsImlkIjoiMDE5ZWEwYzUtMTAwMS03YThjLWE5MjQtYmY3YWQ0YjZiMmFmIiwicmlkIjoiMGU2NDJlNTUtYTNmNS00MDFiLWE4YmQtYzBiOTc5MjExOGViIn0.c4J7GWtu6JJWrv-WQrFhigiYh4EAYlrEtAsSDjwa9ZiegYgiOe45Ylq3kIMWOjytW-fr39YUrl2gt4GyKFevAw"
});

const students = await client.execute("SELECT id, name FROM students LIMIT 5");
console.log("Students:", JSON.stringify(students.rows));

const fees = await client.execute("SELECT id, student_id, amount, paid_amount, status FROM fees LIMIT 5");
console.log("Fees:", JSON.stringify(fees.rows));