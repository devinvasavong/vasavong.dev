import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostSummary = {
  slug: string;
  title: string;
  date: string | null;
  subtitle: string | null;
  tags: string[];
  publish: boolean;
};

export type Post = PostSummary & {
  content: string;
};

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((name) => {
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      const slug = name.replace(/\.mdx$/, "");

      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        subtitle: data.subtitle || null,
        tags: data.tags || [],
        publish: data.publish !== false,
      };
    })
    .filter((post) => post.publish)
    .sort((a, b) => {
      // newest to oldest
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (a.date) {
        return -1;
      } else if (b.date) {
        return 1;
      } else {
        return 0;
      }
    });

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || null,
      subtitle: data.subtitle || null,
      tags: data.tags || [],
      publish: data.publish !== false,
      content,
    };
  } catch {
    return null;
  }
}

export function getPostBySlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const slugs = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((name) => {
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      const slug = name.replace(/\.mdx$/, "");

      return data.publish !== false ? slug : null;
    })
    .filter((slug): slug is string => slug !== null);

  return slugs;
}
