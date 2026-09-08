/**
 * Начальные данные: аккаунты, уроки из content/lessons, назначения.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import type { Level, Role } from "@prisma/client";
import { closeDb, prisma } from "../lib/prisma";
import { importLessons } from "../scripts/import-lessons";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

async function hashPassword(plain: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(plain, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function upsertUser(data: {
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
  level?: Level;
}) {
  const existing = await prisma.user.findUnique({
    where: { login: data.login },
    select: { id: true },
  });
  if (existing) return existing.id;

  const user = await prisma.user.create({
    data: { ...data, password: await hashPassword(data.password) },
    select: { id: true },
  });
  return user.id;
}

/** Назначает урок ученику и копирует словарь урока в его личный словарь */
async function assignLesson(lessonId: string, userId: string) {
  await prisma.lessonAssignment.upsert({
    where: { lessonId_userId: { lessonId, userId } },
    create: { lessonId, userId },
    update: {},
  });

  const words = await prisma.lessonWord.findMany({ where: { lessonId } });

  for (const word of words) {
    await prisma.word.upsert({
      where: { userId_english: { userId, english: word.english } },
      create: {
        userId,
        lessonWordId: word.id,
        english: word.english,
        russian: word.russian,
        partOfSpeech: word.partOfSpeech,
        transcription: word.transcription,
        example: word.example,
        definition: word.definition,
        definitionRu: word.definitionRu,
        audioUrl: word.audioUrl,
        imageUrl: word.imageUrl,
        source: "lesson",
      },
      update: { lessonWordId: word.id },
    });
  }
}

async function main() {
  const adminId = await upsertUser({
    login: "admin",
    email: "admin@master.english",
    firstName: "Анна",
    lastName: "Смирнова",
    password: "admin123",
    role: "ADMIN",
  });

  const studentId = await upsertUser({
    login: "student",
    email: "student@master.english",
    firstName: "Иван",
    lastName: "Петров",
    password: "student123",
    role: "STUDENT",
    level: "A2",
  });

  const stats = await importLessons(prisma, adminId);

  // Демо-ученику выдаём всю библиотеку, чтобы было что посмотреть.
  // Реальным ученикам уроки назначает администратор во вкладке «Ученики».
  const lessons = await prisma.lesson.findMany({ select: { id: true } });
  for (const lesson of lessons) {
    await assignLesson(lesson.id, studentId);
  }

  const words = await prisma.word.count({ where: { userId: studentId } });

  console.log("");
  console.log("✅ База заполнена");
  console.log(`   уроков: ${stats.createdLessons}, заданий в ДЗ: ${stats.createdTasks}`);
  console.log(`   назначено демо-ученику уроков: ${lessons.length}, слов: ${words}`);
  console.log("");
  console.log("   Администратор:  admin    / admin123");
  console.log("   Ученик:         student  / student123");
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });
