import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://ayurveda-ayurveda.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA4MTM3NzYsImlkIjoiMDE5ZWEwYzUtMTAwMS03YThjLWE5MjQtYmY3YWQ0YjZiMmFmIiwicmlkIjoiMGU2NDJlNTUtYTNmNS00MDFiLWE4YmQtYzBiOTc5MjExOGViIn0.c4J7GWtu6JJWrv-WQrFhigiYh4EAYlrEtAsSDjwa9ZiegYgiOe45Ylq3kIMWOjytW-fr39YUrl2gt4GyKFevAw"
});

await client.execute("DELETE FROM clinical_logs WHERE student_id = 1");
await client.execute("DELETE FROM internship_postings WHERE student_id = 1");
await client.execute("DELETE FROM exam_forms WHERE student_id = 1");
await client.execute("DELETE FROM fee_payments WHERE student_id = 1");
await client.execute("DELETE FROM fees WHERE student_id = 1");
await client.execute("DELETE FROM attendance WHERE student_id = 1");
await client.execute("DELETE FROM results WHERE student_id = 1");
await client.execute("DELETE FROM certificates WHERE student_id = 1");
await client.execute("DELETE FROM fee_concessions WHERE student_id = 1");
await client.execute("DELETE FROM students WHERE id = 1");

console.log("Done");