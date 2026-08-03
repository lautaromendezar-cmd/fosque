import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export type Novedad = {
  slug: string;
  titulo: string;
  fecha: string; // ISO yyyy-mm-dd
  fechaDisplay: string;
  html: string;
};

const DIR = path.join(process.cwd(), 'content', 'novedades');

export function getNovedades(): Novedad[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
      const { data, content } = matter(raw);
      const fecha = String(data.fecha ?? '1970-01-01');
      return {
        slug: f.replace(/\.md$/, ''),
        titulo: String(data.titulo ?? f),
        fecha,
        fechaDisplay: new Date(`${fecha}T12:00:00`).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        html: marked.parse(content) as string,
      };
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}
