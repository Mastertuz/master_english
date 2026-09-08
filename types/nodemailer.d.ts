// В nodemailer нет собственных деклараций типов, а пакет @types/nodemailer
// нам не нужен: модуль используется в одном месте (lib/mail.ts).
declare module "nodemailer";
