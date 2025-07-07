/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { User, Course, Lesson } from '../types';

const BASE_URL = 'https://randomuser.me/api/';
const DB_PATH = path.join(process.cwd(), 'db', 'db.json');

async function populate(n_users: number): Promise<User[]> {
  const res = await fetch(
    `${BASE_URL}?inc=name,email,login&results=${n_users}`,
  );
  const data = await res.json();

  const users: User[] = data.results.map((user: any) => ({
    id: user.login.uuid,
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    password: user.login.password,
  }));

  return users;
}

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function populateCourses(n_courses: number, users: User[]): Course[] {
  const courses: Course[] = [];

  for (let i = 0; i < n_courses; i++) {
    const creator = pickRandom(users);
    const instructorsCount = Math.floor(Math.random() * 3) + 1;
    const instructors = Array.from(
      new Set(
        Array.from({ length: instructorsCount }, () => pickRandom(users).id),
      ),
    );

    const start_date = randomDate(new Date(2020, 0, 1), new Date());
    const end_date = randomDate(new Date(start_date), new Date(2025, 11, 31));

    courses.push({
      id: randomUUID(),
      name: `Course ${i + 1}`,
      description: `This is the description for course ${i + 1}.`,
      start_date,
      end_date,
      creator_id: creator.id,
      instructors,
    });
  }

  return courses;
}

function populateLessons(
  n_lessons: number,
  courses: Course[],
  users: User[],
): Lesson[] {
  const statuses: Lesson['status'][] = ['draft', 'published', 'archived'];
  const lessons: Lesson[] = [];

  for (let i = 0; i < n_lessons; i++) {
    const course = pickRandom(courses);
    const creator = pickRandom(users);
    const publish_date = randomDate(
      new Date(course.start_date),
      new Date(course.end_date),
    );

    lessons.push({
      id: randomUUID(),
      title: `Lesson ${i + 1}`,
      status: pickRandom(statuses),
      publish_date,
      video_url: `https://videos.example.com/video${i + 1}.mp4`,
      course_id: course.id,
      creator_id: creator.id,
    });
  }

  return lessons;
}

async function generateAndAppendDB() {
  // 1. Ler dados existentes
  let db = {
    users: [] as User[],
    courses: [] as Course[],
    lessons: [] as Lesson[],
  };

  try {
    const fileContent = await fs.readFile(DB_PATH, 'utf-8');
    db = JSON.parse(fileContent);
  } catch (error) {
    console.log('Arquivo db.json não encontrado ou vazio. Criando um novo.');
  }

  // 2. Gerar novos dados
  const newUsers = await populate(10);
  const newCourses = populateCourses(3, newUsers);
  const newLessons = populateLessons(15, newCourses, newUsers);

  // 3. Concatenar aos dados existentes
  db.users = db.users.concat(newUsers);
  db.courses = db.courses.concat(newCourses);
  db.lessons = db.lessons.concat(newLessons);

  // 4. Salvar arquivo atualizado
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Arquivo db atualizado em ${DB_PATH}`);
}

generateAndAppendDB().catch(console.error);
