export type Post = {
  title: string;
  description: string;
  date: string;
  published: boolean;
  content: string;
  [key: string]: unknown;
};

export default function BlogCard({ post }: { post: Post }) {
  return (
    <div className="blog-card">
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <p>{new Date(post.date).toLocaleDateString()}</p>
    </div>
  );
}